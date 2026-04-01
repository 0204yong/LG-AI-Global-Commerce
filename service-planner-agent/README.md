# 🎯 서비스 기획자 에이전트 (Service Planner Agent)

서비스 기획에 특화된 AI 에이전트입니다. 멀티 LLM(OpenAI, Google Gemini, Anthropic Claude)을 지원합니다.

## ✨ 기능

- **🧠 아이디어 브레인스토밍** - 트렌드 기반 혁신적 서비스 아이디어 도출
- **👤 사용자 페르소나 작성** - 타겟 사용자 프로필 구체화
- **📋 기능 명세서 작성** - MVP 기능 설계 및 우선순위 정리
- **📊 시장 분석** - TAM/SAM/SOM, SWOT 분석

## 🚀 시작하기

### 1. 의존성 설치
```bash
cd backend
pip install -r requirements.txt
```

### 2. API 키 설정
```bash
# .env.example을 복사하여 .env 파일 생성
cp .env.example .env
```

`.env` 파일에 사용할 API 키를 입력합니다 (최소 하나 필수):
```
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=AI...
ANTHROPIC_API_KEY=sk-ant-...
```

### 3. 서버 실행
```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```

### 4. 접속
브라우저에서 `http://localhost:8000` 접속

## 📁 프로젝트 구조

```
service-planner-agent/
├── backend/
│   ├── main.py           # FastAPI 서버
│   ├── agent.py          # LangChain 에이전트
│   ├── prompts.py        # 시스템 프롬프트
│   ├── models.py         # 데이터 모델
│   ├── requirements.txt  # 의존성
│   └── .env.example      # 환경변수 예시
├── frontend/
│   ├── index.html        # 채팅 UI
│   ├── style.css         # 스타일시트
│   └── app.js            # 프론트엔드 로직
└── README.md
```

## 🛠 기술 스택

| 영역 | 기술 |
|------|------|
| Backend | Python, FastAPI, LangChain |
| Frontend | HTML, CSS, JavaScript |
| LLM | OpenAI GPT, Google Gemini, Anthropic Claude |
| 통신 | SSE (Server-Sent Events) |
