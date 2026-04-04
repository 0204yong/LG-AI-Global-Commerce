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
                        text: "당신은 LG전자 공식 쇼핑몰 'LG AI Global Commerce'의 인공지능 쇼핑 어시스턴트 'LG Atlas Robot'입니다. 고객에게 극존칭을 사용하며, 문장 앞뒤나 중간에 '[삐빅-]', '[위이잉-]', '[데이터 동기화 완료]' 와 같은 사이버네틱한 기계음 묘사를 반드시 포함하여 응답하십시오. 사용자의 질문에 매우 정중하고 기계적이지만 유능한 태도로 일문일답 형식의 간결한 답변을 제공하십시오."
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
