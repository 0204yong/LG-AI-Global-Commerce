// ==================== 2-TIER MULTI-AGENT ARCHITECTURE (PROXY -> MASTER -> MCP) ====================
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import fetch from "node-fetch";

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'gemma4:e4b';

async function isOllamaAvailable() {
    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2000); 
        const res = await fetch(`${OLLAMA_URL}/api/tags`, { signal: controller.signal });
        clearTimeout(timeout);
        return res.ok;
    } catch {
        return false;
    }
}

function convertMcpToolsToOpenAI(mcpTools) {
    if (!mcpTools || mcpTools.length === 0) return undefined;
    return mcpTools.map(tool => ({
        type: "function",
        function: { name: tool.name, description: tool.description, parameters: tool.inputSchema }
    }));
}

function convertMcpToolsToGemini(mcpTools) {
    if (!mcpTools || mcpTools.length === 0) return undefined;
    return mcpTools.map(tool => ({
        name: tool.name,
        description: tool.description,
        parameters: { type: "OBJECT", properties: tool.inputSchema.properties, required: tool.inputSchema.required }
    }));
}

function convertHistoryToMessages(systemPrompt, history, userText) {
    const messages = [{ role: "system", content: systemPrompt }];
    if (history && Array.isArray(history)) {
        for (const turn of history) {
            const role = turn.role === 'model' ? 'assistant' : 'user';
            const content = turn.parts?.[0]?.text || '';
            if (content) messages.push({ role, content });
        }
    }
    messages.push({ role: "user", content: userText });
    return messages;
}

