# 🌐 웹 배포 및 구글 캘린더 연동 가이드

이 가이드는 **중학생도 따라 할 수 있도록** 단계별로 작성되었습니다.

---

## 📌 목차

1. [웹에 블로그 배포하기 (Vercel)](#1-웹에-블로그-배포하기-vercel)
2. [구글 캘린더 연동하기](#2-구글-캘린더-연동하기)
3. [문제 해결](#3-문제-해결)

---

## 1. 웹에 블로그 배포하기 (Vercel)

### 🎯 목표
`http://localhost:3000`이 아닌, 실제 인터넷 주소(예: `https://my-blog.vercel.app`)로 블로그에 접속할 수 있도록 만들기

### ✅ 필요한 것
- GitHub 계정 (무료)
- Vercel 계정 (무료)

### 📝 단계별 진행

#### Step 1: GitHub에 코드 업로드

1. **GitHub Desktop 설치** (쉬운 방법)
   - https://desktop.github.com/ 에서 다운로드
   - 설치 후 GitHub 계정으로 로그인

2. **새 저장소 만들기**
   ```
   GitHub Desktop에서:
   - File → New Repository
   - Name: my-blog (원하는 이름)
   - Local Path: d:\vibe\antigravity\blog_auto_dowon
   - Create Repository 클릭
   ```

3. **코드 업로드하기**
   ```
   GitHub Desktop에서:
   - "Publish repository" 클릭
   - "Keep this code private" 체크 해제 (공개 저장소)
   - Publish 클릭
   ```

#### Step 2: Vercel에 배포

1. **Vercel 계정 만들기**
   - https://vercel.com 접속
   - "Sign Up" 클릭
   - "Continue with GitHub" 선택
   - GitHub으로 로그인

2. **프로젝트 배포**
   ```
   Vercel 대시보드에서:
   - "Add New..." → "Project" 클릭
   - GitHub 저장소 목록에서 "my-blog" 찾기
   - "Import" 클릭
   ```

3. **설정 확인**
   ```
   프로젝트 설정 화면:
   - Framework Preset: Next.js (자동 선택됨)
   - Build Command: npm run build (자동 설정됨)
   - Output Directory: .next (자동 설정됨)
   - "Deploy" 버튼 클릭
   ```

4. **배포 완료!** 🎉
   - 약 2-3분 후 배포 완료
   - `https://my-blog-xxx.vercel.app` 같은 주소 생성
   - 이 주소로 누구나 블로그 접속 가능!

### 🔄 자동 업데이트 설정

**한 번만 설정하면, 이후엔 자동!**

```bash
# 1. 글을 작성하거나 수정
npm run build  # 로컬에서 테스트

# 2. GitHub Desktop에서
- 변경사항 확인
- Commit message 작성 (예: "새 글 추가")
- "Commit to main" 클릭
- "Push origin" 클릭

# 3. Vercel이 자동으로 재배포!
# 약 2분 후 웹사이트에 변경사항 반영
```

### 💡 나만의 도메인 연결 (선택사항)

```
Vercel 대시보드 → 프로젝트 선택 →
Settings → Domains →
원하는 도메인 입력 (예: myblog.com)
```

**도메인 구매 필요:**
- Namecheap, GoDaddy 등에서 연간 약 $10-15
- 또는 무료로 Vercel 제공 주소 사용

---

## 2. 구글 캘린더 연동하기

### 🎯 목표
블로그의 캘린더와 Google Calendar를 동기화하여, Google Calendar에 작성한 일정이 블로그에 자동으로 표시되도록 하기

### ⚠️ 참고사항
현재 블로그 캘린더는 **LocalStorage**(브라우저 저장소)를 사용합니다. 구글 캘린더와 연동하려면 **Google Calendar API**를 사용해야 합니다.

### 📝 단계별 진행

#### Step 1: Google Cloud Console 설정

1. **Google Cloud Console 접속**
   - https://console.cloud.google.com 

2. **새 프로젝트 만들기**
   ```
   1. 상단 드롭다운 → "새 프로젝트" 클릭
   2. 프로젝트 이름: "My Blog Calendar"
   3. "만들기" 클릭
   ```

3. **Google Calendar API 활성화**
   ```
   1. 왼쪽 메뉴 → "API 및 서비스" → "라이브러리"
   2. 검색창에 "Google Calendar API" 입력
   3. "Google Calendar API" 클릭
   4. "사용" 버튼 클릭
   ```

4. **인증 정보 만들기**
   ```
   1. 왼쪽 메뉴 → "API 및 서비스" → "사용자 인증 정보"
   2. "+ 사용자 인증 정보 만들기" → "OAuth 클라이언트 ID"
   3. 애플리케이션 유형: "웹 애플리케이션"
   4. 이름: "My Blog"
   5. 승인된 JavaScript 원본:
      - http://localhost:3000
      - https://your-blog.vercel.app (실제 Vercel 주소)
   6. 승인된 리디렉션 URI:
      - http://localhost:3000/api/auth/callback
      - https://your-blog.vercel.app/api/auth/callback
   7. "만들기" 클릭
   8. **클라이언트 ID**와 **클라이언트 보안 비밀** 복사 → 안전한 곳에 저장!
   ```

#### Step 2: 환경 변수 설정

1. **로컬 환경 변수 설정**
   ```bash
   # 프로젝트 루트에 .env.local 파일 만들기
   # d:\vibe\antigravity\blog_auto_dowon\.env.local
   
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here
   GOOGLE_CLIENT_SECRET=your_client_secret_here
   ```

2. **Vercel 환경 변수 설정**
   ```
   Vercel 대시보드 → 프로젝트 선택 →
   Settings → Environment Variables →
   각 변수 추가:
   - NEXT_PUBLIC_GOOGLE_CLIENT_ID = [값 입력]
   - GOOGLE_CLIENT_SECRET = [값 입력]
   ```

#### Step 3: Google Calendar API 라이브러리 설치

```bash
npm install @googleapis/calendar axios
```

#### Step 4: 캘린더 컴포넌트 수정

**파일: `src/components/calendar-section.tsx`**

아래 코드를 추가해서 Google Calendar 이벤트를 가져옵니다:

```typescript
// 상단에 import 추가
import { useEffect } from 'react';

// CalendarSection 컴포넌트 내부에 추가
useEffect(() => {
  const fetchGoogleCalendarEvents = async () => {
    try {
      const response = await fetch('/api/google-calendar/events');
      const googleEvents = await response.json();
      
      // Google Calendar 이벤트를 현재 이벤트 형식으로 변환
      const formattedEvents = googleEvents.map((event: any) => ({
        id: event.id,
        title: event.summary,
        start: new Date(event.start.dateTime || event.start.date),
        end: new Date(event.end.dateTime || event.end.date),
        description: event.description || '',
      }));
      
      // 기존 LocalStorage 이벤트와 병합
      const localEvents = getEvents();
      setEvents([...localEvents, ...formattedEvents]);
    } catch (error) {
      console.error('Failed to fetch Google Calendar events:', error);
    }
  };

  fetchGoogleCalendarEvents();
}, []);
```

#### Step 5: Google Calendar API Route 생성

**파일: `src/pages/api/google-calendar/events.ts`**

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`
    );

    // OAuth 토큰 설정 (실제로는 사용자 로그인 후 받은 토큰 사용)
    oauth2Client.setCredentials({
      access_token: req.headers.authorization?.split(' ')[1],
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 100,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];
    res.status(200).json(events);
  } catch (error) {
    console.error('Error fetching Google Calendar events:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
```

### 🔐 OAuth 인증 플로우 구현

이 부분은 조금 복잡하므로, **간단한 대안**을 추천합니다:

#### 대안 1: Google Calendar를 공개로 설정 (가장 간단)

```typescript
// API 키만 사용 (OAuth 없이)
const calendar = google.calendar({
  version: 'v3',
  auth: process.env.GOOGLE_API_KEY // API 키만 필요
});

// 공개 캘린더 ID로 이벤트 가져오기
const events = await calendar.events.list({
  calendarId: 'your_calendar_id@group.calendar.google.com',
  // ...
});
```

**설정 방법:**
1. Google Calendar → 설정 → 특정 캘린더 설정
2. "액세스 권한" → "공개로 제공" 체크
3. "캘린더 통합" → "캘린더 ID" 복사

#### 대안 2: Next-Auth 사용 (추천)

```bash
npm install next-auth
```

이 방법은 사용자가 Google 계정으로 로그인할 수 있게 하고, 자동으로 OAuth를 처리합니다.

자세한 설정: https://next-auth.js.org/providers/google

---

## 3. 문제 해결

### ❓ 자주 묻는 질문

#### Q1: Vercel 배포가 실패했어요
```
A: Build Logs를 확인하세요
1. Vercel 대시보드 → 프로젝트 → Deployments
2. 실패한 배포 클릭
3. "View Build Logs" 확인
4. 에러 메시지 복사 후 검색하거나 질문
```

#### Q2: 환경 변수가 작동하지 않아요
```
A: Vercel에서 환경 변수 추가 후 반드시 재배포해야 합니다
1. Settings → Environment Variables 확인
2. 변수 추가/수정
3. Deployments → ... → Redeploy 클릭
```

#### Q3: Google Calendar 이벤트가 안 보여요
```
A: 다음을 확인하세요:
1. API가 활성화되어 있는지
2. 환경 변수가 올바르게 설정되어 있는지
3. 브라우저 콘솔에서 에러 메시지 확인
4. OAuth 인증이 완료되었는지
```

#### Q4: 도메인을 어떻게 연결하나요?
```
A: Vercel에서 도메인 설정:
1. 도메인 구매 (Namecheap, GoDaddy 등)
2. Vercel → Settings → Domains
3. 구매한 도메인 입력
4. DNS 레코드 설정 (Vercel이 안내해줌)
```

---

## 🎓 단계별 학습 경로

### Level 1: 기본 배포 (지금!)
- ✅ Vercel로 웹에 배포
- ✅ GitHub로 코드 관리
- **소요 시간**: 30분

### Level 2: 구글 인증 추가
- Next-Auth 설정
- Google OAuth 구현
- **소요 시간**: 1-2시간

### Level 3: 완전한 캘린더 연동
- Google Calendar API 완벽 통합
- 양방향 동기화 (블로그 → Google, Google → 블로그)
- **소요 시간**: 3-4시간

### Level 4: 고급 기능
- 사용자 계정 시스템
- 댓글 기능
- 통계 및 분석
- **소요 시간**: 1주일+

---

## 📚 유용한 링크

- **Vercel 공식 문서**: https://vercel.com/docs
- **Next-Auth 가이드**: https://next-auth.js.org/
- **Google Calendar API**: https://developers.google.com/calendar
- **GitHub Desktop**: https://desktop.github.com/

---

## ✅ 체크리스트

### 웹 배포
- [ ] GitHub 계정 만들기
- [ ] GitHub Desktop 설치
- [ ] 코드를 GitHub에 업로드
- [ ] Vercel 계정 만들기
- [ ] Vercel에 프로젝트 배포
- [ ] 배포된 주소로 접속 확인

### 구글 캘린더 연동 (선택)
- [ ] Google Cloud Console 프로젝트 생성
- [ ] Calendar API 활성화
- [ ] OAuth 클라이언트 ID 생성
- [ ] 환경 변수 설정
- [ ] API Route 생성
- [ ] 캘린더 컴포넌트 수정
- [ ] 이벤트 동기화 확인

---

**💡 팁**: 처음에는 **웹 배포만** 하고, 구글 캘린더는 나중에 천천히 추가하는 것을 추천합니다!
