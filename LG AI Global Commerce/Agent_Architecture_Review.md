# LG AI Global Commerce: Agentic Architecture Review

현재 해커톤을 위해 구축된 **다중 AI 에이전트 시스템(Multi-Agent System)**의 개발 아키텍처 구조도입니다. 이 구조는 프론트엔드 모노레포와 백엔드 MSA를 아우르는 **Zero-Click(무인 자동화) 아키텍처**를 지향하고 있습니다.

---

## 1. System Components (시스템 구성)

우리의 시스템은 크게 두 개의 독립적인 웹 애플리케이션으로 분리되어 동작하며, 에이전트가 이 둘 사이를 브릿지(Bridge)합니다.

### A. Admin Orchestrator (`hoseok-app_ax`)
- **기술 스택:** React, Vite, React-Router
- **역할:** 글로벌 관리자가 모든 에이전트를 통제하는 중앙 관제 센터.
- **핵심 컴포넌트 (`AiAgentSidebar.tsx`):** 
  - 5명의 전문 에이전트 페르소나를 관리하는 **Agent Orchestrator**.
  - 관리자의 명령(Text)을 각 담당 에이전트에게 라우팅하고, 에이전트의 사고 과정(Thought Process)을 채팅 UI로 렌더링.
  - React Router를 제어하여 요원 호출 시 해당 업무 화면으로 자동 전환(Context Switching).

### B. Global Storefront & API Gateway (`lg-ai-commerce-msa`)
- **기술 스택:** Astro, React(Islands), Neon DB(PostgreSQL)
- **역할:** 실제 고객이 접속하는 쇼핑몰 화면이자, 에이전트가 조작하는 대상 시스템(Target System).
- **핵심 컴포넌트:**
  - **이벤트 수신기 (`Layout.astro`):** 어드민의 에이전트가 내리는 `postMessage` 명령을 수신하여 실시간으로 언어/통화/UI를 변경(Rollout 시뮬레이션).
  - **백엔드 API (`/api/security`, `/api/chat`):** 에이전트가 트래픽을 차단하거나 DB 데이터를 쿼리할 때 호출하는 실제 Action 엔드포인트. 실제 Gemini API를 호출하는 로직이 여기에 위치함.

---

## 2. Agentic Workflow (에이전트의 동작 3단계)

현재 에이전트들은 **[Perception ➔ Reasoning ➔ Action]** 이라는 자율형 AI의 정석적인 워크플로우를 따르도록 설계(또는 시뮬레이션)되어 있습니다.

1. **감지 (Perception)**
   - 대시보드 API를 폴링하여 위협(DDoS)을 감지하거나, 재고 부족 알람(Order)을 띄우는 등 시스템의 상태를 읽어옵니다.
2. **분석 및 추론 (Reasoning)**
   - 보안 에이전트의 경우, 백엔드의 `/api/security`를 통해 구글 **Gemini 2.5 Pro** 모델에 보안 로그 분석을 의뢰하고 보고서를 생성합니다.
   - 프론트엔드 상에서는 사용자가 이해하기 쉽도록 다단계 대화(Multi-step prompt) 애니메이션을 통해 AI의 생각 과정을 시각화합니다.
3. **실행 (Action - Tool Calling)**
   - **Global Event Dispatch:** 프론트엔드 레벨에서 `window.postMessage`를 쏴서 다른 브라우저 창(쇼핑몰 프론트)의 상태를 강제로 변경시킵니다 (Zero-Click Rollout).
   - **API Invocation:** 백엔드 DB의 상태를 변경하는 실제 REST API를 호출합니다.

---

## 3. Specialized Agents (5인의 전문 요원)

현재 1명의 범용 AI가 아닌, 각 도메인에 특화된 5명의 에이전트가 각자의 역할을 수행하는 **Multi-Agent 아키텍처**입니다.

1. 🛡️ **Security Guardian (보안)**: 트래픽 모니터링, DDoS/SQLi 탐지, 실시간 방어망 가동 및 Gemini 기반 사고 보고서 작성.
2. 📦 **Order Agent (물류/주문)**: SCM 파이프라인 모니터링, 미처리 주문 알림, 픽업 지연 해결 자동화.
3. 🏷️ **Promotion Agent (마케팅)**: 고객 트래픽 급증 탐지, 기회 포착, 타겟 고객 대상 할인 쿠폰 자동 발행 제안.
4. 🌍 **Rollout Agent (글로벌 배포)**: 코드 수정 없이 텍스트 명령만으로 30+개국의 현지화된 스토어(언어, 통화 변환) 즉각 배포.
5. 💬 **Support Agent (통합 지원)**: 범용 챗봇 및 시스템 사용법 안내.

---

## 4. Architecture Insight (해커톤 어필 포인트)
- **디커플링(Decoupling):** 에이전트 관제 패널(React)과 타겟 서비스(Astro)가 완벽히 분리되어 있어, 향후 LG의 어떤 레거시 시스템이라도 손쉽게 에이전트를 붙일 수 있습니다.
- **Micro-Frontend 패턴:** `IFrame`과 `postMessage`를 활용하여 안전하게 서로 다른 도메인의 앱 간 상태를 연동하는 현대적인 MSA 프론트엔드 기술을 사용했습니다.
