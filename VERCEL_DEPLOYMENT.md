# 🚀 Next.js + Vercel 배포 가이드 (초보자용)

## ✅ 완료된 작업
- [x] Git 저장소 초기화
- [x] 첫 커밋 완료

## 📝 다음 단계

### Step 1: GitHub에 저장소 만들기

#### 방법 A: GitHub 웹사이트에서 (추천)

1. **GitHub.com 접속**
   - https://github.com 으로 이동
   - 로그인 (계정이 없다면 회원가입)

2. **새 저장소 만들기**
   ```
   우측 상단 "+" 버튼 클릭
   → "New repository" 선택
   
   설정:
   - Repository name: blog-auto-dowon (또는 원하는 이름)
   - Description: My Next.js Blog with Calendar
   - Public 선택 (무료로 Vercel 배포하려면 Public 필요)
   - "Add a README file" 체크 해제 (이미 있음)
   - "Create repository" 클릭
   ```

3. **원격 저장소 연결**
   
   GitHub 페이지에 나타나는 명령어를 복사하세요:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/blog-auto-dowon.git
   git branch -M main
   git push -u origin main
   ```

   **PowerShell에서 실행:**
   ```powershell
   cd d:\vibe\antigravity\blog_auto_dowon
   
   # GitHub 주소로 변경하세요!
   git remote add origin https://github.com/YOUR_USERNAME/blog-auto-dowon.git
   git branch -M main
   git push -u origin main
   ```

   **인증이 필요하면:**
   - GitHub 사용자 이름 입력
   - Personal Access Token 사용 (비밀번호 대신)
   - Token 만들기: GitHub Settings → Developer settings → Personal access tokens → Generate new token

#### 방법 B: GitHub CLI 사용 (고급)

```bash
# GitHub CLI 설치 (https://cli.github.com/)
gh auth login
gh repo create blog-auto-dowon --public --source=. --remote=origin --push
```

---

### Step 2: Vercel에 배포

#### 2-1. Vercel 계정 만들기

1. **Vercel 접속**
   - https://vercel.com 으로 이동

2. **GitHub로 회원가입**
   ```
   "Sign Up" 클릭
   → "Continue with GitHub" 선택
   → GitHub 계정으로 로그인
   → Vercel 권한 승인
   ```

#### 2-2. 프로젝트 배포

1. **새 프로젝트 임포트**
   ```
   Vercel 대시보드에서:
   - "Add New..." 버튼 클릭
   - "Project" 선택
   ```

2. **GitHub 저장소 연결**
   ```
   - "Import Git Repository" 섹션에서
   - 방금 만든 "blog-auto-dowon" 저장소 찾기
   - "Import" 버튼 클릭
   ```

3. **프로젝트 설정 확인**
   ```
   Framework Preset: Next.js (자동 감지됨)
   
   Build Settings:
   - Build Command: npm run build
   - Output Directory: .next
   - Install Command: npm install
   (모두 자동으로 설정됨)
   
   그대로 "Deploy" 버튼 클릭!
   ```

4. **배포 진행**
   ```
   - 빌드 로그를 실시간으로 볼 수 있음
   - 약 2-3분 소요
   - "Congratulations!" 메시지가 나오면 완료!
   ```

5. **배포된 사이트 확인**
   ```
   자동으로 생성된 URL:
   https://blog-auto-dowon-xxx.vercel.app
   
   이 주소를 클릭해서 블로그 확인!
   ```

---

### Step 3: 자동 업데이트 설정

**한 번 배포하면, 이후엔 자동!**

#### 로컬에서 변경사항 푸시:

```powershell
cd d:\vibe\antigravity\blog_auto_dowon

# 새 글 작성 또는 수정 후...

