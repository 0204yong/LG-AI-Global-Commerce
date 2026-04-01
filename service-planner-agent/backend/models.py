"""Pydantic 데이터 모델 정의"""

from pydantic import BaseModel
from typing import Optional


class ChatRequest(BaseModel):
    """채팅 요청 모델"""
    message: str
    model: str = "gpt-4o"
    session_id: Optional[str] = "default"


class ChatMessage(BaseModel):
    """채팅 메시지 모델"""
    role: str  # "user" or "assistant"
    content: str
