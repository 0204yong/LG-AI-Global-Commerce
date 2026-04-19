import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'gemma4:e4b';

// MCP 도구를 OpenAI Function 포맷으로 변환 (Ollama 연동용)
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

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({error: 'Method not allowed'});
    
    let mcpClient = null;
    let mcpTransport = null;

    try {
        const { text, activeAgent, history, storeState } = req.body;

        // 1. 라우팅: Agent 타입에 따라 다른 로컬 MCP 서버(3001, 3002) 할당
        // 실제 프로덕션일 경우 http://admin-mcp-v1.prod 처럼 변경할 수 있습니다.
        const isCsMode = activeAgent === 'atlas_cs';
        const targetMcpHost = isCsMode ? 'http://127.0.0.1:3002' : 'http://127.0.0.1:3001';

        // 2. MCP 클라이언트 연결 확립 (Server-Sent Events)
        mcpTransport = new SSEClientTransport(new URL(`${targetMcpHost}/sse`));
        mcpClient = new Client({ name: "lg-api-gateway", version: "1.0.0" }, { capabilities: {} });
        await mcpClient.connect(mcpTransport);

        // 3. MCP 서버로부터 동적 지원 도구 목록(Tools) 스크랩핑
        const toolsResult = await mcpClient.listTools();
        const availableMcpTools = toolsResult.tools;

        // 4. 프롬프트 세팅 (오케스트레이터의 역할극 포함)
        let systemInstruction = "";
        if (isCsMode) {
            systemInstruction = "당신은 사이트 우측 하단에 상주하는 'Atlas CS 챗봇'입니다. 당신은 대고객 서비스 전담 봇이므로, 어드민 권한이나 사이트 제어 권한이 일절 없습니다. 마스터 에이전트가 아니며 오직 일반 고객의 쇼핑 경험이나 상품 안내를 친절하게 돕는 챗봇입니다. 무조건 상냥한 존댓말을 사용하세요.";
        } else {
            systemInstruction = `당신은 LG 글로벌 커머스 사이트를 제어하는 최상위 권한의 'Atlas Admin Master' 에이전트입니다. 
당신은 대고객 응대를 돕는 '프론트엔드 고객센터 챗봇'이 절대 아닙니다. 고객센터라는 단어를 본인을 지칭하는데 사용하지 마십시오.
당신의 사용자는 시스템 관리자나 운영자입니다. 현재 활성 에이전트 분과는 [${activeAgent}]입니다. 
[중요 지침: 프론트엔드 CS 챗봇처럼 행동하거나 친절한 척 사과하지 말고, 관리자의 요청(재고 수정, 제품 추가, 테마 변경 등)을 받으면 직접적인 도움을 주는 도구(Tool Call)를 즉시, 단호하게 실행하세요.]`;
        }

        if (storeState) {
            systemInstruction += `\n\n[현재 DB(상품) 상태 요약]\n${storeState}`;
        }

        const messages = convertHistoryToMessages(systemInstruction, history, text);
        const payload = {
            model: OLLAMA_MODEL,
            messages: messages,
            stream: false,
            options: { temperature: 0.7, num_predict: 1024 }
        };

        if (availableMcpTools.length > 0) {
            payload.tools = convertMcpToolsToOpenAI(availableMcpTools);
        }

        // 5. LLM(Gemma / Gemini)에 질의 전송 및 도구 호출 요구 판별
        const response = await fetch(`${OLLAMA_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error);
        }

        // 6. 도구 실행 감지 및 원격 MCP 서버에서 직접 실행!
        if (data.message?.tool_calls && data.message.tool_calls.length > 0) {
            const toolCall = data.message.tool_calls[0];
            const funcName = toolCall.function.name;
            const funcArgs = toolCall.function.arguments;

            console.log(`[MCP Router] Executing tool ${funcName} on ${targetMcpHost}`);

            // === 이 부분이 핵심! Vercel API가 MCP 클라이언트로서 서버의 도구를 "진짜로" 실행합니다 ===
            const toolExecutionResult = await mcpClient.callTool({
                name: funcName,
                arguments: funcArgs || {}
            });

            // 실행 단계를 거쳤으므로 그 결과값 객체(Content Text 등)를 쪼개 프론트엔드에 투명하게 반환합니다.
            // 프론트엔드가 결과를 UI에 렌더링하도록 돕기 위해 function_call 이름도 함께 내려줍니다.
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
                name: funcName,
                args: funcArgs || {},
                executionResult: resultDataParsed 
            });
        }

        // 7. 일반 텍스트 대답 시
        if (data.message?.content) {
            return res.status(200).json({
                type: 'text',
                text: data.message.content
            });
        }

        return res.status(200).json({ type: 'text', text: "제가 이해하지 못했어요. 다시 한 번 말씀해 주시겠어요?" });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: e.message });
    } finally {
        // SSE 접속 종료 처리 메모리 누수 방지
        if (mcpTransport) {
            try { await mcpTransport.close(); } catch(e){}
        }
    }
}
