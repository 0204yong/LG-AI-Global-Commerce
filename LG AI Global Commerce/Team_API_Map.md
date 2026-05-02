# 🔗 팀원 서비스 API 맵

> 손정보 MSA + 이호석 어드민 API 전체 정리 + 3단계 체인 구조
> **최종 수정**: 2026-05-01

---

## 서비스 포트 맵

| 서비스 | 포트 | 담당 | DB |
|--------|------|------|-----|
| **catalog-service** | `:8080` | 손정보 | Neon PostgreSQL (공유) |
| **order-service** | `:8081` | 손정보 | Neon PostgreSQL (공유) |
| **member-service** | `:8082` | 손정보 | Neon PostgreSQL (공유) |
| **promotion-service** | `:8083` | 손정보/노은정 | Neon PostgreSQL (공유) |
| **app_ax (어드민)** | `:3000` | 이호석 | **SQLite** (Prisma) |

## 🔗 CLOi 3단계 백엔드 체인

```
손정보 Spring Boot (:8080/:8081) → 이호석 Express (:3000) → 로컬 Fallback
```
- 각 도구가 1번 백엔드 실패 시 2번으로 자동 전환
- 모든 백엔드 미실행 시 로컬 `products.ts` 데이터 사용
- ✅ 이호석 DB 연동 검증 완료 (2026-05-01)

## Catalog API (`localhost:8080`)

| Method | Endpoint | 설명 |
|--------|----------|------|
| `GET` | `/api/v1/catalog/categories/tree` | 카테고리 트리 |
| `GET` | `/api/v1/catalog/products` | 상품 목록 (페이징) |
| `GET` | `/api/v1/catalog/products/search?keyword=` | **상품 검색** ⭐ |
| `GET` | `/api/v1/catalog/products/{sku}` | 상품 상세 |

## Order API (`localhost:8081`)

| Method | Endpoint | 설명 |
|--------|----------|------|
| `POST` | `/api/orders` | 주문 생성 |
| `GET` | `/api/orders/{id}` | 단건 주문 조회 |
| `GET` | `/api/orders` | 전체 주문 목록 |
| `PATCH` | `/api/orders/{id}/status` | 상태 변경 (PENDING→PAID→SHIPPED→DELIVERED) |

## Member API (`localhost:8082`)

| Method | Endpoint | 설명 |
|--------|----------|------|
| `POST` | `/api/members` | 회원 가입 |
| `GET` | `/api/members/{id}` | 회원 조회 |
| `GET` | `/api/members` | 전체 회원 목록 |

## Promotion API (`localhost:8083`)
> ⚠️ Controller 미구현 — 노은정님 작업 영역

---

## 이호석 Express API (`localhost:3000`)

| Method | Endpoint | 설명 |
|--------|----------|------|
| `GET` | `/api/products?storeId=KR` | 상품 목록 (스토어별) |
| `POST` | `/api/products` | 상품 등록 |
| `GET` | `/api/orders` | 전체 주문 (pagination) |
| `GET` | `/api/orders/{id}` | 주문 상세 + 상태이력 |
| `POST` | `/api/orders` | 주문 생성 (재고 차감 트랜잭션) |
| `PATCH` | `/api/orders/{id}/status` | 상태 변경 (취소/반품 시 재고 복구) |
| `POST` | `/api/orders/seed` | 데모 주문 5건 생성 |
| `GET` | `/api/dashboard` | 대시보드 통계 |
| `POST` | `/api/agent` | AI Agent 연동 |

### 이호석 DB 스키마 (Prisma/SQLite)
- **Store**: KR, US (글로벌 롬아웃 지원)
- **Product**: 상품코드, 가격, 재고, 다국어 번역(ProductTranslation)
- **Order**: 주문번호, 고객정보, 결제방법, 상태이력(OrderStatusHistory)
- **AdminUser**: SUPER_ADMIN / SUB_ADMIN 권한

---

📎 관련 문서: [[AX_Hackathon_Plan]] · [[CLOi_Development_Log]]
