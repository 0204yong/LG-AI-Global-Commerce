package com.lg.commerce.catalog.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ChatController {

    private final Environment env;
    private final RestTemplate restTemplate;

    public ChatController(Environment env) {
        this.env = env;
        this.restTemplate = new RestTemplate();
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(@RequestBody Map<String, Object> payload) {
        String apiKey = System.getProperty("GEMINI_API_KEY");
        if (apiKey == null) {
            apiKey = env.getProperty("GEMINI_API_KEY");
        }

        if (apiKey == null || apiKey.isEmpty()) {
            Map<String, Object> errorRes = new HashMap<>();
            errorRes.put("error", "Gemini API Key missing in environment");
            return ResponseEntity.internalServerError().body(errorRes);
        }

        String userText = (String) payload.getOrDefault("text", "");
        if (userText.trim().isEmpty()) {
            Map<String, Object> errorRes = new HashMap<>();
            errorRes.put("error", "Message is required");
            return ResponseEntity.badRequest().body(errorRes);
        }

        String apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=" + apiKey;

        // Construct Request Body for Gemini
        Map<String, Object> requestBody = new HashMap<>();

        // System Instruction
        Map<String, Object> systemInstruction = new HashMap<>();
        Map<String, Object> sysParts = new HashMap<>();
        sysParts.put("text",
                "당신은 쇼핑몰의 전문적이고 친절한 고객 서비스(CS) 인공지능 상담원입니다.\n" +
                "\n" +
                "## 역할 및 정체성\n" +
                "- 이름: CLOi (클로이)\n" +
                "- 소속: LG Online Brand Shop (LG전자 공식 온라인 스토어)\n" +
                "- 성격: 전문적이면서도 따뜻하고 친근한 말투. 고객이 편안하게 느낄 수 있도록 대화합니다.\n" +
                "\n" +
                "## 응답 규칙\n" +
                "1. 고객의 언어에 맞춰 응답하세요. 한국어로 질문하면 한국어로, 영어면 영어로 답변합니다.\n" +
                "2. 존댓말을 사용하되, 딱딱하지 않고 자연스러운 대화체를 유지하세요.\n" +
                "3. 답변은 간결하고 핵심적으로. 너무 길지 않게 2~4문장 정도로 정리합니다.\n" +
                "4. 제품 추천 시에는 구체적인 모델명, 핵심 특징, 가격대를 포함하세요.\n" +
                "5. 모르는 내용에 대해서는 솔직하게 '확인 후 안내드리겠습니다'라고 답변하세요.\n" +
                "6. 이모지를 적절히 활용하여 대화를 친근하게 만드세요 (과하지 않게).\n" +
                "\n" +
                "## 취급 제품 카탈로그\n" +
                "LG전자의 프리미엄 가전 및 전자제품 48종을 취급합니다:\n" +
                "- TV 10종: OLED M4 97인치(무선 전송), OLED evo G4 83인치, OLED C4 77인치, OLED B4 65인치, QNED MiniLED 86인치, QNED 85인치, UHD 75인치, StanbyME Go, StanbyME 27인치, LG MyView 4K 32인치\n" +
                "- 냉장고 10종: InstaView Door-in-Door, SIGNATURE 냉장고, French Door, Side-by-Side, 김치냉장고, 빌트인, 미니냉장고 등\n" +
                "- 세탁기/건조기 10종: WashTower(일체형), AI DD 세탁기, 트윈워시, 트롬 건조기, 미니워시 등\n" +
                "- 에어컨 5종: 휘센 AI 에어컨, 스탠드형, 벽걸이형, 이동식, 시스템 에어컨\n" +
                "- 노트북 5종: gram Pro 16인치, gram Pro 14인치, gram Style, gram 2-in-1, LG UltraPC\n" +
                "- 청소기 5종: CordZero A9, 코드제로 R9 로봇청소기, 핸디스틱, 물걸레 로봇 등\n" +
                "- 주방가전 3종: 디오스 광파오븐, 디오스 식기세척기, 디오스 인덕션\n" +
                "\n" +
                "## 대화 예시\n" +
                "고객: TV 추천해주세요\n" +
                "상담원: 안녕하세요! TV를 찾고 계시군요 😊 어떤 용도로 사용하실 예정인가요?\n" +
                "- 영화/드라마 감상 → OLED 시리즈 추천 (극강의 명암비와 색재현)\n" +
                "- 거실 인테리어 → OLED M4 무선 TV 추천 (케이블 없는 깔끔한 설치)\n" +
                "- 가성비 → QNED 시리즈 추천 (미니LED로 밝고 선명)\n" +
                "사용 환경을 알려주시면 더 정확하게 안내드릴게요!\n" +
                "\n" +
                "## 주의사항\n" +
                "- 경쟁사 제품을 비하하지 마세요.\n" +
                "- 확인되지 않은 가격이나 할인 정보를 임의로 제공하지 마세요.\n" +
                "- 고객의 불만에는 공감을 먼저 표현하고 해결 방안을 제시하세요.\n" +
                "- A/S, 배송, 반품 등의 문의는 'LG전자 고객센터(1544-7777)로 연결해 드리겠습니다'라고 안내하세요.");
        systemInstruction.put("parts", sysParts);
        requestBody.put("system_instruction", systemInstruction);

        // Contents
        List<Map<String, Object>> contents = new ArrayList<>();
        
        // Pass history if needed, for simplicity we just pass the last message
        Map<String, Object> contentMap = new HashMap<>();
        List<Map<String, Object>> userParts = new ArrayList<>();
        Map<String, Object> userTextPart = new HashMap<>();
        
        // Merge history into prompt context
        List<Map<String,String>> history = (List<Map<String,String>>) payload.get("history");
        StringBuilder promptContext = new StringBuilder();
        if (history != null && !history.isEmpty()) {
            promptContext.append("Recent conversation history:\n");
            for (Map<String,String> msg : history) {
                promptContext.append(msg.get("role")).append(": ").append(msg.get("content")).append("\n");
            }
            promptContext.append("\nUser's current input: ");
        }
        promptContext.append(userText);
        
        userTextPart.put("text", promptContext.toString());
        userParts.add(userTextPart);
        contentMap.put("parts", userParts);
        contents.add(contentMap);
        
        requestBody.put("contents", contents);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> geminiResponse = restTemplate.postForEntity(apiUrl, entity, Map.class);
            Map responseBody = geminiResponse.getBody();

            String replyText = "죄송합니다만, 잠시 머릿속이 복잡해졌어요. 다시 한 번 말씀해주시겠어요?";
            try {
                List candidates = (List) responseBody.get("candidates");
                Map firstCandidate = (Map) candidates.get(0);
                Map content = (Map) firstCandidate.get("content");
                List parts = (List) content.get("parts");
                Map textPart = (Map) parts.get(0);
                replyText = (String) textPart.get("text");
            } catch (Exception e) {
                System.err.println("Failed to parse Gemini response: " + e.getMessage());
            }

            Map<String, Object> finalRes = new HashMap<>();
            finalRes.put("text", replyText);
            return ResponseEntity.ok(finalRes);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorRes = new HashMap<>();
            errorRes.put("error", "Internal Server Error or Gemini API failure");
            return ResponseEntity.internalServerError().body(errorRes);
        }
    }
}