// ==================== 메인 핸들러 ====================
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({error: 'Method not allowed'});
    
    let mcpClient = null;
    let mcpTransport = null;

    try {
        const { text, activeAgent, history, storeState } = req.body;
        const isCsMode = activeAgent === 'atlas_cs';
        const apiKey = process.env.GEMINI_API_KEY;

        // ==========================================
        // TIER 1: Proxy Agent (Atlas) Logic
        // ==========================================
        console.log('🤖 [TIER 1] Calling Proxy Agent (Atlas)...');
        let proxyInstruction = `당신은 LG 커머스의 친절한 프론트엔드 고객센터 챗봇 'Atlas'입니다.
당신의 임무: 사용자가 인사를 하거나 일반적인 질문을 하면 상냥하게 직접 답변하세요.
단, 백엔드 조작(제품 추가, 테마 변경, 재고 수정, 배포, 쿠폰 발급 등)이 필요한 시스템 명령을 내리면 'delegate_to_master' 도구를 호출하여 인트라넷 백엔드 마스터에게 결재를 올리십시오.
현재 DB 상태: ${storeState || '정보 없음'}`;

        let proxyContents = [];
        if (history && Array.isArray(history) && history.length > 0) {
            proxyContents = [...history, { role: "user", parts: [{ text: text }] }];
        } else {
            proxyContents = [{ role: "user", parts: [{ text }] }];
        }

        const proxyPayload = {
            systemInstruction: { parts: [{ text: proxyInstruction }] },
            contents: proxyContents,
            tools: [{ 
                functionDeclarations: [{
                    name: "delegate_to_master",
                    description: "시스템 제어나 백엔드 조작이 필요할 때 마스터 에이전트(Orchestrator)를 호출합니다.",
                    parameters: { type: "OBJECT", properties: { exact_task: { type: "string", description: "사용자가 요청한 작업 내용 요약" } }, required: ["exact_task"] }
                }] 
            }],
            toolConfig: { functionCallingConfig: { mode: "AUTO" } }
        };

        const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;
        
        let proxyResponseRaw = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(proxyPayload)
        });
        
        const proxyData = await proxyResponseRaw.json();
        if (proxyData.error) throw new Error("Tier 1 Error: " + proxyData.error.message);
        
        const proxyPart = proxyData.candidates?.[0]?.content?.parts?.[0];

        // 만약 프록시가 직접 답변할 수 있다면 여기서 통신 종료 (마스터 불필요)
        if (proxyPart?.text && !proxyPart?.functionCall) {
            console.log('✅ [TIER 1] Proxy Agent handled the request directly.');
            return res.status(200).json({ type: 'text', text: proxyPart.text });
        }

        // ==========================================
        // TIER 2: Master Agent (Orchestrator) Logic
        // Proxy가 권한 넘김에 동의했을 경우 실행됨
        // ==========================================
        let delegatedTask = text;
        if (proxyPart?.functionCall && proxyPart.functionCall.name === 'delegate_to_master') {
            delegatedTask = proxyPart.functionCall.args.exact_task || text;
            console.log(`🧠 [TIER 2] Proxy requested Master processing for: ${delegatedTask}`);
        } else {
            console.log(`🧠 [TIER 2] Escaping to Master logic...`);
        }

        // MCP 연결 
        const targetMcpHost = isCsMode 
            ? (process.env.CS_MCP_URL || 'https://atlas-cs-docker-mcp.onrender.com') 
            : (process.env.ADMIN_MCP_URL || 'https://lg-admin-docker-mcp-yk.onrender.com');

        mcpTransport = new SSEClientTransport(new URL(`${targetMcpHost}/sse`));
        mcpClient = new Client({ name: "lg-master-orchestrator", version: "1.2.0" }, { capabilities: {} });
        await mcpClient.connect(mcpTransport);
        const toolsResult = await mcpClient.listTools();
        const availableMcpTools = toolsResult.tools;

        const masterInstruction = `당신은 LG 커머스의 백엔드 시스템을 통제하는 마스터 오케스트레이터(Antigravity Persona)입니다. 프론트엔드 에이전트로부터 다음 업무를 위임 받았습니다: "${delegatedTask}"
당신은 모든 MCP 권한에 접근할 수 있습니다. 위임받은 업무를 달성하기 위해 가장 적절한 도구(Tool)를 즉시 실행하세요. 직접 텍스트로 대답하지 마세요.`;

        const masterPayload = {
            systemInstruction: { parts: [{ text: masterInstruction }] },
            contents: [{ role: "user", parts: [{ text: delegatedTask }] }],
            tools: [{ functionDeclarations: convertMcpToolsToGemini(availableMcpTools) }],
            toolConfig: { functionCallingConfig: { mode: "ANY" } } // 무조건 도구를 쓰도록 강제
        };

        let masterResponseRaw = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(masterPayload)
        });

        const masterData = await masterResponseRaw.json();
        if (masterData.error) throw new Error("Tier 2 Error: " + masterData.error.message);
        const masterPart = masterData.candidates?.[0]?.content?.parts?.[0];

        // 3. MCP 도구 실행 (원격 3001/3002 서버 강제 호출)
        if (masterPart?.functionCall) {
            const toolCallObj = { name: masterPart.functionCall.name, args: masterPart.functionCall.args };
            console.log(`[MCP Router] Master Agent delegating execution to MCP: ${toolCallObj.name}`);
            
            const toolExecutionResult = await mcpClient.callTool({
                name: toolCallObj.name,
                arguments: toolCallObj.args || {}
            });

            let resultDataParsed = {};
            if (toolExecutionResult.content && toolExecutionResult.content.length > 0) {
                try {
                    resultDataParsed = JSON.parse(toolExecutionResult.content[0].text);
                } catch(e) {
                    resultDataParsed = { raw: toolExecutionResult.content[0].text };
                }
            }

            return res.status(200).json({
                type: 'function_call',
                name: toolCallObj.name,
                args: toolCallObj.args || {},
                executionResult: resultDataParsed 
            });
        }

        return res.status(200).json({ type: 'text', text: "시스템 통제권 결재 중 오류가 발생했습니다. 나중에 다시 시도해주세요." });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: e.message });
    } finally {
        if (mcpTransport) {
            try { await mcpTransport.close(); } catch(e){}
        }
    }
}
