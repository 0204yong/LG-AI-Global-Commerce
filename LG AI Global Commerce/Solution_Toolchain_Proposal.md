# 🛠️ AX 해커톤을 위한 기능별 SaaS/AI 솔루션 도입 제안

해커톤과 같이 **제한된 시간 안에 완성도를 극대화**해야 하는 프로젝트에서는 각 도메인별로 특화된 No-code/AI 솔루션을 결합(Composability)하는 것이 매우 효율적입니다. 현재 LG AI Global Commerce MSA 프로젝트에 적용해 볼 만한 기능별 솔루션 스택을 제안합니다.

## 1. 프론트엔드 (UI/UX 디자인 및 컴포넌트)
* **제안 솔루션:** **Lovable**, **v0 by Vercel**, **Framer**
* **적용 방안:**
  * **Lovable / v0:** 어드민 대시보드(`hoseok-app_ax`)의 복잡한 폼이나 데이터 테이블, 차트 UI 등을 프롬프트로 빠르게 생성하여 React 코드(Tailwind 기반)로 바로 복사/붙여넣기 합니다. 
    * 💡 *참고: Lovable은 무료 플랜(일 5크레딧)을 제공하지만 제약이 있어, 본격적인 코드 내보내기나 비공개 프로젝트를 위해서는 유료 플랜(월 $25~)이 필요합니다.*
  * **Framer:** 고객이 보는 메인 커머스 페이지(`lg-ai-commerce-msa`) 중 시각적 효과나 인터랙션이 중요한 랜딩 페이지 영역을 담당합니다.

## 2. 백엔드 서비스 및 데이터베이스 (BaaS)
* **제안 솔루션:** **Supabase**, **Hasura**
* **적용 방안:**
  * **Supabase:** 회원 가입/로그인(Auth), 실시간 데이터 동기화, 파일 스토리지(로봇 3D 모델 관리 등)를 위한 서버리스 백엔드로 활용합니다. PostgreSQL 기반이므로 기존 Prisma ORM과도 호환성이 좋습니다.
  * **Hasura:** 복잡한 MSA 구조(Order, Catalog 등)의 데이터베이스를 연결해 클릭 몇 번으로 GraphQL/REST API 엔드포인트를 즉시 생성하여 프론트엔드 연동 시간을 단축합니다.

## 3. AI 에이전트 및 프롬프트 로직 (AI Orchestration)
* **제안 솔루션:** **LangSmith**, **Flowise / Langflow**
* **적용 방안:**
  * **Flowise / Langflow:** 노드 기반(Drag & Drop) UI를 통해 AI 서비스 에이전트(Service Planner Agent 등)의 워크플로우와 MCP(Model Context Protocol) 툴 호출 로직을 시각적으로 설계합니다.
  * **LangSmith:** LLM의 응답 품질, 레이턴시, 프롬프트 디버깅을 시각적으로 모니터링하여 시연 중 발생할 수 있는 AI 할루시네이션(환각)을 방지합니다.

## 4. 인프라 모니터링 및 배포 (DevOps & CI/CD)
* **제안 솔루션:** **Vercel**, **Railway**, **Sentry**
* **적용 방안:**
  * **Vercel / Cloudflare Pages:** 프론트엔드 Astro 및 React 앱을 GitHub과 연동하여 Push 시 자동 배포를 수행합니다. (현재 Cloudflare 적용 중으로 파악됨)
  * **Railway:** 백엔드 API 서버와 MSA 서비스들을 Dockerfile 없이도 손쉽게 배포할 수 있는 PaaS 환경을 제공합니다.
  * **Sentry:** 데모 환경에서 프론트엔드/백엔드의 에러 로그를 실시간으로 수집하여 문제 발생 시 즉각 대처할 수 있게 합니다.

---
[[Main_Dashboard]] 로 돌아가기
