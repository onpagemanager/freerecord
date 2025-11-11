'use client';

import Link from 'next/link';
import {
  ArrowLeft,
  Clock,
  Heart,
  MessageCircle,
  Eye,
  Share2,
  BookOpen,
  Sparkles,
  Users,
  Brain,
  Zap,
  Plug,
  Shield,
} from 'lucide-react';

export default function BlogDetail() {
  // 게시글 메타 정보
  const postMeta = {
    id: 6,
    title: '새로운 기능 업데이트 안내',
    author: '개발팀',
    date: '2024-01-10',
    views: 3200,
    likes: 201,
    comments: 67,
    category: '공지',
    tags: ['업데이트', '새기능', '공지', '개발', '기능개선'],
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className='container py-8'>
      {/* 뒤로가기 버튼 */}
      <div className='mb-6'>
        <Link
          href='/blogs'
          className='inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors'
        >
          <ArrowLeft className='w-4 h-4' />
          <span>블로그 목록으로</span>
        </Link>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className='max-w-4xl mx-auto'>
        {/* 헤더 섹션 */}
        <header className='mb-8'>
          {/* 카테고리 */}
          <div className='mb-4'>
            <span className='inline-block px-3 py-1 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium'>
              {postMeta.category}
            </span>
          </div>

          {/* 제목 */}
          <h1 className='text-3xl sm:text-4xl font-bold mb-6 text-gray-900 dark:text-white leading-tight'>
            {postMeta.title}
          </h1>

          {/* 메타 정보 */}
          <div className='flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 pb-6'>
            {/* 작성자 */}
            <div className='flex items-center gap-2'>
              <span className='font-medium text-gray-700 dark:text-gray-300'>
                {postMeta.author}
              </span>
            </div>

            {/* 날짜 */}
            <div className='flex items-center gap-1'>
              <Clock className='w-4 h-4' />
              <span>{formatDate(postMeta.date)}</span>
            </div>

            {/* 조회수 */}
            <div className='flex items-center gap-1'>
              <Eye className='w-4 h-4' />
              <span>{postMeta.views.toLocaleString()}</span>
            </div>

            {/* 좋아요 */}
            <div className='flex items-center gap-1'>
              <Heart className='w-4 h-4' />
              <span>{postMeta.likes}</span>
            </div>

            {/* 댓글 */}
            <div className='flex items-center gap-1'>
              <MessageCircle className='w-4 h-4' />
              <span>{postMeta.comments}</span>
            </div>

            {/* 공유 버튼 */}
            <button className='ml-auto flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'>
              <Share2 className='w-4 h-4' />
              <span>공유</span>
            </button>
          </div>
        </header>

        {/* 본문 내용 */}
        <article className='prose prose-lg dark:prose-invert max-w-none mb-12'>
          {/* 소개 문단 */}
          <div className='mb-8'>
            <p className='text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
              안녕하세요, 개발팀입니다.
            </p>
            <p className='text-lg text-gray-700 dark:text-gray-300 leading-relaxed'>
              여러분의 소중한 피드백과 제안을 바탕으로 준비한 새로운 업데이트를
              공개하게 되어 기쁩니다. 이번 업데이트는 사용자 경험 개선에 중점을
              두었으며, 여러분이 요청하신 기능들을 대거 포함하고 있습니다. 더욱
              편리하고 강력해진 새로운 기능들을 지금 바로 확인해보세요.
            </p>
          </div>

          {/* 주요 업데이트 내용 */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-2'>
              <Sparkles className='w-6 h-6 text-purple-600 dark:text-purple-400' />
              주요 업데이트 내용
            </h2>

            {/* 1. 향상된 사용자 인터페이스 */}
            <div className='mb-8'>
              <h3 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white'>
                1. 향상된 사용자 인터페이스
              </h3>
              <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
                사용자 여러분의 의견을 반영하여 전체적인 인터페이스를 대폭
                개선했습니다.
              </p>

              <ul className='space-y-3 mb-4'>
                <li className='flex items-start gap-3'>
                  <span className='text-purple-600 dark:text-purple-400 font-bold mt-1'>
                    •
                  </span>
                  <div>
                    <strong className='text-gray-900 dark:text-white'>
                      직관적인 네비게이션:
                    </strong>
                    <span className='text-gray-700 dark:text-gray-300'>
                      {' '}
                      메뉴 구조를 재설계하여 원하는 기능을 더 빠르게 찾을 수
                      있습니다. 자주 사용하는 기능은 상단에 배치하고, 부가
                      기능은 깔끔하게 정리했습니다.
                    </span>
                  </div>
                </li>
                <li className='flex items-start gap-3'>
                  <span className='text-purple-600 dark:text-purple-400 font-bold mt-1'>
                    •
                  </span>
                  <div>
                    <strong className='text-gray-900 dark:text-white'>
                      다크 모드 지원:
                    </strong>
                    <span className='text-gray-700 dark:text-gray-300'>
                      {' '}
                      많은 분들이 요청하신 다크 모드를 드디어 추가했습니다.
                      설정에서 라이트/다크 모드를 선택하거나, 시스템 설정에 따라
                      자동으로 전환되도록 설정할 수 있습니다. 야간 작업 시 눈의
                      피로를 크게 줄일 수 있습니다.
                    </span>
                  </div>
                </li>
                <li className='flex items-start gap-3'>
                  <span className='text-purple-600 dark:text-purple-400 font-bold mt-1'>
                    •
                  </span>
                  <div>
                    <strong className='text-gray-900 dark:text-white'>
                      반응형 디자인 최적화:
                    </strong>
                    <span className='text-gray-700 dark:text-gray-300'>
                      {' '}
                      모바일, 태블릿, 데스크톱 등 모든 기기에서 최적화된 화면을
                      제공합니다. 특히 모바일 환경에서의 사용성이 대폭
                      향상되었습니다.
                    </span>
                  </div>
                </li>
                <li className='flex items-start gap-3'>
                  <span className='text-purple-600 dark:text-purple-400 font-bold mt-1'>
                    •
                  </span>
                  <div>
                    <strong className='text-gray-900 dark:text-white'>
                      커스터마이징 가능한 대시보드:
                    </strong>
                    <span className='text-gray-700 dark:text-gray-300'>
                      {' '}
                      이제 대시보드를 자신의 작업 스타일에 맞게 구성할 수
                      있습니다. 위젯을 추가, 제거, 이동하여 나만의 작업 공간을
                      만들어보세요.
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            {/* 2. 협업 기능 강화 */}
            <div className='mb-8'>
              <h3 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2'>
                <Users className='w-5 h-5 text-blue-500' />
                2. 협업 기능 강화
              </h3>
              <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
                팀 작업의 효율성을 높이기 위한 다양한 협업 도구를 추가했습니다.
              </p>

              <ul className='space-y-3 mb-4'>
                <li className='flex items-start gap-3'>
                  <span className='text-blue-600 dark:text-blue-400 font-bold mt-1'>
                    •
                  </span>
                  <div>
                    <strong className='text-gray-900 dark:text-white'>
                      실시간 공동 편집:
                    </strong>
                    <span className='text-gray-700 dark:text-gray-300'>
                      {' '}
                      여러 사용자가 동시에 같은 문서를 편집할 수 있습니다. 각
                      사용자의 커서 위치와 편집 내용이 실시간으로 표시되어
                      원활한 협업이 가능합니다.
                    </span>
                  </div>
                </li>
                <li className='flex items-start gap-3'>
                  <span className='text-blue-600 dark:text-blue-400 font-bold mt-1'>
                    •
                  </span>
                  <div>
                    <strong className='text-gray-900 dark:text-white'>
                      댓글 및 멘션 기능:
                    </strong>
                    <span className='text-gray-700 dark:text-gray-300'>
                      {' '}
                      문서나 프로젝트 내에서 직접 댓글을 남기고 팀원을 멘션할 수
                      있습니다. @사용자명 형태로 특정 팀원에게 알림을 보낼 수
                      있어 커뮤니케이션이 한결 수월해집니다.
                    </span>
                  </div>
                </li>
                <li className='flex items-start gap-3'>
                  <span className='text-blue-600 dark:text-blue-400 font-bold mt-1'>
                    •
                  </span>
                  <div>
                    <strong className='text-gray-900 dark:text-white'>
                      버전 관리 시스템:
                    </strong>
                    <span className='text-gray-700 dark:text-gray-300'>
                      {' '}
                      모든 변경 사항이 자동으로 저장되며, 언제든지 이전 버전으로
                      되돌릴 수 있습니다. 각 버전마다 변경 내역과 작성자 정보가
                      기록되어 추적이 쉽습니다.
                    </span>
                  </div>
                </li>
                <li className='flex items-start gap-3'>
                  <span className='text-blue-600 dark:text-blue-400 font-bold mt-1'>
                    •
                  </span>
                  <div>
                    <strong className='text-gray-900 dark:text-white'>
                      권한 관리 세분화:
                    </strong>
                    <span className='text-gray-700 dark:text-gray-300'>
                      {' '}
                      프로젝트별, 문서별로 세밀한 권한 설정이 가능합니다. 보기
                      전용, 편집, 관리자 등 다양한 권한 레벨을 설정하여 보안을
                      강화할 수 있습니다.
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            {/* 3. AI 기반 스마트 기능 */}
            <div className='mb-8'>
              <h3 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2'>
                <Brain className='w-5 h-5 text-green-500' />
                3. AI 기반 스마트 기능
              </h3>
              <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
                최신 인공지능 기술을 적용하여 작업 효율을 극대화했습니다.
              </p>

              <ul className='space-y-3 mb-4'>
                <li className='flex items-start gap-3'>
                  <span className='text-green-600 dark:text-green-400 font-bold mt-1'>
                    •
                  </span>
                  <div>
                    <strong className='text-gray-900 dark:text-white'>
                      스마트 자동 완성:
                    </strong>
                    <span className='text-gray-700 dark:text-gray-300'>
                      {' '}
                      입력 패턴을 학습하여 적절한 내용을 자동으로 제안합니다.
                      반복적인 작업 시간을 크게 단축할 수 있습니다.
                    </span>
                  </div>
                </li>
                <li className='flex items-start gap-3'>
                  <span className='text-green-600 dark:text-green-400 font-bold mt-1'>
                    •
                  </span>
                  <div>
                    <strong className='text-gray-900 dark:text-white'>
                      지능형 검색:
                    </strong>
                    <span className='text-gray-700 dark:text-gray-300'>
                      {' '}
                      단순 키워드 검색을 넘어 문맥을 이해하는 검색 기능을
                      제공합니다. 자연어로 질문하면 관련된 문서와 내용을
                      정확하게 찾아줍니다.
                    </span>
                  </div>
                </li>
                <li className='flex items-start gap-3'>
                  <span className='text-green-600 dark:text-green-400 font-bold mt-1'>
                    •
                  </span>
                  <div>
                    <strong className='text-gray-900 dark:text-white'>
                      자동 태그 생성:
                    </strong>
                    <span className='text-gray-700 dark:text-gray-300'>
                      {' '}
                      콘텐츠를 분석하여 적절한 태그를 자동으로 제안합니다.
                      수동으로 태그를 입력하는 번거로움을 줄이고, 일관성 있는
                      분류가 가능합니다.
                    </span>
                  </div>
                </li>
                <li className='flex items-start gap-3'>
                  <span className='text-green-600 dark:text-green-400 font-bold mt-1'>
                    •
                  </span>
                  <div>
                    <strong className='text-gray-900 dark:text-white'>
                      요약 기능:
                    </strong>
                    <span className='text-gray-700 dark:text-gray-300'>
                      {' '}
                      긴 문서를 자동으로 요약하여 핵심 내용을 빠르게 파악할 수
                      있습니다. 회의록이나 보고서 작성 시 특히 유용합니다.
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            {/* 4. 성능 및 안정성 개선 */}
            <div className='mb-8'>
              <h3 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2'>
                <Zap className='w-5 h-5 text-yellow-500' />
                4. 성능 및 안정성 개선
              </h3>
              <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
                사용자 경험의 기본이 되는 성능과 안정성을 대폭 향상시켰습니다.
              </p>

              <div className='space-y-3'>
                <div className='p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-1'>
                    로딩 속도 50% 향상
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    코드 최적화와 캐싱 전략 개선으로 페이지 로딩 속도가 크게
                    빨라졌습니다. 특히 대용량 파일 처리 시 체감 속도가 눈에 띄게
                    개선되었습니다.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-1'>
                    메모리 사용량 감소
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    리소스 관리를 최적화하여 메모리 사용량을 30% 줄였습니다.
                    오래 사용해도 속도 저하 없이 쾌적하게 작업할 수 있습니다.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-1'>
                    오프라인 모드 지원
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    인터넷 연결이 끊어져도 기본적인 작업을 계속할 수 있습니다.
                    작업 내용은 로컬에 저장되며, 연결이 복구되면 자동으로
                    동기화됩니다.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-1'>
                    안정성 강화
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    버그 수정과 예외 처리 개선으로 예기치 않은 오류 발생률을
                    크게 줄였습니다. 자동 저장 기능도 강화하여 데이터 손실
                    위험을 최소화했습니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 5. 통합 및 확장 기능 */}
            <div className='mb-8'>
              <h3 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2'>
                <Plug className='w-5 h-5 text-indigo-500' />
                5. 통합 및 확장 기능
              </h3>
              <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
                다른 도구들과의 연동을 강화하여 워크플로우를 한곳에서 관리할 수
                있습니다.
              </p>

              <ul className='space-y-3 mb-4'>
                <li className='flex items-start gap-3'>
                  <span className='text-indigo-600 dark:text-indigo-400 font-bold mt-1'>
                    •
                  </span>
                  <div>
                    <strong className='text-gray-900 dark:text-white'>
                      서드파티 앱 연동:
                    </strong>
                    <span className='text-gray-700 dark:text-gray-300'>
                      {' '}
                      Slack, Notion, Trello, Google Drive 등 주요 생산성
                      도구들과 직접 연동됩니다. API 키만 입력하면 간편하게
                      연결할 수 있습니다.
                    </span>
                  </div>
                </li>
                <li className='flex items-start gap-3'>
                  <span className='text-indigo-600 dark:text-indigo-400 font-bold mt-1'>
                    •
                  </span>
                  <div>
                    <strong className='text-gray-900 dark:text-white'>
                      Webhook 지원:
                    </strong>
                    <span className='text-gray-700 dark:text-gray-300'>
                      {' '}
                      특정 이벤트 발생 시 외부 시스템으로 자동 알림을 보낼 수
                      있습니다. 자동화 워크플로우 구축이 가능합니다.
                    </span>
                  </div>
                </li>
                <li className='flex items-start gap-3'>
                  <span className='text-indigo-600 dark:text-indigo-400 font-bold mt-1'>
                    •
                  </span>
                  <div>
                    <strong className='text-gray-900 dark:text-white'>
                      플러그인 마켓플레이스:
                    </strong>
                    <span className='text-gray-700 dark:text-gray-300'>
                      {' '}
                      커뮤니티에서 제작한 다양한 플러그인을 설치할 수 있습니다.
                      필요한 기능을 선택적으로 추가하여 나만의 환경을
                      구성하세요.
                    </span>
                  </div>
                </li>
                <li className='flex items-start gap-3'>
                  <span className='text-indigo-600 dark:text-indigo-400 font-bold mt-1'>
                    •
                  </span>
                  <div>
                    <strong className='text-gray-900 dark:text-white'>
                      내보내기 옵션 확대:
                    </strong>
                    <span className='text-gray-700 dark:text-gray-300'>
                      {' '}
                      PDF, Excel, CSV, JSON 등 다양한 포맷으로 데이터를 내보낼
                      수 있습니다. 외부 시스템과의 데이터 교환이 더욱
                      쉬워졌습니다.
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            {/* 6. 보안 강화 */}
            <div className='mb-8'>
              <h3 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2'>
                <Shield className='w-5 h-5 text-red-500' />
                6. 보안 강화
              </h3>
              <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
                사용자 데이터의 안전을 최우선으로 생각합니다.
              </p>

              <ul className='space-y-3 mb-4'>
                <li className='flex items-start gap-3'>
                  <span className='text-red-600 dark:text-red-400 font-bold mt-1'>
                    •
                  </span>
                  <div>
                    <strong className='text-gray-900 dark:text-white'>
                      2단계 인증:
                    </strong>
                    <span className='text-gray-700 dark:text-gray-300'>
                      {' '}
                      이메일/SMS 기반 2단계 인증을 지원하여 계정 보안을
                      강화했습니다. 인증 앱(Google Authenticator, Authy 등)도
                      사용 가능합니다.
                    </span>
                  </div>
                </li>
                <li className='flex items-start gap-3'>
                  <span className='text-red-600 dark:text-red-400 font-bold mt-1'>
                    •
                  </span>
                  <div>
                    <strong className='text-gray-900 dark:text-white'>
                      종단간 암호화:
                    </strong>
                    <span className='text-gray-700 dark:text-gray-300'>
                      {' '}
                      민감한 데이터는 전송과 저장 과정에서 모두 암호화됩니다.
                      서버 관리자도 내용을 확인할 수 없는 수준의 보안을
                      제공합니다.
                    </span>
                  </div>
                </li>
                <li className='flex items-start gap-3'>
                  <span className='text-red-600 dark:text-red-400 font-bold mt-1'>
                    •
                  </span>
                  <div>
                    <strong className='text-gray-900 dark:text-white'>
                      활동 로그:
                    </strong>
                    <span className='text-gray-700 dark:text-gray-300'>
                      {' '}
                      계정의 모든 접속 및 활동 기록을 확인할 수 있습니다.
                      의심스러운 활동이 감지되면 즉시 알림을 받을 수 있습니다.
                    </span>
                  </div>
                </li>
                <li className='flex items-start gap-3'>
                  <span className='text-red-600 dark:text-red-400 font-bold mt-1'>
                    •
                  </span>
                  <div>
                    <strong className='text-gray-900 dark:text-white'>
                      세션 관리:
                    </strong>
                    <span className='text-gray-700 dark:text-gray-300'>
                      {' '}
                      현재 로그인된 모든 디바이스를 확인하고, 원격으로
                      로그아웃할 수 있습니다.
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* 소소하지만 유용한 개선 사항 */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white'>
              소소하지만 유용한 개선 사항
            </h2>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
              큰 기능 외에도 사용 편의성을 높이는 다양한 개선이 이루어졌습니다.
            </p>

            <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
              <div className='p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                <p className='text-sm text-gray-700 dark:text-gray-300'>
                  키보드 단축키 커스터마이징 기능 추가
                </p>
              </div>
              <div className='p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                <p className='text-sm text-gray-700 dark:text-gray-300'>
                  드래그 앤 드롭으로 파일 업로드 가능
                </p>
              </div>
              <div className='p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                <p className='text-sm text-gray-700 dark:text-gray-300'>
                  되돌리기/다시 실행 기능 강화 (최대 100단계)
                </p>
              </div>
              <div className='p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                <p className='text-sm text-gray-700 dark:text-gray-300'>
                  알림 설정 세분화 (항목별 on/off 가능)
                </p>
              </div>
              <div className='p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                <p className='text-sm text-gray-700 dark:text-gray-300'>
                  즐겨찾기 및 최근 사용 항목 빠른 접근
                </p>
              </div>
              <div className='p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                <p className='text-sm text-gray-700 dark:text-gray-300'>
                  다국어 지원 확대 (15개 언어 추가)
                </p>
              </div>
              <div className='p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                <p className='text-sm text-gray-700 dark:text-gray-300'>
                  접근성 개선 (스크린 리더 지원, 고대비 모드)
                </p>
              </div>
              <div className='p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                <p className='text-sm text-gray-700 dark:text-gray-300'>
                  튜토리얼 및 도움말 컨텐츠 업데이트
                </p>
              </div>
            </div>
          </section>

          {/* 업데이트 적용 방법 */}
          <section className='mb-10 p-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'>
            <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white'>
              업데이트 적용 방법
            </h2>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
              이번 업데이트는 자동으로 적용됩니다. 별도의 설치나 다운로드가 필요
              없으며, 웹 브라우저를 새로고침하거나 앱을 재시작하면 새로운 버전이
              적용됩니다.
            </p>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
              모바일 앱 사용자의 경우 앱스토어나 플레이스토어에서 업데이트를
              진행해주시기 바랍니다. 일부 기능은 최신 버전에서만 사용
              가능합니다.
            </p>
          </section>

          {/* 문제 해결 및 피드백 */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white'>
              문제 해결 및 피드백
            </h2>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
              업데이트 후 문제가 발생하거나 궁금한 점이 있으시면 언제든지
              고객지원팀으로 연락해주세요. 이메일(support@example.com), 라이브
              채팅, 또는 앱 내 피드백 기능을 통해 문의하실 수 있습니다.
            </p>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
              여러분의 의견은 서비스 개선에 큰 도움이 됩니다. 새로운 기능에 대한
              제안이나 개선이 필요한 부분이 있다면 주저하지 말고 알려주세요.
              모든 피드백을 꼼꼼히 검토하여 다음 업데이트에 반영하겠습니다.
            </p>
          </section>

          {/* 앞으로의 계획 */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white'>
              앞으로의 계획
            </h2>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
              이번 업데이트는 끝이 아닌 시작입니다. 앞으로도 지속적으로 새로운
              기능을 추가하고 기존 기능을 개선해 나갈 계획입니다.
            </p>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
              다음 분기에는 다음과 같은 기능들이 추가될 예정입니다:
            </p>

            <ul className='space-y-2 mb-4'>
              <li className='flex items-start gap-3'>
                <span className='text-purple-600 dark:text-purple-400 font-bold mt-1'>
                  •
                </span>
                <span className='text-gray-700 dark:text-gray-300'>
                  모바일 앱 성능 최적화
                </span>
              </li>
              <li className='flex items-start gap-3'>
                <span className='text-purple-600 dark:text-purple-400 font-bold mt-1'>
                  •
                </span>
                <span className='text-gray-700 dark:text-gray-300'>
                  고급 분석 및 리포팅 도구
                </span>
              </li>
              <li className='flex items-start gap-3'>
                <span className='text-purple-600 dark:text-purple-400 font-bold mt-1'>
                  •
                </span>
                <span className='text-gray-700 dark:text-gray-300'>
                  템플릿 마켓플레이스 오픈
                </span>
              </li>
              <li className='flex items-start gap-3'>
                <span className='text-purple-600 dark:text-purple-400 font-bold mt-1'>
                  •
                </span>
                <span className='text-gray-700 dark:text-gray-300'>
                  음성 명령 기능
                </span>
              </li>
              <li className='flex items-start gap-3'>
                <span className='text-purple-600 dark:text-purple-400 font-bold mt-1'>
                  •
                </span>
                <span className='text-gray-700 dark:text-gray-300'>
                  화상 회의 통합
                </span>
              </li>
            </ul>

            <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
              자세한 로드맵은 홈페이지의 제품 업데이트 페이지에서 확인하실 수
              있습니다.
            </p>
          </section>

          {/* 감사의 말씀 */}
          <section className='mb-10 p-6 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800'>
            <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white'>
              감사의 말씀
            </h2>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
              이번 업데이트는 여러분의 적극적인 피드백과 제안 덕분에 완성될 수
              있었습니다. 베타 테스트에 참여해주신 분들, 버그 리포트를 보내주신
              분들, 그리고 항상 응원해주시는 모든 사용자 분들께 진심으로
              감사드립니다.
            </p>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
              앞으로도 더 나은 서비스를 제공하기 위해 최선을 다하겠습니다.
              새로운 기능들을 활용하여 더욱 생산적이고 즐거운 경험을 하시길
              바랍니다.
            </p>
            <p className='text-lg font-semibold text-gray-900 dark:text-white'>
              업데이트를 즐겨주세요!
            </p>
            <p className='text-gray-700 dark:text-gray-300 mt-2'>개발팀 드림</p>
          </section>
        </article>

        {/* 태그 섹션 */}
        <div className='mb-8 pt-6 border-t border-gray-200 dark:border-gray-800'>
          <div className='flex flex-wrap gap-2'>
            {postMeta.tags.map((tag, index) => (
              <span
                key={index}
                className='px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer'
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className='flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200 dark:border-gray-800'>
          <div className='flex items-center gap-4'>
            <button className='flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300'>
              <Heart className='w-4 h-4' />
              <span>좋아요 {postMeta.likes}</span>
            </button>
            <button className='flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300'>
              <Share2 className='w-4 h-4' />
              <span>공유</span>
            </button>
          </div>
          <Link
            href='/blogs'
            className='flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 dark:bg-purple-500 text-white hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors'
          >
            <BookOpen className='w-4 h-4' />
            <span>다른 글 보기</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
