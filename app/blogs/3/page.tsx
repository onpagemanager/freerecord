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
  Mic,
  Settings,
  Monitor,
  Shield,
  Volume2,
} from 'lucide-react';

export default function BlogDetail() {
  // 게시글 메타 정보
  const postMeta = {
    id: 2,
    title: '고품질 녹음을 위한 마이크 설정 가이드',
    author: '녹음전문가',
    date: '2024-01-14',
    views: 980,
    likes: 67,
    comments: 15,
    category: '가이드',
    tags: ['녹음', '마이크', '설정', '음질', '팟캐스트', '유튜브'],
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
              좋은 콘텐츠를 만들기 위해서는 훌륭한 아이디어와 기획도 중요하지만,
              그것을 담아내는 기술적 요소 역시 무시할 수 없습니다. 특히
              팟캐스트, 유튜브, 온라인 강의 등 음성이 중요한 콘텐츠를 제작한다면
              마이크 설정은 성공의 절반이라고 해도 과언이 아닙니다. 오늘은
              브라우저에서 고품질 녹음을 하기 위한 마이크 설정 방법을 단계별로
              상세히 안내해드리겠습니다.
            </p>
          </div>

          {/* 왜 마이크 설정이 중요한가요? */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2'>
              <Mic className='w-6 h-6 text-purple-600 dark:text-purple-400' />왜
              마이크 설정이 중요한가요?
            </h2>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
              많은 초보 크리에이터들이 콘텐츠 내용에만 집중하고 음질은 소홀히
              하는 경향이 있습니다. 하지만 아무리 좋은 내용이라도 음질이 나쁘면
              시청자는 몇 분 만에 이탈하게 됩니다.
            </p>

            <ul className='space-y-3 mb-6'>
              <li className='flex items-start gap-3'>
                <span className='text-purple-600 dark:text-purple-400 font-bold mt-1'>
                  •
                </span>
                <div>
                  <strong className='text-gray-900 dark:text-white'>
                    첫인상 결정:
                  </strong>
                  <span className='text-gray-700 dark:text-gray-300'>
                    {' '}
                    영상이나 오디오를 재생했을 때 가장 먼저 느껴지는 것이 바로
                    음질입니다. 깨끗하고 명료한 음질은 전문성과 신뢰감을 줍니다.
                  </span>
                </div>
              </li>
              <li className='flex items-start gap-3'>
                <span className='text-purple-600 dark:text-purple-400 font-bold mt-1'>
                  •
                </span>
                <div>
                  <strong className='text-gray-900 dark:text-white'>
                    청취 피로도 감소:
                  </strong>
                  <span className='text-gray-700 dark:text-gray-300'>
                    {' '}
                    부정확한 마이크 설정으로 인한 노이즈, 왜곡, 불균형한 음량은
                    청취자에게 큰 피로를 줍니다. 올바른 설정만으로도 이런 문제의
                    대부분을 해결할 수 있습니다.
                  </span>
                </div>
              </li>
              <li className='flex items-start gap-3'>
                <span className='text-purple-600 dark:text-purple-400 font-bold mt-1'>
                  •
                </span>
                <div>
                  <strong className='text-gray-900 dark:text-white'>
                    후반 작업 시간 단축:
                  </strong>
                  <span className='text-gray-700 dark:text-gray-300'>
                    {' '}
                    녹음 단계에서 최적의 설정을 해두면 편집 과정에서 노이즈
                    제거나 음량 조절에 들이는 시간을 크게 줄일 수 있습니다.
                  </span>
                </div>
              </li>
              <li className='flex items-start gap-3'>
                <span className='text-purple-600 dark:text-purple-400 font-bold mt-1'>
                  •
                </span>
                <div>
                  <strong className='text-gray-900 dark:text-white'>
                    일관된 품질 유지:
                  </strong>
                  <span className='text-gray-700 dark:text-gray-300'>
                    {' '}
                    한 번 제대로 설정해두면 매번 같은 품질의 녹음을 할 수 있어,
                    콘텐츠의 일관성이 높아집니다.
                  </span>
                </div>
              </li>
            </ul>
          </section>

          {/* 마이크 선택의 기본 */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2'>
              <Settings className='w-6 h-6 text-blue-600 dark:text-blue-400' />
              마이크 선택의 기본
            </h2>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
              본격적인 설정에 앞서, 자신에게 맞는 마이크를 선택하는 것이
              중요합니다.
            </p>

            {/* 마이크 종류별 특징 */}
            <div className='mb-6'>
              <h3 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white'>
                마이크 종류별 특징
              </h3>

              <div className='space-y-4'>
                <div className='p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    USB 마이크
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                    초보자에게 가장 추천하는 옵션입니다. 컴퓨터에 USB로 직접
                    연결하며, 별도의 오디오 인터페이스가 필요 없습니다. Blue
                    Yeti, Audio-Technica AT2020USB+ 등이 대표적입니다. 가격대비
                    좋은 음질을 제공하며 설정이 간단합니다.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    XLR 마이크
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                    전문가용 마이크로, 오디오 인터페이스가 필요합니다. 더 높은
                    음질과 유연한 설정이 가능하지만, 초기 비용이 높고 설정이
                    복잡합니다. Shure SM7B, Rode Procaster 등이 유명합니다.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    콘덴서 vs 다이나믹
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                    콘덴서 마이크는 민감하고 섬세한 소리를 잘 잡지만 주변 소음도
                    함께 녹음됩니다. 다이나믹 마이크는 덜 민감하지만 방음이 잘
                    안 되는 환경에서 유리합니다.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    지향성
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    단일 지향성(Cardioid)은 정면 소리만 잡아 대부분의 용도에
                    적합합니다. 양방향(Bidirectional)은 인터뷰에,
                    무지향성(Omnidirectional)은 환경음 녹음에 좋습니다.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 브라우저에서 마이크 설정하기 */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2'>
              <Monitor className='w-6 h-6 text-indigo-600 dark:text-indigo-400' />
              브라우저에서 마이크 설정하기
            </h2>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
              온라인 녹음 도구나 화상 회의를 사용할 때는 브라우저에서 직접
              마이크를 설정해야 합니다.
            </p>

            {/* 1단계: 시스템 설정 확인 */}
            <div className='mb-6'>
              <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-white'>
                1단계: 시스템 설정 확인
              </h3>
              <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
                브라우저 설정 전에 먼저 컴퓨터의 시스템 설정을 점검해야 합니다.
              </p>

              <div className='space-y-3'>
                <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    Windows 사용자
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    설정 &gt; 시스템 &gt; 소리로 이동합니다. '입력' 섹션에서
                    사용할 마이크를 기본 장치로 설정하세요. '장치 속성'을
                    클릭하여 입력 볼륨을 조절할 수 있습니다. 보통 70-80% 정도가
                    적당합니다.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    Mac 사용자
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    시스템 환경설정 &gt; 사운드 &gt; 입력 탭으로 이동합니다.
                    사용할 마이크를 선택하고 입력 레벨을 조정합니다. 테스트
                    음성을 내며 입력 레벨 표시줄이 중간 정도 올라가는지
                    확인하세요.
                  </p>
                </div>
              </div>
            </div>

            {/* 2단계: 브라우저 권한 설정 */}
            <div className='mb-6'>
              <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-white'>
                2단계: 브라우저 권한 설정
              </h3>
              <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
                브라우저가 마이크에 접근할 수 있도록 권한을 부여해야 합니다.
              </p>

              <div className='space-y-3'>
                <div className='p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    Chrome
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    설정 &gt; 개인정보 보호 및 보안 &gt; 사이트 설정 &gt;
                    마이크로 이동합니다. 마이크 사용을 허용하고, 필요한 사이트를
                    예외 목록에 추가합니다. 주소창 왼쪽의 자물쇠 아이콘을
                    클릭해서도 빠르게 설정할 수 있습니다.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    Firefox
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    설정 &gt; 개인정보 및 보안 &gt; 권한 &gt; 마이크에서
                    설정합니다. 특정 사이트가 마이크 접근을 요청하면 '허용'을
                    선택하세요.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    Safari
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    환경설정 &gt; 웹사이트 &gt; 마이크에서 웹사이트별로 권한을
                    관리할 수 있습니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 3단계: 올바른 입력 장치 선택 */}
            <div className='mb-6'>
              <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-white'>
                3단계: 올바른 입력 장치 선택
              </h3>
              <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
                브라우저에서 녹음을 시작하면 입력 장치를 선택하는 팝업이
                나타납니다.
              </p>
              <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
                컴퓨터에 여러 개의 마이크가 연결되어 있을 수 있습니다. 내장
                마이크, 웹캠 마이크, 외장 USB 마이크 등이 동시에 표시될 수
                있으므로 정확히 확인해야 합니다. 보통 외장 마이크는 제품명이
                표시되므로 쉽게 구별할 수 있습니다.
              </p>
              <div className='p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  <strong className='text-gray-900 dark:text-white'>팁:</strong>{' '}
                  선택 후에는 반드시 테스트 녹음을 해보세요. 목소리가 제대로
                  들리는지, 다른 소음은 없는지 확인하는 과정이 필수입니다.
                </p>
              </div>
            </div>
          </section>

          {/* 환경 설정과 최적화 */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2'>
              <Volume2 className='w-6 h-6 text-green-600 dark:text-green-400' />
              환경 설정과 최적화
            </h2>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
              마이크 자체의 설정도 중요하지만, 녹음 환경 역시 음질에 큰 영향을
              미칩니다.
            </p>

            {/* 물리적 환경 개선 */}
            <div className='mb-6'>
              <h3 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white'>
                물리적 환경 개선
              </h3>

              <div className='space-y-4'>
                <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    마이크 위치
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    입에서 15-20cm 정도 떨어진 위치가 이상적입니다. 너무
                    가까우면 파열음(ㅂ, ㅍ 발음 시 발생하는 바람 소리)이
                    심해지고, 너무 멀면 음량이 작아집니다.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    각도 조절
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    마이크를 정면이 아닌 약간 아래나 옆에서 향하게 하면 파열음을
                    줄일 수 있습니다. 많은 전문가들이 마이크를 입보다 약간 높게
                    설치하고 아래로 향하게 합니다.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    팝 필터 사용
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    5천 원에서 2만 원 정도로 구입할 수 있는 팝 필터는 파열음을
                    효과적으로 차단합니다. 없다면 천 손수건을 마이크 앞에
                    고정하는 것도 임시 방편이 될 수 있습니다.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    방음 처리
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    완벽한 방음실이 아니어도 괜찮습니다. 벽에 두꺼운 커튼을
                    치거나, 책장으로 공간을 구분하거나, 옷장 안에서 녹음하는
                    것만으로도 상당한 효과가 있습니다. 울림을 줄이는 것이
                    핵심입니다.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 마무리 */}
          <section className='mb-10 p-6 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800'>
            <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white'>
              마무리
            </h2>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
              마이크 설정은 한 번 제대로 해두면 계속해서 좋은 음질의 녹음을 할
              수 있는 투자입니다. 처음에는 복잡해 보일 수 있지만, 위의 단계를
              차근차근 따라하다 보면 금방 익숙해질 것입니다.
            </p>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
              가장 중요한 것은 실제로 녹음을 해보고 들어보는 것입니다. 설정을
              변경할 때마다 테스트 녹음을 통해 음질을 확인하고, 자신의 환경에
              맞는 최적의 설정을 찾아보세요. 좋은 음질은 여러분의 콘텐츠를 더욱
              전문적이고 신뢰할 수 있게 만들어줄 것입니다.
            </p>
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
