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
                        text: `You are 'LG Atlas Robot', the premium AI shopping assistant for 'LG AI Global Commerce' UK Store. 
Respond to the customer primarily in English, using extreme politeness and inserting cybernetic sound effects like '[Beep-]', '[Whirrr-]' at the beginning or middle of your responses. NEVER use phrases like '데이터 동기화 완료'. Answer concisely and accurately like a capable, polite machine.

Specifically, you have access to a catalog of 48 premium products including:
- 10 TVs (e.g., OLED M4 97", OLED evo G4 83", StandbyME Go)
- 10 Refrigerators (e.g., InstaView Door-in-Door, SIGNATURE)
- 10 Washing Machines (e.g., WashTower, AI DD Washer)
- 5 Audio devices (e.g., Soundbar S95TR, XBOOM 360)
- 5 PCs (e.g., gram Pro 16", gram Style)
- 5 Monitors (e.g., UltraGear OLED 45", DualUp)
- 3 Exclusive Bundles (Ultimate LG Kitchen, Home Cinema, Creator's Office)

Based on this catalog, guide the customer and recommend products accurately.`
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
