# 🤖 CLOi 봇 개발 로그

> CLOi AI Shopping Assistant 고도화 작업 기록
> **최종 수정**: 2026-05-01

---

## 2026-05-01: Function Calling 연동 완료 ✅

### 구현한 것
- **Astro SSR API Route** (`/api/chat.ts`) 신규 생성
- **Gemini 2.5 Flash Lite** + Function Calling 연동
- **5개 도구(Tool)** 정의:
  - `search_products` — 상품 키워드 검색
  - `get_product_detail` — SKU별 상세 조회
  - `get_categories` — 카테고리 트리
  - `check_order` — 주문 상태 조회
  - `get_all_orders` — 전체 주문 목록
- **2단계 호출 파이프라인**: 의도 파악 → API 실행 → 자연어 응답 생성
- **Fallback 시스템**: 백엔드 미실행 시 `products.ts` 로컬 데이터 사용

### 변경 파일
- `src/pages/api/chat.ts` — [NEW] API 라우트
- `src/components/CLOiWidget.tsx` — send() 함수 수정
- `astro.config.mjs` — SSR 모드 전환 (`output: 'server'`)

### 검증 결과
- "TV 추천해줘" → ✅ OLED A2/B3/C4/G3/Z3 실제 데이터 응답
- "노트북도 있어?" → ✅ gram 14/16/17/+view/Style 가격+스펙 응답
- Function Calling 자동 판단 → 백엔드 API 호출 → 자연어 변환 성공

### 남은 작업 (Phase 1)
- [x] 장바구니 자동 담기 (Zustand store 연동) ✅
- [x] 주문 조회 연동 ✅ 목업 fallback + 실 API 연동
- [x] 상품 비교 기능 ✅ compare_products 도구
- [x] CS 모드 (반품/교환/배송추적) ✅ 시스템 프롬프트 CS 지침
- [ ] 대화 이력 저장 (Phase 2에서 보안 대시보드와 통합 예정)

---

## 2026-05-01: 장바구니 자동 담기 구현 ✅

### 구현한 것
- **`add_to_cart` 도구** 추가 — Gemini가 "장바구니에 넣어줘" 의도를 감지하면 자동 호출
- **Zustand 연동** — API 응답의 `cartAction` 데이터로 `addItem()` 직접 호출
- **헤더 배지** 자동 업데이트 — 장바구니 아이콘에 수량 표시

### 변경 파일
- `src/pages/api/chat.ts` — `add_to_cart` tool + 실행 로직 + cartAction 응답
- `src/components/CLOiWidget.tsx` — cartStore import + cartAction 처리

### 검증 결과
- "Add LG gram 14 to cart" → ✅ 장바구니 배지 0→1 변경
- CLOi 응답: "장바구니에 1개 담았습니다" + Zustand store 실제 반영 확인

---

📎 관련 문서: [[AX_Hackathon_Plan]] · [[Team_API_Map]] · [[UI_Component_3D_Widget]]
