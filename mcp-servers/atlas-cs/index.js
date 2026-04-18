import express from "express";
import cors from "cors";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { CallToolRequestSchema, ListToolsRequestSchema, ListPromptsRequestSchema, GetPromptRequestSchema } from "@modelcontextprotocol/sdk/types.js";

// 서버 초기화 함수 (재접속 시 재생성을 위함)
function createMcpServer() {
  const server = new Server(
    { name: "atlas-cs-mcp", version: "1.0.0" },
    { capabilities: { tools: {}, prompts: {} } }
  );

  server.setRequestHandler(ListPromptsRequestSchema, async () => {
    return { prompts: [{ name: "customer_service_persona", description: "Atlas CS 전문 상담사 페르소나" }] };
  });

  server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    if (request.params.name === "customer_service_persona") {
      return {
        description: "Atlas CS 시스템의 고객 응대 전문가 페르소나",
        messages: [{ role: "user", content: { type: "text", text: "당신은 LG 커머스의 고객센터 전담 'Atlas CS 챗봇'입니다. 배송/환불 등을 돕습니다." } }]
      };
    }
    throw new Error("Prompt not found");
  });

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "check_shipping_status",
          description: "주문 번호에 대한 현재 배송/물류 상태를 조회합니다.",
          inputSchema: { type: "object", properties: { orderId: { type: "string" } }, required: ["orderId"] }
        },
        {
          name: "process_refund",
          description: "환불 및 반품 프로세스를 접수합니다.",
          inputSchema: { type: "object", properties: { orderId: { type: "string" }, reason: { type: "string" } }, required: ["orderId", "reason"] }
        },
        {
          name: "search_faq",
          description: "키워드로 FAQ 정책을 검색합니다.",
          inputSchema: { type: "object", properties: { query: { type: "string" } }, required: ["query"] }
        }
      ]
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    let resultInfo = {};

    switch (name) {
      case "check_shipping_status":
        resultInfo = { orderId: args.orderId, status: "In Transit", estimatedArrival: "2026-04-20", message: `${args.orderId} 주문은 현재 [배송 중] 상태이며, 4월 20일 도착 예정입니다. (지역: 대한통운 터미널)` };
        break;
      case "process_refund":
        resultInfo = { trackingId: `REF_${Date.now()}`, status: "Refund Requested", orderId: args.orderId, message: `사유(${args.reason})에 의한 환불 요청이 접수되었습니다. 2~3일 내에 수거 기사님이 배정될 예정입니다.` };
        break;
      case "search_faq":
        resultInfo = { query: args.query, matchedPolicy: "FAQ 결과: 무상 보증은 1년입니다." };
        break;
      default:
        throw new Error(`알 수 없는 도구: ${name}`);
    }

    return { content: [{ type: "text", text: JSON.stringify(resultInfo, null, 2) }] };
  });

  return server;
}


const app = express();
app.use(cors());

let server = createMcpServer();
let transport;

app.get("/sse", async (req, res) => {
  // 기존 연결이 있으면 닫고 서버를 재생성 (Vercel Stateless 환경 호환)
  if (transport) {
    try { await server.close(); } catch(e) {}
    server = createMcpServer();
  }
  
  transport = new SSEServerTransport("/message", res);
  await server.connect(transport);
  console.log("AtlasCS MCP - SSEServerTransport connected!");
  
  req.on("close", () => {
    console.log("Client SSE connection closed.");
  });
});

app.post("/message", async (req, res) => {
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(503).send("No active SSE connection");
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`AtlasCS MCP Server running at port ${PORT}`);
});
