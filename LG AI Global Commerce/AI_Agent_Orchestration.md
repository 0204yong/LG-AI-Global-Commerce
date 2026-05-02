# 🤖 LG AI Commerce Platform - AI 에이전트 & 멀티 백엔드 시스템

## 1. 하이브리드 멀티 백엔드 모델

LG AI Commerce는 유연한 개발 및 프로덕션 환경을 위해 **Gemma4 (Local)** 와 **Gemini API** 간의 하이브리드 전환 구조를 구축했습니다.

* **로컬 모델 (Gemma4 via Ollama):** 개발, 테스트 및 보안성이 요구되는 데이터 처리에 사용하여 비용 절감 및 빠르고 독립적인 환경 구성.
* **클라우드 모델 (Gemini API):** 실 서비스 시나리오에서 안정적인 AI 에이전트 성능을 보장할 수 있도록 프로덕션 환경에서 전환되어 사용됨.

## 2. 2-Tier Master-Proxy 구조

AI 에이전트 간 효율적이고 통합된 명령 처리를 위해 **2-Tier Master-Proxy 구조**를 적용했습니다.

* AI 채팅 인터페이스에서의 응답과 프론트엔드-백엔드 간 통신을 제어하는 프록시 아키텍처.
* 상태 업데이트 (예: `execUpdateInventory` 등 도구 실행 핸들러)가 백엔드 MCP 통신 연동을 통해 시각적이고 즉각적인 피드백을 사용자에게 보여줌으로써 안정성을 확보.

## 3. Docker MCP 구동
MCP (Model Context Protocol) 시스템을 Docker 위에서 배포 및 실행하여 외부 도구나 API 연동 시 AI 에이전트들의 독립성과 보안을 보장 시킴.

---
[[Main_Dashboard]] 로 돌아가기
