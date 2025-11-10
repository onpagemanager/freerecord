# 구글 서치 등록 가이드

이 문서는 Freerecord 사이트를 구글 서치 콘솔에 등록하고 인덱싱하는 방법을 안내합니다.

## 1. Sitemap 확인

배포 후 다음 URL에서 sitemap이 제대로 생성되는지 확인하세요:

```
https://your-domain.com/sitemap.xml
```

또는 로컬 개발 환경에서:

```
http://localhost:3000/sitemap.xml
```

## 2. Robots.txt 확인

다음 URL에서 robots.txt가 제대로 생성되는지 확인하세요:

```
https://your-domain.com/robots.txt
```

또는 로컬 개발 환경에서:

```
http://localhost:3000/robots.txt
```

## 3. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음을 추가하세요:

```env
NEXT_PUBLIC_SITE_URL=https://your-actual-domain.com
```

**중요**: 실제 도메인으로 변경해야 합니다. 예: `https://freerecord.com`

## 4. 구글 서치 콘솔 등록

### 4.1 구글 서치 콘솔 접속

1. [Google Search Console](https://search.google.com/search-console)에 접속
2. Google 계정으로 로그인

### 4.2 속성 추가

1. "속성 추가" 버튼 클릭
2. "URL 접두어" 선택
3. 사이트 URL 입력 (예: `https://freerecord.com`)
4. "계속" 클릭

### 4.3 소유권 확인

구글에서 제공하는 방법 중 하나를 선택하여 소유권을 확인하세요:

**방법 1: HTML 파일 업로드 (권장)**

- 구글이 제공하는 HTML 파일을 다운로드
- `public/` 폴더에 업로드
- 사이트에 배포
- 구글 서치 콘솔에서 "확인" 클릭

**방법 2: HTML 태그 추가**

- 구글이 제공하는 메타 태그를 복사
- `app/layout.tsx`의 `<head>` 섹션에 추가

**방법 3: Google Analytics 연동**

- Google Analytics가 이미 설정되어 있다면 자동으로 확인 가능

### 4.4 Sitemap 제출

1. 구글 서치 콘솔 좌측 메뉴에서 "Sitemaps" 클릭
2. "새 사이트맵 추가" 클릭
3. `sitemap.xml` 입력
4. "제출" 클릭

## 5. 인덱싱 요청 (선택사항)

### 5.1 URL 검사 도구 사용

1. 구글 서치 콘솔에서 "URL 검사" 도구 사용
2. 각 주요 페이지 URL 입력
3. "색인 생성 요청" 클릭

### 5.2 주요 페이지 인덱싱 요청

다음 페이지들을 우선적으로 인덱싱 요청하세요:

- `/` (홈페이지)
- `/record` (녹음기)
- `/voice-changer` (음성변조)
- `/change-speed` (속도변경)
- `/change-pitch` (음정변경)
- `/change-volume` (음량변경)

## 6. 확인 사항

### 6.1 Sitemap 상태 확인

- 구글 서치 콘솔 > Sitemaps에서 상태 확인
- "성공" 상태가 되면 정상적으로 제출된 것입니다
- 오류가 있다면 오류 메시지를 확인하고 수정하세요

### 6.2 인덱싱 상태 확인

- 구글 서치 콘솔 > 색인 > 페이지에서 인덱싱된 페이지 수 확인
- 일반적으로 몇 시간에서 며칠이 소요될 수 있습니다

### 6.3 검색 결과 확인

구글에서 다음 검색어로 사이트가 검색되는지 확인:

```
site:your-domain.com
```

## 7. 추가 최적화

### 7.1 구조화된 데이터 확인

구글 서치 콘솔 > 향상된 결과 > 구조화된 데이터에서 오류 확인

### 7.2 모바일 사용성 확인

구글 서치 콘솔 > 모바일 사용성에서 모바일 친화성 확인

### 7.3 Core Web Vitals 확인

구글 서치 콘솔 > Core Web Vitals에서 페이지 성능 확인

## 8. 문제 해결

### Sitemap이 표시되지 않는 경우

1. `NEXT_PUBLIC_SITE_URL` 환경 변수가 올바르게 설정되었는지 확인
2. 배포 후 실제 도메인에서 sitemap.xml에 접근 가능한지 확인
3. Next.js 빌드가 성공적으로 완료되었는지 확인

### 인덱싱이 되지 않는 경우

1. robots.txt에서 페이지가 차단되지 않았는지 확인
2. 페이지가 noindex 태그를 포함하지 않는지 확인
3. 페이지가 로그인이 필요한지 확인 (공개 페이지여야 함)
4. 콘텐츠가 충분한지 확인 (최소 300자 권장)

## 9. 참고 자료

- [Google Search Console 도움말](https://support.google.com/webmasters)
- [Sitemap 가이드](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview)
- [Next.js Metadata 문서](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
