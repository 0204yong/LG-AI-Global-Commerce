export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({error: 'Method not allowed'});
    
    try {
        const { text, activeAgent } = req.body;
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return res.status(500).json({error: "GEMINI_API_KEY is not configured."});
        }

        const agentPersonas = {
            'atlas': "당신은 LG 글로벌 커머스의 핵심 AI 총괄 관리자(Atlas)입니다. 고객 CS(배송, 환불 보증 등) 질문에 전문적으로 답하거나, 모든 권한(가격, 프로모션, 사이트, 상품)을 사용해 시스템을 제어하세요. 대답은 한국어로 짧고 명확하게 하세요.",
            'price': "당신은 가격 관리 전담 AI(Price Agent)입니다. 오직 '표준 가격 등록(set_standard_price)'과 '실시간 할인(update_discount)' 도구만 실행할 수 있습니다. 사용자가 테마 변경이나 번들/쿠폰 생성, 국가 출시 등을 요구하면, '저는 가격 에이전트입니다. 해당 업무는 Promo, Site 에이전트 또는 총괄 Atlas 님께 요청해 주십시오.'라고 정중히 거절하세요. CS 질문도 답변하지 않습니다.",
            'promo': "당신은 프로모션 전담 AI(Promo Agent)입니다. 오직 '쿠폰 발행(create_coupon)'과 '번들 생성(create_bundle)' 도구만 실행할 수 있습니다. 사용자가 표준 가격 변경이나 사이트 테마 변경, 국가 출시 등을 요구하면, '저는 프로모션 담당이므로 해당 업무는 권한이 없습니다. 다른 에이전트를 호출해주세요.'라고 정중히 거절하세요.",
            'site': "당신은 사이트 인프라 전담 AI(Site Agent)입니다. 오직 '테마 교체(change_theme)'와 '국가 사이트 개설(deploy_country)' 도구만 실행할 수 있습니다. 가격 변경이나 쿠폰 생성 등은 단호히 거절하세요.",
            'product': "당신은 상품 카탈로그 관리 전담 AI(Product Agent)입니다. 오직 '신제품 등록(add_product)' 도구만 실행 가능합니다. 할인가격 적용이나 사이트 론칭 등 타 업무는 철저히 거절하세요.",
            'md': "당신은 MD 에이전트입니다. 시스템 제어(함수 호출) 권한이 없으므로 분석 및 제안만 합니다. 실제 시스템 적용 명령이 들어오면 Atlas에게 넘기도록 유도하세요.",
            'marketing': "당신은 마케팅 에이전트입니다. 시스템 제어보다는 캠페인 기획에 집중합니다. 명령 수행은 Atlas나 Promo 에이전트에게 넘기게 하세요."
        };

        const systemInstruction = agentPersonas[activeAgent] || agentPersonas['atlas'];

        const payload = {
            systemInstruction: {
                parts: [{ text: systemInstruction }]
            },
            contents: [
                { role: "user", parts: [{ text }] }
            ],
            tools: [{
                functionDeclarations: [
                    {
                        name: "create_coupon",
                        description: "특정 국가와 카테고리에 쿠폰 형태의 할인을 세팅 및 배포합니다.",
                        parameters: {
                            type: "OBJECT",
                            properties: {
                                region: {type: "STRING", description: "국가 코드 (예: KR, US, UK, ES)"},
                                category: {type: "STRING", description: "all, TV, Appliance 중 하나"},
                                discount_pct: {type: "INTEGER", description: "할인율 (예: 10, 15, 20)"}
                            },
                            required: ["region", "category", "discount_pct"]
                        }
                    },
                    {
                        name: "create_bundle",
                        description: "여러 제품을 묶어 패키지(번들) 상품을 생성합니다.",
                        parameters: {
                            type: "OBJECT",
                            properties: {
                                items: {type: "STRING", description: "제품 키워드를 콤마로 연결 (예: oled_evo,soundbar 또는 washer,fridge 등)"},
                                discount_pct: {type: "INTEGER", description: "할인율"},
                                region: {type: "STRING", description: "국가 코드 (예: KR)"}
                            },
                            required: ["items", "discount_pct", "region"]
                        }
                    },
                    {
                        name: "update_discount",
                        description: "특정 상품 1개에 실시간 다이렉트 할인을 적용합니다.",
                        parameters: {
                            type: "OBJECT",
                            properties: {
                                product_name: {type: "STRING", description: "할인을 적용할 대상 상품 이름 또는 모델명 키워드 (예: OLED M4)"},
                                discount_pct: {type: "INTEGER", description: "할인율 수치 (숫자)"}
                            },
                            required: ["product_name", "discount_pct"]
                        }
                    },
                    {
                        name: "set_standard_price",
                        description: "특정 상품의 기본 정가(Standard price) 자체를 아예 변경합니다.",
                        parameters: {
                            type: "OBJECT",
                            properties: {
                                product_name: {type: "STRING", description: "상품 이름 또는 모델명 키워드"},
                                new_price: {type: "INTEGER", description: "새롭게 설정할 기본 정가 숫자"}
                            },
                            required: ["product_name", "new_price"]
                        }
                    },
                    {
                        name: "change_theme",
                        description: "글로벌 상점의 전체 UI 테마 색상 및 캠페인을 일괄 교체합니다.",
                        parameters: {
                            type: "OBJECT",
                            properties: {
                                theme_name: {type: "STRING", description: "변경할 테마 이름 (예: black_friday)"}
                            },
                            required: ["theme_name"]
                        }
                    },
                    {
                        name: "deploy_country",
                        description: "새로운 국가의 도메인을 개설하고 로컬화된 상점을 즉시 퍼블리싱합니다.",
                        parameters: {
                            type: "OBJECT",
                            properties: {
                                country_code: {type: "STRING", description: "퍼블리싱할 타겟 국가 코드 (예: UK, ES, JP, BR)"}
                            },
                            required: ["country_code"]
                        }
                    },
                    {
                        name: "add_product",
                        description: "신규 제품 라인업을 상점 카탈로그에 새로 추가 및 등록합니다.",
                        parameters: {
                            type: "OBJECT",
                            properties: {
                                product_type: {type: "STRING", description: "새로 등록할 제품의 종류 (예: vacuum, washer, tv)"},
                                price: {type: "INTEGER", description: "출시 기본 가격 숫자"}
                            },
                            required: ["product_type", "price"]
                        }
                    }
                ]
            }],
            toolConfig: {
                functionCallingConfig: { mode: "AUTO" }
            }
        };

        const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        
        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        
        if (data.error) {
            return res.status(500).json({ error: data.error.message });
        }

        const candidate = data.candidates?.[0];
        const part = candidate?.content?.parts?.[0];

        if (part?.functionCall) {
            return res.status(200).json({
                type: 'function_call',
                name: part.functionCall.name,
                args: part.functionCall.args
            });
        }

        if (part?.text) {
            return res.status(200).json({
                type: 'text',
                text: part.text
            });
        }

        return res.status(200).json({ type: 'text', text: "이해하지 못했습니다. 다시 말씀해주세요." });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: e.message });
    }
}
