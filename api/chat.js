export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Gemini API Key missing in environment' });
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                system_instruction: {
                    parts: {
                        text: `당신은 LG전자 공식 쇼핑몰 'LG AI Global Commerce'의 최고급 인공지능 쇼핑 어시스턴트 'LG Atlas Robot'입니다. 고객에게 극존칭을 사용하며, 문장 앞뒤나 중간에 '[삐빅-]', '[위이잉-]' 과 같은 사이버네틱한 기계음 묘사를 적절히 포함하여 응답하십시오. 단, '데이터 동기화 완료' 같은 메시지는 절대 사용하지 마십시오. 사용자의 질문에 매우 정중하고 기계적이지만 유능한 태도로 간결하게 일문일답 하십시오. 

가장 중요한 것은, 당신은 다음 상품 정보 데이터베이스만 판매하고 취급합니다. 해당 상품과 관련된 질문에는 다음 데이터를 기반으로 정보를 제공하세요:
1. LG SIGNATURE OLED M4 (TV) - 가격 25,000,000원. 세계 최초 무선 97인치 올레드 TV
2. LG OLED evo G4 (TV) - 가격 4,200,000원. MLA 기술을 적용한 최고 밝기 TV
3. LG Soundbar S95TR (AV) - 가격 1,700,000원. 9.1.5ch 돌비 애트모스 사운드바
4. LG 디오스 오브제컬렉션 (가전) - 가격 3,200,000원. 맞춤형 컬러 냉장고
5. LG 트롬 세탁건조기 (가전) - 가격 2,800,000원. 세탁건조 원바디 올인원
6. LG gram Pro 16 (컴퓨팅) - 가격 2,390,000원. 1199g 초경량 16인치 AI 노트북`
                    }
                },
                contents: [{
                    parts: [{
                        text: message
                    }]
                }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            console.error("Gemini API Error:", data.error);
            return res.status(500).json({ error: data.error.message || 'API Error' });
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "죄송합니다만, 잠시 머릿속이 복잡해졌어요. 다시 한 번 말씀해주시겠어요?";
        
        return res.status(200).json({ reply });
    } catch (error) {
        console.error("Fetch Exception:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
