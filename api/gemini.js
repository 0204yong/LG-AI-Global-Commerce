// ==================== DUAL BACKEND (MCP Client 통신 기반) ====================
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

// MCP 도구를 OpenAI 포맷으로 변환 (Ollama용)
function convertMcpToolsToOpenAI(mcpTools) {
    if (!mcpTools || mcpTools.length === 0) return undefined;
    return mcpTools.map(tool => ({
        type: "function",
        function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.inputSchema
        }
    }));
}

// MCP 도구를 Gemini 포맷으로 변환 (클라우드 Gemini용)
function convertMcpToolsToGemini(mcpTools) {
    if (!mcpTools || mcpTools.length === 0) return undefined;
    return mcpTools.map(tool => ({
        name: tool.name,
        description: tool.description,
        parameters: {
            type: "OBJECT",
            properties: tool.inputSchema.properties,
            required: tool.inputSchema.required
        }
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

        // 1. 라우팅: Agent 타입에 따라 다른 로컬/클라우드 MCP 서버 할당
        const isCsMode = activeAgent === 'atlas_cs';
        const targetMcpHost = isCsMode 
            ? (process.env.CS_MCP_URL || 'http://127.0.0.1:3002') 
            : (process.env.ADMIN_MCP_URL || 'http://127.0.0.1:3001');

        // 2. MCP 클라이언트 연결 확립 (Server-Sent Events)
        mcpTransport = new SSEClientTransport(new URL(`${targetMcpHost}/sse`));
        mcpClient = new Client({ name: "lg-api-gateway", version: "1.0.0" }, { capabilities: {} });
        await mcpClient.connect(mcpTransport);

        // 3. MCP 서버로부터 동적 지원 도구 목록(Tools) 스크랩핑
        const toolsResult = await mcpClient.listTools();
        const availableMcpTools = toolsResult.tools;

        // 4. 프롬프트 세팅
        let systemInstruction = "";
        if (isCsMode) {
            systemInstruction = "당신은 LG 커머스의 고객센터를 전담하는 'Atlas CS 챗봇'입니다. 사용자들에게 매우 친절하고 상냥하게 존댓말로 응대하세요. 배송 상태, 환불 문의 시 반드시 제공된 도구를 사용하십시오.";
        } else {
            systemInstruction = `당신은 LG 글로벌 커머스의 수석 안내원(Admin)입니다. 현재 활성 에이전트 분과는 [${activeAgent}]입니다. 
            [중요 지침: 본인이 직접 정보를 가공하기 보다는, 사용자 요청을 분석하여 즉시 도구(Tool Call)를 사용해 응답해주세요. 오류나 거절을 최소화하세요.]`;
        }

        if (storeState) {
            systemInstruction += `\n\n[현재 DB(상품) 상태 요약]\n${storeState}\n\n* 당신은 이 상품 DB를 인지하고 있습니다. 능동적으로 활용하세요.`;
        }

        const useLocal = process.env.USE_LOCAL_LLM === 'true';
        let isToolCalled = false;
        let toolCallObj = null;
        let textResult = null;

        // 5. LLM 질의 (Dual Backend)
        if (useLocal && await isOllamaAvailable()) {
            // Ollama 호출
            console.log('🔒 [LOCAL] Gemma4 via Ollama with MCP');
            const messages = convertHistoryToMessages(systemInstruction, history, text);
            const ollamaPayload = {
                model: OLLAMA_MODEL,
                messages,
                stream: false,
                options: { temperature: 0.7, num_predict: 1024 }
            };
            if (availableMcpTools.length > 0) ollamaPayload.tools = convertMcpToolsToOpenAI(availableMcpTools);

            const response = await fetch(`${OLLAMA_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ollamaPayload)
            });
            const data = await response.json();
            
            if (data.message?.tool_calls && data.message.tool_calls.length > 0) {
                isToolCalled = true;
                const tc = data.message.tool_calls[0];
                toolCallObj = { name: tc.function.name, args: tc.function.arguments };
            } else if (data.message?.content) {
                textResult = data.message.content;
            }
        } else {
            // Gemini 클라우드 호출
            console.log('☁️ [CLOUD] Gemini API with MCP');
            const apiKey = process.env.GEMINI_API_KEY;
            
            let geminiContents = [];
            if (history && Array.isArray(history) && history.length > 0) {
                geminiContents = [...history, { role: "user", parts: [{ text: text }] }];
            } else {
                geminiContents = [{ role: "user", parts: [{ text }] }];
            }

            const geminiPayload = {
                systemInstruction: { parts: [{ text: systemInstruction }] },
                contents: geminiContents
            };

            if (availableMcpTools.length > 0) {
                geminiPayload.tools = [{ functionDeclarations: convertMcpToolsToGemini(availableMcpTools) }];
                geminiPayload.toolConfig = { functionCallingConfig: { mode: "AUTO" } };
            }

            const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;
            const response = await fetch(GEMINI_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(geminiPayload)
            });
            const data = await response.json();
            
            if (data.error) throw new Error(data.error.message);
            const part = data.candidates?.[0]?.content?.parts?.[0];

            if (part?.functionCall) {
                isToolCalled = true;
                toolCallObj = { name: part.functionCall.name, args: part.functionCall.args };
            } else if (part?.text) {
                textResult = part.text;
            }
        }

        // 6. MCP 도구 실행 (원격 3001/3002 서버 강제 호출)
        if (isToolCalled) {
            console.log(`[MCP Router] Executing tool ${toolCallObj.name} on ${targetMcpHost}`);
            
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

        if (textResult) return res.status(200).json({ type: 'text', text: textResult });
        return res.status(200).json({ type: 'text', text: "이해하지 못했습니다. 다시 말씀해주세요." });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: e.message });
    } finally {
        if (mcpTransport) {
            try { await mcpTransport.close(); } catch(e){}
        }
    }
}
