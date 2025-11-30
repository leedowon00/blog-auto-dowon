# 블로그 업데이트 내역

## 2025-11-28 업데이트

### ✅ 수정된 기능

1. **캘린더 뷰 전환 기능 수정**
   - "월", "주", "일" 버튼 클릭 시 뷰가 정상적으로 전환됨
   - 상태 관리 (`currentView`, `currentDate`) 추가
   - `onView`, `onNavigate` 핸들러 연결

2. **캘린더 날짜 표시 형식 개선**
   - 기존: "2025년 11월 11일"
   - 수정: "2025년 11월"
   - 커스텀 `formats` 객체 추가
   - 주간/일간 뷰에서도 적절한 날짜 형식 표시

3. **사이드바 카테고리명 확인**
   - 모든 카테고리가 올바른 이름으로 표시됨:
     - ✅ "몰입"
     - ✅ "회화 MASTER"
     - ✅ "영어"
     - ✅ "일본어"
     - ✅ "체험"

4. **PostCard 링크 개선**
   - catch-all route `[...slug]`와 호환되도록 경로 생성 개선
   - 중첩 카테고리 경로 정상 작동

### 🎨 적용된 스타일

- react-big-calendar에 Tailwind CSS 기반 커스텀 스타일 적용
- 툴바 버튼에 hover 효과 추가
- 월/주/일 뷰에서 일관된 디자인 유지

### 📁 생성된 파일들

#### 마크다운 블로그 글
- `blog/에어드랍/2025-11-28-GRASS에어드랍가이드.md`
- `blog/바이브코딩/2025-11-26-NextJS15신기능.md`
- `blog/AI 최신 소식/2025-11-28-AI가바꾸는미래.md`
- `blog/회화 MASTER/영어/2025-11-28-영어회화첫시작.md`
- `blog/회화 MASTER/일본어/2025-11-27-히라가나기초.md`

#### 문서
- `README.md`: 기술 문서 (개발자용)
- `GUIDE.md`: 초보자용 가이드 (중학생도 이해 가능)
- `CHANGELOG.md`: 이 파일 (업데이트 내역)

### 📋 테스트 완료 항목

- ✅ 빌드 성공 (npm run build)
- ✅ 개발 서버 실행 (npm run dev)
- ✅ 메인 페이지 렌더링
- ✅ 달력 표시 및 뷰 전환
- ✅ 사이드바 네비게이션
- ✅ 카테고리 페이지
- ✅ 포스트 상세 페이지
- ✅ 태그 페이지
- ✅ 반응형 디자인

### 🔧 기술 스택

- **Framework**: Next.js 16.0.4
- **React**: 19.2.0
- **Styling**: Tailwind CSS 4 + Shadcn UI
- **Calendar**: react-big-calendar
- **Markdown**: gray-matter + react-markdown
- **Date**: date-fns (version 4)
- **Language**: TypeScript 5

### 📝 주요 컴포넌트

1. **CalendarSection** (`src/components/calendar-section.tsx`)
   - 큰 캘린더 표시
   - 일정 추가/수정/삭제
   - 월/주/일 뷰 전환
   - 로컬스토리지 기반 저장

2. **Sidebar** (`src/components/sidebar.tsx`)
   - 7개 메인 카테고리
   - 중첩 서브카테고리 지원
   - 아코디언 메뉴
   - 반응형 (모바일: Sheet)

3. **PostCard** (`src/components/post-card.tsx`)
   - 글 카드 UI
   - 태그 색상 코딩
   - 호버 애니메이션

4. **Layout** (`src/components/layout.tsx`)
   - 전체 레이아웃
   - 사이드바 + 메인 콘텐츠
   - 푸터

### 🚀 배포 준비

- Vercel 배포 설정 완료 (`vercel.json`)
- 정적 빌드 가능
- 환경 변수 설정 가능

### 💡 다음 단계 (선택사항)

1. **구글 캘린더 연동**
   - Google Cloud Console 설정
   - OAuth 2.0 인증
   - Calendar API 연동

2. **검색 기능 추가**
   - 글 제목/내용 검색
   - 태그 기반 필터링

3. **댓글 시스템**
   - Giscus 또는 Utterances 연동

4. **다크 모드 토글**
   - 테마 스위처 UI 추가

5. **RSS 피드**
   - 블로그 구독 기능

### 🐛 알려진 이슈

없음

### 👥 기여자

- Antigravity Team

---

**마지막 업데이트**: 2025년 11월 28일
