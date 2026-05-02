# 📊 LG AI Global Commerce 마스터 대시보드

**LG AI Global Commerce MSA 프로젝트** 관련 모든 문서를 체계적으로 정리한 마스터 진입점입니다. 옵시디언 환경 내에서 궁금한 도메인의 링크를 클릭하여 상세 컨텍스트를 확인하십시오.

## 🏆 AX 해커톤 (D-Day: 5/20)

5. **해커톤 마스터 플랜**
   * 📎 [[AX_Hackathon_Plan]] : 팀 구성, 5개 데모 시나리오, 타임라인
6. **팀원 서비스 API 맵**
   * 📎 [[Team_API_Map]] : 손정보 MSA 4개 서비스 + 이호석 어드민 API 엔드포인트 전체 정리
7. **CLOi 봇 개발 로그**
   * 📎 [[CLOi_Development_Log]] : Function Calling 연동, 상품검색, CS 기능 개발 기록

8. **기능별 솔루션 스택 제안**
   * 📎 [[Solution_Toolchain_Proposal]] : 프론트엔드, 백엔드, AI 인프라 등 생산성 극대화를 위한 도구(Lovable 등) 활용 방안 제안

## 문서 디렉토리

1. **시스템 구조 및 배포 환경**
   * 📎 [[Project_Architecture]] : Astro 기반 Frontend 아키텍처, Cloudflare 인프라, 컴포넌트 등 개요
2. **AI 구조 및 에이전트 연동**
   * 📎 [[AI_Agent_Orchestration]] : 2-Tier 마스터-프록시 아키텍처, Gemma4 기반 로컬 & Gemini 프로덕션 배포 시스템
3. **사용자 인터페이스 (UI/UX)**
   * 📎 [[UI_Component_3D_Widget]] : CLOi 3D 로봇 위젯 · Atlas CS 위젯 통합 내역 및 팀 협업 가이드
4. **Git 변경 이력**
   * 📎 [[Git_Changelog]] : 주요 커밋 타임라인 및 버전별 변경 내역
5. **작업 로그 (최신)**
   * 📎 **2026-05-02 작업**: `lg-ai-commerce-msa` 로컬 개발 서버 시작 완료 (`http://localhost:4321/`)
   * 📎 **2026-05-02 작업**: 어드민 사이트(`hoseok-app_ax`) 로컬 개발 서버 시작 완료 (`http://localhost:5173/`)
   * 📎 **2026-05-02 작업**: 어드민 사이트 백엔드 API 서버(`hoseok-app_ax/server`) 시작 완료 (`http://localhost:3000/`)
   * 📎 **2026-05-02 작업**: 메인 커머스 프론트엔드 랜딩 페이지 배경 이미지 및 텍스트 교체 (AI-Powered 컨셉 반영)
   * 📎 **2026-05-02 작업**: 첫 접속 시 풀스크린 이미지 랜딩 페이지 구축 및 "Start Shopping" 버튼 추가
   * 📎 **2026-05-02 작업**: 랜딩 페이지 이미지 잘림 현상 수정 (배경 이미지 contain 및 블러 레이어 적용)
   * 📎 **2026-05-02 작업**: 랜딩 페이지에 CLOi 봇 배치 및 첫 화면에서 자동 인사말 출력(`autoOpen`) 기능 추가
   * 📎 **2026-05-02 작업**: CLOi 봇 대화창 UI를 밝고 깔끔한 화이트/그레이 기반의 UK 공식 챗봇 톤앤매너로 전면 개편
   * 📎 **2026-05-02 작업**: 랜딩 페이지 이미지 PC/모바일 최적화 (정방형 이미지 잘림 방지 및 블러 레이어로 여백 채움)
   * 📎 **2026-05-02 작업**: 스플래시 랜딩 페이지 삭제 및 본래의 커머스 홈 화면 복구. Hero 배너 영역에 "Watch AI Vision" 버튼을 추가하여 다운받은 AI 영상 모달 재생 연동 (1회 재생 후 종료)

> 이 노트들은 새로운 `lg-ai-commerce-msa` 환경의 프론트 및 백엔드 아키텍처를 기반으로 작성되었습니다.
> 
> **GitHub:** [Jeongbo/lg-ai-commerce](https://github.com/Jeongbo/lg-ai-commerce)

