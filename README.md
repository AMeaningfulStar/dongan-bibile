# 📖 청신호: 교회 청년부 성경읽기 챌린지 플랫폼

**청신호**는 교회 청년 공동체를 위한 성경 읽기 챌린지 웹 플랫폼입니다.

시즌별 성경 계획에 따라 말씀을 읽고, 큐티 키워드를 나누며 영적 여정을 함께해요!

---

## 🚀 주요 기능

### ✅ 사용자 기능

- 📅 캘린더를 통해 매일의 성경 말씀 확인
- 📖 사용자가 선택한 성경 버전으로 본문 읽기 (`개역개정`, `쉬운성경`)
- ✍️ 큐티 키워드 작성 및 좋아요 기능
- 📊 내가 읽은 말씀 날짜 확인 (진행률)

### ✅ 관리자 기능

- 🛠 시즌 생성, 수정, 삭제
- 📖 날짜별 성경 본문 지정
- 👥 사용자 등록/관리
- 📅 성경 일정 관리 (UI 기반 입력)
- 🔐 역할 기반 권한 제어 (`admin`, `department_admin`, `read_only`, `user`)

---

## 🧩 기술 스택

| 구분 | 기술 |
| --- | --- |
| 프론트엔드 | Next.js 14.2.4 (App Router), TypeScript |
| 인증 & 데이터 | Firebase (Auth, Firestore) |
| 상태 관리 | Zustand |
| API 통신 | SWR, Axios |
| 날짜 관리 | Moment.js |
| 캘린더 UI | react-calendar |
| 스타일 | Tailwind CSS |

---

## 📁 프로젝트 구조

```bash
/src
├── app/                     # Next.js 라우팅
│   ├── api/                  # API 관리
│   ├── bible/                # 성경 읽기 페이지
│   ├── admin/                # 관리자 페이지
│   └── ...
├── components/              # UI 공통 컴포넌트
├── hooks/                   # 사용자 정의 훅 (useAuth 등)
├── stores/                  # Zustand 전역 상태
├── types/                   # 타입 정의
├── lib/                     # firebase 설정
└── utils/                   # 유틸 함수
```
