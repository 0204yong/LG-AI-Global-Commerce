"""서비스 기획자 에이전트 - FastAPI 서버"""

import json
import asyncio
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse

from agent import PlannerAgent
from models import ChatRequest
from prompts import QUICK_ACTION_PROMPTS

app = FastAPI(title="서비스 기획자 에이전트", version="1.0.0")

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 에이전트 인스턴스
agent = PlannerAgent()


@app.get("/api/models")
async def get_models():
    """사용 가능한 LLM 모델 목록 반환"""
    models = agent.get_available_models()
    return {"models": models}


@app.post("/api/chat")
async def chat(request: ChatRequest):
    """채팅 메시지 처리 (SSE 스트리밍)"""
    message = request.message
    model_id = request.model
    session_id = request.session_id or "default"

    # 빠른 액션 프롬프트 처리
    if message in QUICK_ACTION_PROMPTS:
        message = QUICK_ACTION_PROMPTS[message]

    async def event_generator():
        try:
            async for token in agent.stream_response(message, model_id, session_id):
                yield {
                    "event": "token",
                    "data": json.dumps({"token": token}, ensure_ascii=False)
                }
            yield {
                "event": "done",
                "data": json.dumps({"status": "complete"})
            }
        except ValueError as e:
            yield {
                "event": "error",
                "data": json.dumps({"error": str(e)}, ensure_ascii=False)
            }
        except Exception as e:
            yield {
                "event": "error",
                "data": json.dumps(
                    {"error": f"응답 생성 중 오류가 발생했습니다: {str(e)}"},
                    ensure_ascii=False
                )
            }

    return EventSourceResponse(event_generator())


@app.delete("/api/history")
async def clear_history(session_id: str = "default"):
    """대화 히스토리 초기화"""
    agent.clear_history(session_id)
    return {"status": "cleared"}


@app.get("/api/quick-actions")
async def get_quick_actions():
    """빠른 액션 목록 반환"""
    actions = [
        {"id": "brainstorm", "label": "🧠 아이디어 브레인스토밍", "description": "혁신적인 서비스 아이디어를 제안받습니다"},
        {"id": "persona", "label": "👤 사용자 페르소나", "description": "타겟 사용자 페르소나를 작성합니다"},
        {"id": "spec", "label": "📋 기능 명세서", "description": "서비스 기능 명세서를 작성합니다"},
        {"id": "market", "label": "📊 시장 분석", "description": "시장 분석을 수행합니다"},
    ]
    return {"actions": actions}


# 프론트엔드 정적 파일 서빙
app.mount("/static", StaticFiles(directory="../frontend"), name="static")


@app.get("/")
async def root():
    """메인 페이지"""
    return FileResponse("../frontend/index.html")
