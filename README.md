# Antigravity Blog

Next.js 기반의 마크다운 블로그입니다. 구글 캘린더 연동과 카테고리별 분류 기능을 제공합니다.

## 📋 주요 기능

- ✅ **마크다운 기반 글 작성**: `.md` 파일로 간편하게 글 작성
- ✅ **중첩 카테고리 지원**: 카테고리 안에 서브카테고리 무제한 생성 가능
- ✅ **구글 캘린더 연동**: 메인 페이지에서 일정 관리 (로컬 저장소 기반)
- ✅ **태그 시스템**: 글마다 태그를 달아서 분류
- ✅ **반응형 디자인**: PC와 모바일 모두 지원
- ✅ **세련된 UI**: Shadcn UI와 Tailwind CSS 사용

## 🚀 시작하기

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:3000` (또는 3001) 을 열어보세요.

### 3. 프로덕션 빌드
```bash
npm run build
npm start
```

## 📝 글 작성 방법

### 파일 위치
글은 `blog/` 폴더 안에 카테고리별로 저장합니다.

**예시 폴더 구조:**
```
blog/
├── 에어드랍/
│   └── 2025-11-28-GRASS에어드랍가이드.md
├── 바이브코딩/
│   └── 2025-11-26-NextJS15신기능.md
├── AI 최신 소식/
│   └── 2025-11-28-AI가바꾸는미래.md
└── 회화 MASTER/
    ├── 영어/
    │   └── 2025-11-28-영어회화첫시작.md
    └── 일본어/
        └── 2025-11-27-히라가나기초.md
```

### 파일명 규칙
파일명은 반드시 **`YYYY-MM-DD-제목.md`** 형식으로 작성해야 합니다.

- ✅ `2025-11-28-안녕하세요.md`
- ✅ `2025-12-01-Next.js배우기.md`
- ❌ `안녕하세요.md` (날짜 없음)
- ❌ `2025-11-28안녕.md` (하이픈 누락)

### Frontmatter (메타데이터)
각 마크다운 파일 맨 위에 메타데이터를 작성합니다.

```markdown
---
title: 글 제목
tags: [태그1, 태그2, 태그3]
category: 카테고리/서브카테고리
summary: 글 요약 (한 줄 설명)
date: 2025-11-28
---

# 본문 제목

여기부터 본문 내용을 작성하세요.
```

**필수 항목:**
- `title`: 글 제목
- `tags`: 태그 목록 (배열 형태)
- `category`: 카테고리 경로 (폴더 구조와 일치)
- `summary`: 글 요약
- `date`: 작성 날짜

### 마크다운 예시
```markdown
---
title: 영어 회화 첫 시작
tags: [영어, 회화, 초급]
category: 회화 MASTER/영어
summary: 영어 회화를 처음 시작하는 분들을 위한 가이드입니다.
date: 2025-11-28
---

# 영어 회화 첫 시작

안녕하세요! 오늘은 영어 회화를 처음 시작하시는 분들을 위한 기본 가이드를 준비했습니다.

## 기본 인사말

영어 회화의 첫 걸음은 인사말부터 시작합니다.

