# Gemini 기반 진짜 에이전트 연동 (Function Calling 프로토타입) 계획서

이 문서는 사용자의 단순 자연어 명령(정규식 기반)을 대체하여, **구글 최신 LLM(Gemini)이 스스로 문맥을 이해하고 어떤 업무를 수행할지 결정하는** '자율형 멀티 에이전트 프로토타입'을 구축하기 위한 계획입니다.

## User Review Required

> [!IMPORTANT]
> 이 프로토타입은 프론트엔드에 있는 단순 키워드 검색 코드를 지우고, Vercel 서버리스 환경을 통해 100% AI가 추론하도록 만듭니다. **Vercel 환경 변수(`GEMINI_API_KEY`)가 올바르게 세팅되어 있어야 작동합니다!** (현재 세팅되어 있는 것으로 파악됩니다) 

> [!NOTE]
> 기존의 If/Else 코드가 대거 교체되므로, 일부 답변 톤앤매너나 UI 플로우가 변경될 수 있습니다. 현재 프론트엔드의 `✓ 승인 (Deploy)` UI는 안정성을 위해 계속 유지합니다. (명령 -> AI 해석 -> 승인창 -> 실제 실행)

---

## Proposed Changes

### 백엔드 (Serverless Function) 도입
백엔드 로직을 생성하여 보안 상 안전하게(API Key 노출 없이) Gemini API를 호출하고 함수 호출(Function Calling) 기능을 이용합니다.

#### [NEW] `api/gemini.js`
- Vercel 서버리스 함수로 동작.
- 프론트엔드로부터 `text`(사용자 입력)와 `activeAgent`(현재 선택된 에이전트)를 받아옴.
- **System Prompt:** 활성화된 에이전트(`Atlas`, `Price`, `Promo` 등)에 따라 페르소나와 권한을 동적으로 부여.
- **Function Declarations (도구 선언):** 
  - `create_coupon(region, category, discount_pct)`
  - `create_bundle(item_keywords, discount_pct, region)`
  - `update_discount(product_name, discount_pct)`
  - `set_standard_price(product_name, new_price)`
  - `change_theme(theme_name)`
  - `deploy_country(country_code)`
  - `add_product(product_type, price)`
- 작동 방식: Gemini가 문장을 분석해 **단순 텍스트 답변**을 줄지, **어떤 함수(도구)를 실행할지 JSON 형식**으로 판단하여 반환.

---

### 프론트엔드 (UI & 연동) 업데이트
기존의 `script.js`에 있던 정규표현식(Regex) 의도 파악 블록을 모두 날리고, API 통신으로 교체합니다.

#### [MODIFY] `assets/js/script.js`
- `processIntent(text)` 함수 전면 수정.
- API(`/api/gemini`)로 텍스트를 전송하고 `await`로 결과를 기다림 (시각적 로딩 애니메이션 추가).
- 반환된 결과가 **일반 텍스트**면 그대로 채팅창에 타이핑 연출로 출력.
- 반환된 결과가 **Function Call**이면, 해당 함수명과 전달받은 인자(Args)를 바탕으로 기존에 우리가 만들어둔 UI 승인창(AI Card)을 팝업!
- 예: Gemini가 `{"name":"create_coupon", "args":{"discount_pct":15, "category":"TV"}}` 반환 -> `create_coupon` 승인 컴포넌트 렌더링.

---

## Open Questions

1. **기존 CS 봇 기능 유지 여부**: 기존에 "배송", "환불" 키워드에 대답하던 Atlas CS 로직(`csResponses`)도 완전히 Gemini에게 넘겨서 자유롭게 응답하게 할까요? (추천: 네, 넘기는 것이 훨씬 자연스럽습니다)
2. **에이전트별 행동 제한 여부**: 예를 들어 'Price 에이전트'가 켜져 있을 때 "스페인 사이트 개설해줘" 라고 하면, "저는 가격 담당입니다. Site 에이전트님이나 총괄 Atlas 님께 말씀해주세요" 라고 튕기도록 페르소나를 엄격하게 부여할까요? 아니면 편의상 다 들어주게 할까요? (아마 엄격하게 하는 것이 시연용으로 더 신기할 것 같습니다)

---

## Verification Plan

### Automated Tests
- 백엔드(`/api/gemini`) 호출 시 200 응답 및 Function Call JSON 형태 확인.

### Manual Verification
- Vercel 배포 후, 브라우저에서 "이 티비 너무 비싼데 이탈리아 쪽에 좀 팍 깎아봐 20퍼 정도로" 등을 입력했을 때 **자연어를 완벽히 파악하여** 이태리 스토어 타겟 20% 쿠폰 승인 UI가 뜨는지 확인.
- Price 에이전트 상태에서 마케팅 질문을 할 때 거절 또는 다른 에이전트로 유도하는지 확인.
