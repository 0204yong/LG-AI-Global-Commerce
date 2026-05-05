# 🖥️ 회사 PC (Antigravity) 이관 가이드

> **작성일**: 2026-05-05
> **목적**: 현재 PC의 AIproject 워크스페이스를 회사 PC에서 연속 작업하기 위한 파일 이관 가이드

---

## 📋 이관 방법 요약

### 방법 1: Git Clone (가장 간편 ⭐ 권장)
```bash
git clone https://github.com/0204yong/AI-Demo.git AIproject
```
> Git에 이미 대부분의 코드가 push되어 있으므로, clone 후 아래 **추가 파일만 수동 복사**하면 됩니다.

### 방법 2: 폴더 전체 복사 (USB / 클라우드)
`c:\AIproject` 폴더를 통째로 복사하되, **node_modules 제외** (용량 절약)

---

## 🔴 Git에 포함되지 않는 필수 파일 (반드시 수동 이관)

### 1. 환경변수 파일 (.env)
| 파일 경로 | 내용 |
|---|---|
| `AIproject/.env` | `GEMINI_API_KEY=AIzaSyA7qBRS5uZF28ka81cIgJt6MyskNxVkaEE` |
| `AIproject/lg-ai-commerce-msa/.env` | `GEMINI_API_KEY=AIzaSyA7qBRS5uZF28ka81cIgJt6MyskNxVkaEE` |
| `AIproject/lg-ai-commerce-msa/.env.development` | `PUBLIC_API_URL=http://localhost:8080` |
| `AIproject/lg-ai-commerce-msa/.env.production` | `PUBLIC_API_URL=https://lg-ai-commerce-catalog-service.onrender.com` |

### 2. 커밋되지 않은 변경사항
현재 아래 파일에 uncommitted 변경이 있습니다:
- `hoseok-app_ax/src/pages/StorePreview.tsx` (수정)
- `k-culture-explorer` (서브모듈 변경)
- `lg-ai-commerce-msa` (서브모듈 변경)

> ⚠️ **이관 전에 반드시 commit & push 하세요!**
> ```bash
> cd c:\AIproject
> git add -A
> git commit -m "chore: sync all changes before PC migration"
> git push origin main
> ```

---

## 🟡 Antigravity (AI 도구) 설정 파일

회사 PC에서도 Antigravity를 사용하려면 아래 설정을 복사해야 합니다:

### MCP 서버 설정
**원본**: `C:\Users\user\.gemini\antigravity\mcp_config.json`
```json
{
  "mcpServers": {
    "gemma-local": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-ollama", "--model", "gemma4:e4b"],
      "env": { "OLLAMA_URL": "http://localhost:11434" }
    },
    "lg-admin": {
      "command": "node",
      "args": ["c:\\AIproject\\mcp-servers\\lg-admin\\index.js"]
    }
  }
}
```
> ⚠️ 회사 PC에서 경로가 다르면 `args` 경로를 수정해야 합니다.

### MCP 서버 코드
- `AIproject/mcp-servers/lg-admin/` (전체 폴더)
- `AIproject/mcp-servers/atlas-cs/` (전체 폴더)
- `AIproject/mcp-servers/claude_desktop_config.json`

### Antigravity Brain (대화 기록 & 지식)
**원본 폴더**: `C:\Users\user\.gemini\antigravity\brain\`
- 19개 대화 히스토리 포함
- 선택사항이지만, 과거 맥락을 유지하고 싶다면 복사

**복사 위치 (회사 PC)**: `C:\Users\<회사계정>\.gemini\antigravity\brain\`

---

## 🟢 Git에 이미 포함된 프로젝트 (Clone하면 자동 확보)

| 프로젝트 | 설명 | 비고 |
|---|---|---|
| `LG AI Global Commerce/` | 메인 랜딩페이지 (PWA) | Vercel 배포 |
| `lg-ai-commerce-msa/` | Astro 기반 MSA 프론트엔드 | Cloudflare Pages |
| `hoseok-app_ax/` | React+Vite 관리자 앱 | 로컬 개발 |
| `service-planner-agent/` | K-Culture 서비스 기획 에이전트 | Python 백엔드 포함 |
| `k-culture-explorer/` | K-Culture 탐색기 | 서브모듈 |
| `BusTimer/` | 버스타이머 앱 (Android/iOS/Backend) | 부프로젝트 |
| `catalog-service/` | 카탈로그 마이크로서비스 | |
| `jeongbo-*` 폴더들 | 정보님 담당 서비스들 | |
| `mcp-servers/` | MCP 서버 코드 | |
| `api/` | API 관련 | |

---

## 🔧 회사 PC 셋업 순서

```
1. Git 설치 확인
2. Node.js (v18+) 설치 확인
3. git clone https://github.com/0204yong/AI-Demo.git c:\AIproject
4. .env 파일들 수동 생성 (위 표 참고)
5. 각 프로젝트 npm install
   - cd c:\AIproject\LG AI Global Commerce && npm install
   - cd c:\AIproject\lg-ai-commerce-msa && npm install
   - cd c:\AIproject\hoseok-app_ax && npm install
   - cd c:\AIproject\service-planner-agent\frontend (필요시)
6. Antigravity 설치 후 mcp_config.json 설정
7. (선택) Ollama 설치 → gemma4:e4b 모델 pull
8. (선택) brain 폴더 복사 (대화 기록)
```

---

## 📁 수동 복사 체크리스트

- [ ] `.env` 파일 4개 생성
- [ ] uncommitted 변경사항 commit & push
- [ ] `mcp_config.json` → 회사 PC Antigravity 경로에 복사
- [ ] `mcp-servers/` 폴더 확인 (Git에 포함되어 있음)
- [ ] (선택) `brain/` 폴더 복사
- [ ] 각 프로젝트 `npm install` 실행
- [ ] Vercel / Cloudflare 계정 로그인 (배포 필요시)

---

## ⚠️ 주의사항

1. **node_modules는 복사하지 마세요** → `npm install`로 다시 설치
2. **경로가 다르면** MCP 설정의 경로를 회사 PC에 맞게 수정
3. **Ollama**를 사용하려면 회사 PC에도 별도 설치 필요
4. **Python 백엔드** (`service-planner-agent/backend`)는 Python 3.x + pip install 필요
