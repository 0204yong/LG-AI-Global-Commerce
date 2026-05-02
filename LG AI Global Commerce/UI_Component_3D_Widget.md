# 🚀 3D AI CS Widget 통합 내역

LG AI 글로벌 커머스 플랫폼은 사용자 경험을 한 단계 진화시키기 위해 **3D로 구현된 AI Customer Service 로봇 위젯**을 지원합니다.

## 1. CLOi 위젯 (`CLOiWidget.tsx`) — 최종 적용 버전

> ⭐ **2026-04-27 커밋:** `feat: CLOi 3D 로봇 위젯 및 Atlas CS 위젯 추가`
> GitHub 리포: [Jeongbo/lg-ai-commerce](https://github.com/Jeongbo/lg-ai-commerce)

### 1-1. 컴포넌트 사양
| 항목 | 상세 |
|------|------|
| **컴포넌트** | `src/components/CLOiWidget.tsx` |
| **3D 엔진** | Three.js (primitive mesh 방식) |
| **렌더링** | `WebGLRenderer` (alpha, antialias) |
| **모델 구성** | Head(BoxGeometry) + Face + Eyes + Ear(CylinderGeometry) + Torso + Arms + LG Badge |
| **마운트 위치** | `src/layouts/Layout.astro` 내 React Island |

### 1-2. 인터랙션 & 애니메이션
* **마우스 트래킹:** 브라우저 내 커서 좌표를 기반으로 로봇이 시선을 따라감 (`rotation.x`, `rotation.y`)
* **부유 모션:** `Math.sin(t * 2)` 기반 Y축 float 애니메이션
* **눈 깜빡임:** `Math.sin(t * 6) > 0.96` 조건으로 자연스러운 blink 효과
* **드래그 이동:** `PointerEvent` 기반으로 위젯 위치를 자유롭게 이동 가능
* **클릭 토글:** 드래그 없이 클릭 시 채팅 창 열기/닫기

### 1-3. 채팅 기능
* **API 연동:** `${PUBLIC_API_URL}/api/chat` 엔드포인트에 `activeAgent: 'cloi'` 파라미터로 호출
* **퀵 리플라이:** 📺 TV / 💻 노트북 / ❄️ 에어컨 프리셋 버튼 제공
* **타이핑 인디케이터:** dot-pulse 애니메이션으로 로딩 상태 표시
* **UI 테마:** LG 브랜드 컬러 (LG Red `#A50034`) + 다크 네온 그린 (`#22c55e`) 조합

## 2. Atlas CS 위젯 (`AtlasCSWidget.tsx`) — 이전 버전 (참조용)

* **컴포넌트명:** `AtlasCSWidget.tsx`
* **구현 방식:** Three.js 기반 프로토타입을 React 환경으로 포팅
* **스타일:** `AtlasCSWidget.css` — LG 디자인 시스템 기반의 정규화된 CSS

> [!NOTE]
> Atlas 위젯은 CLOi 위젯 도입 이전 버전으로, 현재는 **CLOi 위젯이 메인**으로 사용됩니다.
> 향후 Atlas 위젯은 제거하거나 별도 용도로 분리할 수 있습니다.

## 3. 파일 구조

```
lg-ai-commerce-msa/
├── src/
│   ├── components/
│   │   ├── CLOiWidget.tsx          ← ⭐ 현재 메인 위젯
│   │   ├── AtlasCSWidget.tsx       ← 이전 버전 (참조용)
│   │   └── AtlasCSWidget.css
│   ├── layouts/
│   │   └── Layout.astro            ← CLOi 위젯 마운트 지점
│   └── styles/
│       └── global.css              ← 전역 스타일 (수정됨)
├── public/
│   └── models/
│       └── RobotExpressive.glb     ← GLB 모델 에셋 (미사용, 참고용)
└── package.json                    ← three.js 의존성 추가
```

## 4. 팀 협업 안내

| 항목 | 내용 |
|------|------|
| **리포지토리** | `https://github.com/Jeongbo/lg-ai-commerce.git` |
| **브랜치** | `master` |
| **최신 커밋** | `eb69087` — `feat: CLOi 3D 로봇 위젯 및 Atlas CS 위젯 추가` |
| **클론 명령어** | `git clone https://github.com/Jeongbo/lg-ai-commerce.git` |
| **로컬 실행** | `npm install` → `npm run dev` |

> [!IMPORTANT]
> 팀원들은 위 리포를 clone하여 최신 커밋 기준으로 각자 브랜치를 따서 작업할 수 있습니다.

---
[[Main_Dashboard]] 로 돌아가기
