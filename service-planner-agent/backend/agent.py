"""기획자 에이전트 - LangChain 기반 멀티 LLM 지원"""

import os
from typing import AsyncIterator, Dict, List
from dotenv import load_dotenv

from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_core.language_models import BaseChatModel

from prompts import SYSTEM_PROMPT

load_dotenv()


def _init_openai(model_name: str) -> BaseChatModel | None:
    key = os.getenv("OPENAI_API_KEY", "")
    if not key or key.startswith("your-"):
        return None
    from langchain_openai import ChatOpenAI
    return ChatOpenAI(model=model_name, api_key=key, streaming=True)


def _init_gemini(model_name: str) -> BaseChatModel | None:
    key = os.getenv("GOOGLE_API_KEY", "")
    if not key or key.startswith("your-"):
        return None
    from langchain_google_genai import ChatGoogleGenerativeAI
    return ChatGoogleGenerativeAI(model=model_name, google_api_key=key, streaming=True)


def _init_claude(model_name: str) -> BaseChatModel | None:
    key = os.getenv("ANTHROPIC_API_KEY", "")
    if not key or key.startswith("your-"):
        return None
    from langchain_anthropic import ChatAnthropic
    return ChatAnthropic(model=model_name, anthropic_api_key=key, streaming=True)


def _init_ollama(model_name: str) -> BaseChatModel | None:
    try:
        from langchain_ollama import ChatOllama
        # 로컬 환경에서 구동되는 Ollama 연결 (기본 URL: http://localhost:11434)
        return ChatOllama(model=model_name)
    except Exception as e:
        print(f"Ollama 모델 에러: {e}")
        return None


# 모델 레지스트리
MODEL_REGISTRY: Dict[str, dict] = {
    "gpt-4o": {
        "name": "GPT-4o",
        "provider": "OpenAI",
        "init": lambda: _init_openai("gpt-4o"),
        "icon": "🟢"
    },
    "gpt-4o-mini": {
        "name": "GPT-4o Mini",
        "provider": "OpenAI",
        "init": lambda: _init_openai("gpt-4o-mini"),
        "icon": "🟢"
    },
    "gemini-1.5-flash": {
        "name": "Gemini 1.5 Flash",
        "provider": "Google",
        "init": lambda: _init_gemini("gemini-1.5-flash"),
        "icon": "🔵"
    },
    "gemini-2.0-flash": {
        "name": "Gemini 2.0 Flash",
        "provider": "Google",
        "init": lambda: _init_gemini("gemini-2.0-flash"),
        "icon": "🔵"
    },
    "gemini-2.5-pro-exp-03-25": {
        "name": "Gemini 2.5 Pro",
        "provider": "Google",
        "init": lambda: _init_gemini("gemini-2.5-pro-exp-03-25"),
        "icon": "🔵"
    },
    "claude-3-5-sonnet-latest": {
        "name": "Claude 3.5 Sonnet",
        "provider": "Anthropic",
        "init": lambda: _init_claude("claude-3-5-sonnet-latest"),
        "icon": "🟠"
    },
    "claude-3-5-haiku-latest": {
        "name": "Claude 3.5 Haiku",
        "provider": "Anthropic",
        "init": lambda: _init_claude("claude-3-5-haiku-latest"),
        "icon": "🟠"
    },
    "gemma4:e4b": {
        "name": "Local Gemma 4",
        "provider": "Ollama",
        "init": lambda: _init_ollama("gemma4:e4b"),
        "icon": "🔒"
    },
}


class PlannerAgent:
    """서비스 기획 전문가 에이전트"""

    def __init__(self):
        self._sessions: Dict[str, List] = {}  # session_id -> message history
        self._model_cache: Dict[str, BaseChatModel] = {}

    def _get_model(self, model_id: str) -> BaseChatModel:
        """모델을 가져오거나 초기화"""
        if model_id not in self._model_cache:
            if model_id not in MODEL_REGISTRY:
                raise ValueError(f"지원하지 않는 모델: {model_id}")
            model = MODEL_REGISTRY[model_id]["init"]()
            if model is None:
                raise ValueError(
                    f"{MODEL_REGISTRY[model_id]['provider']} API 키가 설정되지 않았습니다. "
                    f".env 파일을 확인해주세요."
                )
            self._model_cache[model_id] = model
        return self._model_cache[model_id]

    def _get_history(self, session_id: str) -> List:
        """세션의 대화 히스토리 반환"""
        if session_id not in self._sessions:
            self._sessions[session_id] = []
        return self._sessions[session_id]

    def clear_history(self, session_id: str = "default"):
        """대화 히스토리 초기화"""
        self._sessions[session_id] = []
        # 모델 캐시도 초기화 (API 키 변경 대응)
        self._model_cache.clear()

    def get_available_models(self) -> list:
        """사용 가능한 모델 목록 반환"""
        available = []
        for model_id, info in MODEL_REGISTRY.items():
            model = info["init"]()
            available.append({
                "id": model_id,
                "name": info["name"],
                "provider": info["provider"],
                "icon": info["icon"],
                "available": model is not None
            })
        return available

    async def stream_response(
        self, message: str, model_id: str = "gpt-4o", session_id: str = "default"
    ) -> AsyncIterator[str]:
        """스트리밍 응답 생성"""
        model = self._get_model(model_id)
        history = self._get_history(session_id)

        # 메시지 구성
        messages = [SystemMessage(content=SYSTEM_PROMPT)]
        for msg in history:
            if msg["role"] == "user":
                messages.append(HumanMessage(content=msg["content"]))
            else:
                messages.append(AIMessage(content=msg["content"]))
        messages.append(HumanMessage(content=message))

        # 사용자 메시지 히스토리에 추가
        history.append({"role": "user", "content": message})

        # 스트리밍 응답
        full_response = ""
        async for chunk in model.astream(messages):
            token = chunk.content
            if token:
                full_response += token
                yield token

        # 어시스턴트 응답 히스토리에 추가
        history.append({"role": "assistant", "content": full_response})

        # 히스토리 제한 (최근 20개 메시지만 유지)
        if len(history) > 20:
            self._sessions[session_id] = history[-20:]
