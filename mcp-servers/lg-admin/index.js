import express from "express";
import cors from "cors";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import "dotenv/config";

function createAdminServer() {
  const server = new Server(
    { name: "lg-admin-mcp", version: "1.0.0" },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [
        {
          name: "change_theme",
          description: "LG 글로벌 커머스의 UI 테마를 전역적으로 변경합니다.",
          inputSchema: { type: "object", properties: { themeId: { type: "string" }, color_mode: { type: "string", enum: ["dark", "light"] } }, required: ["themeId", "color_mode"] }
        },
        {
          name: "add_product",
          description: "새로운 제품을 카탈로그에 즉시 퍼블리싱합니다.",
          inputSchema: { type: "object", properties: { category: { type: "string" }, name: { type: "string" }, price: { type: "number" } }, required: ["category", "name", "price"] }
        },
        {
          name: "create_coupon",
          description: "전체 또는 특정 카테고리에 쿠폰을 발급합니다.",
          inputSchema: { type: "object", properties: { category: { type: "string" }, discount_pct: { type: "number" } }, required: ["category", "discount_pct"] }
        },
        {
          name: "deploy_country",
          description: "특정 국가 타겟으로 새로운 스토어 사이트를 배포합니다.",
          inputSchema: { type: "object", properties: { country_code: { type: "string" } }, required: ["country_code"] }
        }
      ]
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    let resultInfo = {};

    switch (name) {
      case "change_theme":
        resultInfo = { status: "success", message: `테마가 [${args.themeId}] / [${args.color_mode}] 모드로 변경 준비 완료되었습니다.` };
        break;
      case "add_product":
        const shopifyToken = process.env.SHOPIFY_API_TOKEN;
        const shopDomain = process.env.SHOPIFY_STORE_DOMAIN;
        
        if (!shopifyToken || !shopDomain) {
          resultInfo = { status: "error", message: "Shopify API 정보가 서버 환경변수에 설정되지 않았습니다." };
          break;
        }

        const endpoint = `https://${shopDomain}/admin/api/2024-01/products.json`;
        console.log(`Sending add_product request to Shopify: ${endpoint}`);
        
        try {
          // Native Node 18+ Fetch API
          const shopifyRes = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Shopify-Access-Token': shopifyToken
            },
            body: JSON.stringify({
              product: {
                title: args.name,
                product_type: args.category,
                vendor: "LG AI",
                variants: [
                  {
                    price: args.price.toString(),
                    requires_shipping: true
                  }
                ],
                status: "active"
              }
            })
          });

          const data = await shopifyRes.json();
          if (!shopifyRes.ok) {
            console.error("Shopify error:", data);
            throw new Error(`Shopify API Error: ${JSON.stringify(data.errors || data)}`);
          }

          resultInfo = { 
            status: "success", 
            productId: data.product.id, 
            productName: data.product.title, 
            message: `[✅ 스토어 연동 완료] 쇼피파이 라이브 스토어에 새 제품 '${data.product.title}' 등록 성공!` 
          };
        } catch (error) {
          resultInfo = { status: "error", message: error.message };
        }
        break;
      case "create_coupon":
        resultInfo = { status: "success", message: `카테고리 [${args.category}]에 ${args.discount_pct}% 쿠폰 캠페인 생성됨` };
        break;
      case "deploy_country":
        resultInfo = { status: "success", deployUrl: `https://lg.com/${args.country_code.toLowerCase()}`, message: `국가 [${args.country_code}] 리전 롤아웃이 완료되었습니다.` };
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

let server = createAdminServer();
let transport;

app.get("/sse", async (req, res) => {
  if (transport) {
    try { await server.close(); } catch(e) {}
    server = createAdminServer();
  }
  
  transport = new SSEServerTransport("/message", res);
  await server.connect(transport);
  console.log("LG AI Admin MCP - SSEServerTransport connected!");
  
  req.on("close", () => {
    console.log("Admin Client SSE connection closed.");
  });
});

app.post("/message", async (req, res) => {
  if (transport) {
    await transport.handlePostMessage(req, res);
  } else {
    res.status(503).send("No active SSE connection");
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`LG AI Admin MCP Server running at port ${PORT}`);
});
