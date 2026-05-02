# 📝 Git Changelog — LG AI Commerce

GitHub 리포지토리 [`Jeongbo/lg-ai-commerce`](https://github.com/Jeongbo/lg-ai-commerce) 의 주요 커밋 타임라인입니다.

## 커밋 히스토리 (최신순)

| 커밋 해시 | 메시지 | 비고 |
|-----------|--------|------|
| `eb69087` | **feat: CLOi 3D 로봇 위젯 및 Atlas CS 위젯 추가** | ⭐ 최신 — CLOi Widget 통합 |
| `e3d3463` | docs: add team onboarding and local setup guides | 팀 온보딩 가이드 |
| `69a0134` | Unignore and track .env.production for CI | CI 환경변수 설정 |
| `5ca640c` | chore: force trigger github actions deploy | GitHub Actions 재배포 |
| `e243f7c` | ci: add github action for cloudflare pages | Cloudflare 배포 자동화 |
| `f33079a` | chore: add wrangler.toml with project name | Wrangler 설정 |
| `27db9c1` | Add Cloudflare Workers configuration | Workers 구성 |
| `36d5233` | chore: force track .env.production for cloudflare build | 환경변수 트래킹 |
| `58e4f6a` | chore: setup environment variables for api url | API URL 환경변수 |
| `bf9d81c` | feat: integrate production catalog api | 프로덕션 카탈로그 API 연동 |
| `aceed34` | chore: save current version | 버전 스냅샷 |
| `59fcdb6` | docs: Add Architecture and Collaboration guides | 아키텍처 문서 |
| `ecac648` | Initial commit | 최초 커밋 |

## 최신 커밋 상세 (`eb69087`)

### 변경 파일 (9개 파일, +1615 / -91)

**새로 추가된 파일:**
- `public/models/RobotExpressive.glb` — 3D GLB 모델 에셋
- `src/components/AtlasCSWidget.css` — Atlas 위젯 전용 스타일
- `src/components/AtlasCSWidget.tsx` — Atlas CS 위젯 (이전 버전)
- `src/components/CLOiWidget.tsx` — ⭐ CLOi 3D 로봇 위젯 (메인)

**수정된 파일:**
- `astro.config.mjs` — React 어댑터 설정 변경
- `package.json` / `package-lock.json` — `three` 패키지 의존성 추가
- `src/layouts/Layout.astro` — CLOi 위젯 마운트 포인트 추가
- `src/styles/global.css` — 전역 스타일 조정

---
[[Main_Dashboard]] 로 돌아가기
