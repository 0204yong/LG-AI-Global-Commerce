# 🏗️ LG AI Commerce Platform - 아키텍처 및 스펙

본 문서는 **LG AI Commerce Platform** 프로젝트의 핵심 아키텍처 및 기술 스택을 정리한 내용입니다.

## 1. 기술 스택 (Tech Stack)

* **프레임워크 (Framework):** **Astro 5+**
  * 빌드 타임에 HTML, CSS를 미리 생성하는 정적 사이트 생성(SSG) 기능을 통해 SEO 최적화와 극도로 빠른 초기 로드 속도(FCP) 달성.
* **UI 컴포넌트:** **React 19**
  * `@astrojs/react` 어댑터 사용. 인터랙션이 필요한 부분(장바구니, 데이터 필터링, 모달 등)에만 클라이언트 사이드 렌더링(CSR)을 적용하는 **Astro Islands** 아키텍처 도입.
* **상태 관리 (State Management):** **Zustand**
  * 전역 상태(카트 아이템 등) 관리를 위한 `cartStore.ts` 구현.
* **스타일링 (Styling):** Vanilla CSS 및 CSS Variables 활용.
* **언어 (Language):** TypeScript

## 2. 배포 및 인프라 (Infrastructure)

프로덕션 배포는 **Cloudflare Pages**를 사용하여 엣지 CDN을 통해 글로벌 트래픽을 감당합니다. 

* 배포 명령어: `npx wrangler pages deploy dist`
* 서비스 URL: `https://lg-ai-commerce.pages.dev`
* 고가용성 SSG 방식을 채택하여 컴퓨팅 런타임 서버 비용 및 부하를 최소화하는 서버리스 설계.

## 3. 코드 구조도

* `public/`: 폰트 및 정적 이미지 등 에셋.
* `src/components/`: 인터랙티브 React Islands 컴포넌트.
* `src/pages/`: Astro 페이지 라우팅용 디렉토리 (`*.astro`).
* `src/store/`: Zustand 상태 관리 스토어.
* `src/styles/`: 웹 전반에 사용되는 `global.css`.

---
[[Main_Dashboard]] 로 돌아가기