- **Hello!** - 안녕하세요!
- **Good morning** - 좋은 아침입니다
```

## 📁 폴더 구조 설명

```
blog_auto_dowon/
├── blog/                    # 📝 블로그 글 저장소 (여기에 .md 파일 작성)
│   ├── 에어드랍/
│   ├── 바이브코딩/
│   ├── AI 최신 소식/
│   ├── 할인 이벤트/
│   ├── 몰입/
│   ├── 회화 MASTER/
│   │   ├── 영어/
│   │   └── 일본어/
│   └── 체험/
├── src/
│   ├── components/          # 🎨 React 컴포넌트들
│   │   ├── sidebar.tsx      # 왼쪽 사이드바
│   │   ├── calendar-section.tsx  # 캘린더
│   │   ├── layout.tsx       # 페이지 레이아웃
│   │   └── post-card.tsx    # 글 카드
│   ├── lib/                 # 🔧 유틸리티 함수들
│   │   ├── posts.ts         # 마크다운 파싱 로직
│   │   └── types.ts         # TypeScript 타입 정의
│   ├── pages/               # 📄 Next.js 페이지
│   │   ├── index.tsx        # 메인 페이지
│   │   └── blog/[...slug].tsx  # 글/카테고리 페이지
│   └── styles/              # 💅 스타일 파일
└── public/                  # 🖼️ 이미지 등 정적 파일
```

## 🎨 디자인 커스터마이징

### 색상 변경
`src/styles/globals.css` 파일에서 색상을 변경할 수 있습니다.

```css
:root {
  --primary: 220 90% 56%;  /* 메인 컬러 */
  --secondary: 210 40% 96%;  /* 보조 컬러 */
}
```

### 사이드바 카테고리 수정
`src/components/sidebar.tsx` 파일의 `categories` 배열을 수정하세요.

```typescript
const categories: CategoryItem[] = [
  {
    title: "새 카테고리",
    href: "/blog/새 카테고리",
  },
  // 중첩 카테고리 예시
  {
    title: "부모 카테고리",
    items: [
      { title: "자식1", href: "/blog/부모 카테고리/자식1" },
      { title: "자식2", href: "/blog/부모 카테고리/자식2" },
    ],
  },
]
```

## 📅 캘린더 사용법

메인 페이지의 캘린더에서:
1. **날짜 클릭**: 해당 날짜에 일정 추가
2. **"일정 추가" 버튼**: 새 일정 만들기
3. 일정은 브라우저의 로컬 저장소에 저장됩니다.

### 구글 캘린더 연동 (고급)
실제 구글 캘린더와 연동하려면:
1. Google Cloud Console에서 프로젝트 생성
2. Calendar API 활성화
3. OAuth 2.0 Client ID 생성
4. `.env.local` 파일에 환경변수 추가

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id
NEXT_PUBLIC_GOOGLE_API_KEY=your_api_key
```

## 🚢 배포 (Vercel)

### 1단계: Vercel 계정 생성
[vercel.com](https://vercel.com)에서 회원가입

### 2단계: GitHub 연동
GitHub 저장소와 연결

### 3단계: 배포
Vercel이 자동으로 빌드하고 배포합니다.

```bash
# 또는 Vercel CLI 사용
npm i -g vercel
vercel
```

## 🛠️ 트러블슈팅

### 빌드 에러가 나요
```bash
# .next 폴더 삭제 후 재시도
rm -rf .next
npm run build
```

### 글이 안 보여요
1. 파일명이 `YYYY-MM-DD-제목.md` 형식인지 확인
2. Frontmatter가 제대로 작성되었는지 확인
3. 파일이 `blog/` 폴더 안에 있는지 확인

### 카테고리가 안 보여요
1. `blog/` 아래에 폴더를 만들었는지 확인
2. `.md` 파일의 `category` 항목이 폴더 경로와 일치하는지 확인

## 📚 기술 스택

- **Framework**: Next.js 16
- **Styling**: Tailwind CSS + Shadcn UI
- **Markdown**: gray-matter + react-markdown
- **Calendar**: react-big-calendar + date-fns
- **Language**: TypeScript

## 💡 팁

1. **이미지 추가**: `public/images/` 폴더에 이미지를 넣고 `![설명](/images/파일명.jpg)` 형식으로 사용
2. **코드 하이라이팅**: 마크다운에서 \`\`\`언어 형식으로 코드 블록 사용
3. **링크**: `[텍스트](URL)` 형식으로 링크 추가

## 🤝 기여

버그를 발견하거나 개선 사항이 있다면 이슈를 열어주세요!

## 📄 라이선스

MIT License

---

**만든 사람**: DOWON  
**블로그 시작일**: 2025년 11월