git add .
git commit -m "새 글 추가: 영어 회화 팁"
git push origin main
```

#### Vercel이 자동으로:
- GitHub에 push할 때마다 자동 배포 시작
- 약 2분 후 웹사이트에 변경사항 반영
- 배포 상태를 Vercel 대시보드에서 확인 가능

---

## 🎯 빠른 명령어 정리

### 매번 글을 작성한 후:

```bash
# 1. 빌드 테스트 (로컬)
npm run build
npm start
# http://localhost:3000 에서 확인

# 2. Git에 커밋
git add .
git commit -m "설명 메시지"
git push origin main

# 3. Vercel이 자동으로 배포! (2분 대기)
```

---

## 🔧 문제 해결

### Q1: `git push` 시 인증 오류

**문제:**
```
remote: Support for password authentication was removed
```

**해결:**
1. GitHub에서 Personal Access Token 생성:
   - GitHub → Settings → Developer settings
   - Personal access tokens → Tokens (classic)
   - "Generate new token (classic)"
   - 권한: `repo` 체크
   - Token 복사 (한 번만 보임!)

2. Git 인증 정보 저장:
   ```bash
   git remote set-url origin https://YOUR_TOKEN@github.com/YOUR_USERNAME/blog-auto-dowon.git
   ```

### Q2: Vercel 빌드 실패

**확인사항:**
1. Vercel 대시보드 → 프로젝트 → Deployments → Failed 클릭
2. Build Logs 확인
3. 로컬에서 `npm run build`가 성공하는지 확인

**자주 발생하는 오류:**
- Node.js 버전 문제 → `package.json`에 engines 추가:
  ```json
  "engines": {
    "node": ">=18.0.0"
  }
  ```

### Q3: 배포는 됐는데 스타일이 안 보여요

**해결:**
- Hard refresh: `Ctrl + Shift + R` (Windows)
- 브라우저 캐시 삭제
- 시크릿 모드에서 확인

---

## 🌟 추가 설정 (선택사항)

### 커스텀 도메인 연결

```
Vercel 대시보드 → 프로젝트 선택
→ Settings → Domains
→ "Add" 버튼 클릭
→ 원하는 도메인 입력 (예: myblog.com)
```

**도메인 구매:**
- Namecheap: https://www.namecheap.com
- GoDaddy: https://www.godaddy.com
- 연간 약 $10-15

### 환경 변수 설정

```
Vercel 대시보드 → 프로젝트 선택
→ Settings → Environment Variables
→ 필요한 변수 추가

예:
- NEXT_PUBLIC_SITE_URL = https://your-blog.vercel.app
```

---

## ✅ 배포 체크리스트

- [ ] GitHub 계정 생성
- [ ] GitHub에 저장소 생성
- [ ] 로컬 Git과 GitHub 연결
- [ ] 코드를 GitHub에 Push
- [ ] Vercel 계정 생성 (GitHub 연동)
- [ ] Vercel에서 프로젝트 Import
- [ ] 배포 완료 확인
- [ ] 생성된 URL로 접속 테스트

---

## 🎉 다음 단계

### 1. Supabase 추가 (선택)

현재는 파일 기반 블로그입니다. Supabase를 추가하면:
- 블로그 포스트를 데이터베이스에 저장
- 캘린더 이벤트를 DB에 저장
- 사용자 인증 추가 가능
- 댓글 기능 추가 가능

**Supabase 가이드는 배포 완료 후 말씀하시면 작성해드리겠습니다!**

### 2. Google Analytics 추가

방문자 통계 확인:
```bash
npm install @next/third-parties
```

### 3. SEO 최적화

- sitemap.xml 생성
- robots.txt 설정
- Open Graph 메타 태그 추가

---

**💡 팁:** 
- 처음엔 배포만 하고, 기능은 천천히 추가하세요!
- 문제가 생기면 Vercel Build Logs를 먼저 확인하세요!
- GitHub Issues에 질문하면 커뮤니티가 도와줍니다!

**질문이 있으시면 언제든지 말씀해주세요! 🚀**
