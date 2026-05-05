# ✅ PC 이관 체크리스트

> [[Main_Dashboard]] | [[PC_Migration_Guide]]

## 상태: 🟡 준비 중

---

## 즉시 해야 할 일
- [ ] 현재 PC에서 uncommitted 변경사항 commit & push
  - `hoseok-app_ax/src/pages/StorePreview.tsx`
  - `k-culture-explorer` (서브모듈)
  - `lg-ai-commerce-msa` (서브모듈)
- [ ] 회사 PC에 Git, Node.js 설치 확인

## Git Clone
- [ ] `git clone https://github.com/0204yong/AI-Demo.git`

## .env 파일 수동 생성 (4개)
- [ ] `AIproject/.env`
- [ ] `lg-ai-commerce-msa/.env`
- [ ] `lg-ai-commerce-msa/.env.development`
- [ ] `lg-ai-commerce-msa/.env.production`

## npm install (프로젝트별)
- [ ] `LG AI Global Commerce`
- [ ] `lg-ai-commerce-msa`
- [ ] `hoseok-app_ax`

## Antigravity 설정
- [ ] Antigravity 설치
- [ ] `mcp_config.json` 설정 (경로 수정 필수)
- [ ] (선택) `brain/` 대화기록 복사

## 선택사항
- [ ] Ollama 설치 + `gemma4:e4b` 모델
- [ ] Python 환경 (service-planner-agent용)
- [ ] Vercel CLI 로그인
- [ ] Cloudflare Wrangler 로그인
