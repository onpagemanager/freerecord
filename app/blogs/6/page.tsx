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
  Sliders,
  Radio,
  Music,
  Mic,
  Zap,
} from 'lucide-react';

export default function BlogDetail() {
  // 게시글 메타 정보
  const postMeta = {
    id: 6,
    title: '이퀄라이저로 음질 개선하기',
    author: '오디오마스터',
    date: '2024-01-25',
    views: 2890,
    likes: 203,
    comments: 58,
    category: '튜토리얼',
    tags: [
      '이퀄라이저',
      'EQ',
      '오디오편집',
      '음질개선',
      '믹싱',
      '마스터링',
      'DAW',
      '오디오기초',
    ],
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
              오디오 편집에서 가장 강력하면서도 섬세한 도구 중 하나가 바로
              이퀄라이저(Equalizer, EQ)입니다. 이퀄라이저는 특정 주파수 대역의
              음량을 조절하여 음질을 개선하고, 원하는 사운드를 만들어내는 필수
              도구입니다.
            </p>
            <p className='text-lg text-gray-700 dark:text-gray-300 leading-relaxed'>
              겉보기에는 복잡해 보이지만, 기본 원리를 이해하면 누구나 전문가처럼
              음질을 향상시킬 수 있습니다. 오늘은 이퀄라이저를 활용하여 음질을
              개선하고 원하는 사운드를 만드는 방법을 상세히 설명해드리겠습니다.
            </p>
          </div>

          {/* 이퀄라이저란 무엇인가 */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2'>
              <Sliders className='w-6 h-6 text-purple-600 dark:text-purple-400' />
              이퀄라이저란 무엇인가?
            </h2>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
              이퀄라이저는 오디오 신호의 주파수 스펙트럼을 조절하는 도구입니다.
              쉽게 말해 소리의 저음, 중음, 고음을 각각 조절할 수 있는 장치라고
              생각하면 됩니다.
            </p>

            <div className='space-y-4'>
              <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  주파수의 이해
                </h3>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  사람이 들을 수 있는 소리는 대략 20Hz에서 20,000Hz(20kHz)
                  사이입니다. 낮은 주파수는 저음(베이스, 킥드럼), 중간 주파수는
                  중음(보컬, 기타), 높은 주파수는 고음(심벌, 하이햇)에
                  해당합니다.
                </p>
              </div>

              <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  왜 필요한가
                </h3>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  녹음 환경, 마이크 특성, 공간의 음향 특성 등으로 인해 특정
                  주파수가 과도하거나 부족할 수 있습니다. 이퀄라이저로 이러한
                  불균형을 바로잡아 더 깨끗하고 명료한 소리를 만들 수 있습니다.
                </p>
              </div>

              <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  보정 vs 창의적 사용
                </h3>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  이퀄라이저는 문제를 수정하는 보정 도구이자, 독특한 음색을
                  만드는 창의적 도구이기도 합니다. 때로는 결함을 제거하고,
                  때로는 특정 분위기를 연출합니다.
                </p>
              </div>
            </div>
          </section>

          {/* 주파수 대역별 특성 이해하기 */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2'>
              <Radio className='w-6 h-6 text-blue-600 dark:text-blue-400' />
              주파수 대역별 특성 이해하기
            </h2>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
              효과적인 이퀄라이징을 위해서는 각 주파수 대역이 어떤 소리를
              담당하는지 알아야 합니다.
            </p>

            {/* 초저음 */}
            <div className='mb-6'>
              <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-white'>
                초저음 (20-60Hz)
              </h3>
              <div className='p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'>
                <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                  <strong>특성:</strong> 사람이 소리로 듣기보다는 몸으로 느끼는
                  영역입니다. 킥드럼의 펀치감, 베이스의 무게감이 이 영역에
                  있습니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                  <strong>주의사항:</strong> 이 영역이 과도하면 소리가 혼탁하고
                  무겁습니다. 특히 음성 녹음에서는 불필요한 초저음이 많으므로
                  하이패스 필터로 제거하는 것이 좋습니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  <strong>조절 팁:</strong> 음성 콘텐츠는 80Hz 이하를 과감히
                  제거하세요. 음악에서도 킥드럼과 베이스가 아니라면 대부분
                  제거하는 것이 깨끗합니다.
                </p>
              </div>
            </div>

            {/* 저음 */}
            <div className='mb-6'>
              <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-white'>
                저음 (60-250Hz)
              </h3>
              <div className='p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'>
                <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                  <strong>특성:</strong> 소리의 따뜻함과 두께를 결정합니다. 남성
                  보컬의 가슴 울림, 어쿠스틱 기타의 바디감이 여기에 있습니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                  <strong>과다 증상:</strong> 부밍(booming) 현상이 발생하여
                  소리가 울리고 뭉개집니다. 특히 작은 방에서 녹음하면 이 대역이
                  과도하게 강조됩니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                  <strong>부족 증상:</strong> 소리가 얇고 가볍게 들립니다.
                  존재감과 무게감이 없습니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  <strong>조절 가이드:</strong> 100-200Hz 대역은 조심스럽게
                  다뤄야 합니다. 필요하면 2-3dB 정도만 조절하세요. 과도하면
                  혼탁해지고, 너무 줄이면 빈약해집니다.
                </p>
              </div>
            </div>

            {/* 중저음 */}
            <div className='mb-6'>
              <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-white'>
                중저음 (250-500Hz)
              </h3>
              <div className='p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'>
                <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                  <strong>특성:</strong> 대부분의 악기와 목소리가 기본 음높이를
                  가지는 영역입니다. 소리의 본체를 형성합니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                  <strong>과다 증상:</strong> 소리가 박스 안에 갇힌 것처럼
                  답답하고 콧소리처럼 들립니다. '머디(muddy)'하다고 표현합니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                  <strong>부족 증상:</strong> 소리가 공허하고 힘이 없습니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  <strong>조절 가이드:</strong> 300Hz 근처는 '머디함'의
                  주범이므로, 음성이 답답하게 들린다면 이 영역을 2-4dB
                  줄여보세요.
                </p>
              </div>
            </div>

            {/* 중음 */}
            <div className='mb-6'>
              <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-white'>
                중음 (500Hz-2kHz)
              </h3>
              <div className='p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800'>
                <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                  <strong>특성:</strong> 음악적 내용의 핵심이 있는 영역입니다.
                  대부분의 악기와 보컬이 이 범위에서 가장 많은 에너지를
                  가집니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                  <strong>과다 증상:</strong> 귀에 거슬리고 피로합니다. 전화기
                  목소리처럼 얇고 날카로워집니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                  <strong>부족 증상:</strong> 소리가 먼 곳에서 들리는 것처럼
                  거리감이 생깁니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  <strong>조절 가이드:</strong> 1-2kHz는 음성의 존재감을
                  좌우합니다. 명료도를 높이려면 이 대역을 2-3dB 올리되, 너무
                  과하면 거슬리므로 주의하세요.
                </p>
              </div>
            </div>

            {/* 중고음 */}
            <div className='mb-6'>
              <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-white'>
                중고음 (2-6kHz)
              </h3>
              <div className='p-4 rounded-lg bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800'>
                <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                  <strong>특성:</strong> 명료도와 선명함을 결정하는 중요한
                  영역입니다. 자음(ㅅ, ㅆ, ㅈ, ㅊ 등)이 이 대역에 있습니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                  <strong>과다 증상:</strong> 치찰음이 심하고 날카롭게 들립니다.
                  장시간 들으면 귀가 아픕니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                  <strong>부족 증상:</strong> 소리가 멀고 흐릿하며, 무슨 말인지
                  알아듣기 어렵습니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  <strong>조절 가이드:</strong> 3-4kHz를 2-3dB 올리면 보컬이
                  앞으로 나오고 명료해집니다. 하지만 5-6kHz가 과도하면 치찰음이
                  거슬리므로 주의하세요.
                </p>
              </div>
            </div>

            {/* 고음 */}
            <div className='mb-6'>
              <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-white'>
                고음 (6-20kHz)
              </h3>
              <div className='p-4 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800'>
                <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                  <strong>특성:</strong> 공기감, 광택, 밝기를 더합니다. 심벌,
                  하이햇, 숨소리 등이 이 영역에 있습니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                  <strong>과다 증상:</strong> 쉿쉿거리는 소리가 시끄럽고,
                  치찰음이 과도합니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                  <strong>부족 증상:</strong> 소리가 어둡고 답답하며, 생동감이
                  없습니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  <strong>조절 가이드:</strong> 10kHz 이상을 2-3dB 올리면
                  '공기감'이 생겨 더 비싸고 전문적으로 들립니다. 하지만 과하면
                  노이즈도 함께 강조되므로 조심하세요.
                </p>
              </div>
            </div>
          </section>

          {/* 이퀄라이저의 종류 */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2'>
              <Sliders className='w-6 h-6 text-indigo-600 dark:text-indigo-400' />
              이퀄라이저의 종류
            </h2>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
              다양한 타입의 이퀄라이저가 있으며, 각각 다른 용도로 사용됩니다.
            </p>

            <div className='space-y-4'>
              <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  그래픽 이퀄라이저 (Graphic EQ)
                </h3>
                <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                  <strong>특징:</strong> 여러 개의 슬라이더가 나란히 있어
                  시각적으로 직관적입니다. 각 슬라이더는 특정 주파수 대역을
                  담당합니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                  <strong>장점:</strong> 전체적인 톤을 빠르게 조절할 수
                  있습니다. 라이브 사운드에서 자주 사용됩니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                  <strong>단점:</strong> 정확한 주파수를 세밀하게 조절하기
                  어렵습니다. 고정된 대역만 조절 가능합니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  <strong>활용:</strong> 전체 믹스의 톤을 조정하거나, 룸 음향을
                  보정할 때 적합합니다.
                </p>
              </div>

              <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  파라메트릭 이퀄라이저 (Parametric EQ)
                </h3>
                <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                  <strong>특징:</strong> 주파수, 게인(음량), Q(대역폭)를 모두
                  자유롭게 조절할 수 있습니다. 가장 유연하고 정교한 타입입니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                  <strong>장점:</strong> 문제가 되는 정확한 주파수를 찾아서
                  수술적으로 제거하거나 강조할 수 있습니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                  <strong>단점:</strong> 초보자에게는 복잡하고 어렵게 느껴질 수
                  있습니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  <strong>활용:</strong> 전문적인 믹싱과 마스터링에 필수입니다.
                  대부분의 DAW에 기본 내장되어 있습니다.
                </p>
              </div>

              <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  셸프 이퀄라이저 (Shelving EQ)
                </h3>
                <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                  <strong>특징:</strong> 특정 주파수 이상(하이 셸프) 또는
                  이하(로우 셸프)의 모든 주파수를 일괄적으로 올리거나 내립니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                  <strong>장점:</strong> 전체적인 밝기나 무게감을 조절하기
                  쉽습니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  <strong>활용:</strong> 고음을 전체적으로 밝게 하거나, 저음을
                  전체적으로 줄일 때 사용합니다.
                </p>
              </div>

              <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  하이패스/로우패스 필터
                </h3>
                <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                  <strong>특징:</strong> 특정 주파수 이상(하이패스) 또는
                  이하(로우패스)를 완전히 제거합니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                  <strong>하이패스 필터:</strong> 저음을 제거합니다. 음성
                  녹음에서 80Hz 이하의 불필요한 저음을 제거할 때 필수입니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                  <strong>로우패스 필터:</strong> 고음을 제거합니다. 아날로그
                  느낌을 내거나 배경 요소를 뒤로 물릴 때 사용합니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  <strong>활용:</strong> 거의 모든 트랙에 하이패스 필터를
                  기본으로 적용하는 것이 좋습니다.
                </p>
              </div>
            </div>
          </section>

          {/* 이퀄라이저 사용의 기본 원칙 */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2'>
              <Zap className='w-6 h-6 text-yellow-600 dark:text-yellow-400' />
              이퀄라이저 사용의 기본 원칙
            </h2>

            <div className='space-y-6'>
              <div className='p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'>
                <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-white'>
                  1. 빼기가 더하기보다 낫다
                </h3>
                <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-2'>
                  <strong>원칙:</strong> 특정 주파수를 올리기보다는 불필요한
                  주파수를 제거하는 것이 더 자연스럽습니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-2'>
                  <strong>이유:</strong> 주파수를 올리면 다른 부분과의 불균형이
                  생기고, 전체 음량이 커져서 클리핑 위험이 있습니다. 반면 빼기는
                  공간을 만들고 명료도를 높입니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
                  <strong>실전 예시:</strong> 목소리를 더 밝게 하고 싶다면
                  고음을 올리는 대신, 저음과 중저음을 살짝 줄이세요. 결과적으로
                  상대적으로 고음이 강조됩니다.
                </p>
              </div>

              <div className='p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'>
                <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-white'>
                  2. 넓게 올리고, 좁게 빼라
                </h3>
                <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-2'>
                  <strong>원칙:</strong> 주파수를 올릴 때는 넓은 대역폭(낮은 Q
                  값)으로, 줄일 때는 좁은 대역폭(높은 Q 값)으로 조절하세요.
                </p>
                <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-2'>
                  <strong>이유:</strong> 넓게 올리면 자연스럽고, 좁게 빼면 문제
                  주파수만 정확히 제거할 수 있습니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
                  <strong>Q 값 가이드:</strong>
                </p>
                <ul className='list-disc list-inside text-gray-700 dark:text-gray-300 text-sm mt-2 space-y-1'>
                  <li>넓은 조절(음악적): Q = 0.5 - 1.0</li>
                  <li>중간 조절: Q = 1.0 - 3.0</li>
                  <li>좁은 조절(수술적): Q = 5.0 이상</li>
                </ul>
              </div>

              <div className='p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800'>
                <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-white'>
                  3. 귀로 듣고 판단하라
                </h3>
                <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-2'>
                  <strong>원칙:</strong> 화면의 그래프가 아니라 실제로 들리는
                  소리를 기준으로 판단하세요.
                </p>
                <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-2'>
                  <strong>함정:</strong> 시각적으로 멋있어 보이는 EQ 커브가 항상
                  좋게 들리는 것은 아닙니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
                  <strong>방법:</strong> 눈을 감고 들어보세요. 조절 전후를 A/B
                  비교하며 실제로 나아졌는지 확인하세요.
                </p>
              </div>

              <div className='p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800'>
                <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-white'>
                  4. 적은 것이 많은 것이다
                </h3>
                <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-2'>
                  <strong>원칙:</strong> 한 번에 2-4dB 정도만 조절하세요.
                  드라마틱한 변화는 대부분 과도합니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-2'>
                  <strong>예외:</strong> 문제 주파수를 제거할 때는 -6dB에서
                  -12dB까지 과감하게 줄일 수 있습니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
                  <strong>점검 방법:</strong> 조절을 과장되게 했다가(±10dB),
                  천천히 줄여가며 적절한 지점을 찾으세요.
                </p>
              </div>

              <div className='p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'>
                <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-white'>
                  5. 문맥 속에서 판단하라
                </h3>
                <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-2'>
                  <strong>원칙:</strong> 솔로로 들었을 때와 전체 믹스에서 들었을
                  때는 다릅니다. 항상 전체 맥락에서 판단하세요.
                </p>
                <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-2'>
                  <strong>흔한 실수:</strong> 보컬을 솔로로 듣고 완벽하게
                  만들었는데, 전체 믹스에 넣으니 묻히거나 튀는 경우입니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
                  <strong>올바른 방법:</strong> 솔로로 큰 문제만 수정하고, 세부
                  조정은 전체 믹스를 들으며 진행하세요.
                </p>
              </div>
            </div>
          </section>

          {/* 목적별 이퀄라이징 가이드 */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2'>
              <Mic className='w-6 h-6 text-pink-600 dark:text-pink-400' />
              목적별 이퀄라이징 가이드
            </h2>

            {/* 음성/팟캐스트 개선하기 */}
            <div className='mb-8'>
              <h3 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white'>
                음성/팟캐스트 개선하기
              </h3>
              <div className='space-y-3'>
                <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    1단계 - 하이패스 필터
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    80Hz 이하를 제거하여 불필요한 저음을 없앱니다. 이것만으로도
                    명료도가 크게 향상됩니다.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    2단계 - 머디함 제거
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    250-400Hz를 2-4dB 줄여서 답답한 느낌을 제거합니다. 특히 남성
                    목소리는 이 영역이 과도한 경우가 많습니다.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    3단계 - 명료도 향상
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    2-4kHz를 2-3dB 올려서 목소리를 앞으로 끌어냅니다. 자음이
                    명확해지고 알아듣기 쉬워집니다.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    4단계 - 치찰음 조절
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    6-8kHz가 과도하면 2-3dB 줄입니다. 'ㅅ', 'ㅆ' 소리가 너무
                    날카롭지 않게 합니다.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    5단계 - 공기감 추가
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    10kHz 이상을 1-2dB 올리면 녹음이 더 고급스럽고 열린 느낌이
                    됩니다.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    <strong>최종 체크:</strong> 전체적으로 자연스럽고, 오랜 시간
                    들어도 피로하지 않은지 확인하세요.
                  </p>
                </div>
              </div>
            </div>

            {/* 음악 믹싱 */}
            <div className='mb-8'>
              <h3 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white'>
                음악 믹싱
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    킥드럼
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    60Hz에서 펀치감, 3-5kHz에서 어택감을 강조합니다. 200-500Hz는
                    줄여서 머디함을 방지합니다.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    베이스
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    40-60Hz에서 무게감을 확보하되, 100-200Hz는 조심스럽게
                    다룹니다. 킥드럼과 주파수가 겹치므로 조율이 필요합니다.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    어쿠스틱 기타
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    80-120Hz에서 바디감, 2-5kHz에서 픽 소리와 명료도를
                    조절합니다. 200-400Hz의 박스 울림은 줄입니다.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    일렉 기타
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    100Hz 이하를 제거하고, 2-4kHz에서 날카로움을 조절합니다.
                    디스토션 기타는 중고음이 과도할 수 있으므로 주의합니다.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    보컬
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    위의 음성 가이드를 기본으로 하되, 음악 장르에 따라
                    조절합니다. 팝은 밝게, 재즈는 따뜻하게, 록은 공격적으로
                    만듭니다.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    드럼 오버헤드
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    200Hz 이하를 제거하고, 8-12kHz에서 심벌의 광택을 조절합니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 녹음 환경 문제 해결 */}
            <div className='mb-8'>
              <h3 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white'>
                녹음 환경 문제 해결
              </h3>
              <div className='space-y-3'>
                <div className='p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    방 울림 제거
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    200-500Hz에서 울리는 주파수를 찾아 좁은 Q로 제거합니다.
                    솔로로 들으며 해당 주파수를 과장되게 올렸다 내리며 찾으세요.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    에어컨/컴퓨터 소음
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    저음 노이즈가 문제라면 80-120Hz를 좁은 Q로 줄입니다.
                    하이패스 필터만으로도 많이 개선됩니다.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    전화/줌 녹음 개선
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    200Hz 이하와 4kHz 이상을 제거하여 통신 장비의 한계를
                    보완합니다. 2-3kHz를 강조하면 명료도가 올라갑니다.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    과도한 반향
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    로우 미드(250-500Hz)를 줄이고, 하이패스 필터를
                    높게(100-150Hz) 설정합니다.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 실전 작업 흐름 */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2'>
              <Music className='w-6 h-6 text-teal-600 dark:text-teal-400' />
              실전 작업 흐름
            </h2>

            <div className='space-y-6'>
              <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-white'>
                  1단계: 문제 주파수 찾기
                </h3>
                <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  스위핑 기법:
                </h4>
                <ol className='list-decimal list-inside text-gray-700 dark:text-gray-300 text-sm space-y-2'>
                  <li>파라메트릭 EQ의 한 밴드를 선택합니다</li>
                  <li>게인을 +10dB 정도 크게 올립니다</li>
                  <li>Q 값을 5-10으로 좁게 설정합니다</li>
                  <li>
                    주파수를 천천히 움직이며 거슬리는 소리가 강조되는 지점을
                    찾습니다
                  </li>
                  <li>찾은 주파수를 -3dB에서 -6dB 줄입니다</li>
                </ol>
                <p className='text-gray-700 dark:text-gray-300 text-sm mt-3'>
                  <strong>주의사항:</strong> 모든 주파수가 문제는 아닙니다. 정말
                  거슬리는 부분만 조절하세요.
                </p>
              </div>

              <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-white'>
                  2단계: 전체 톤 조정
                </h3>
                <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-3'>
                  문제를 해결했다면 이제 원하는 톤을 만듭니다.
                </p>
                <div className='space-y-2'>
                  <div className='p-3 rounded bg-blue-50 dark:bg-blue-900/20'>
                    <p className='text-gray-700 dark:text-gray-300 text-sm'>
                      <strong>따뜻한 느낌:</strong> 200-400Hz를 2-3dB 올리고,
                      고음을 약간 줄입니다.
                    </p>
                  </div>
                  <div className='p-3 rounded bg-green-50 dark:bg-green-900/20'>
                    <p className='text-gray-700 dark:text-gray-300 text-sm'>
                      <strong>밝고 현대적인 느낌:</strong> 저음을 줄이고,
                      3-5kHz와 10kHz 이상을 2-3dB 올립니다.
                    </p>
                  </div>
                  <div className='p-3 rounded bg-purple-50 dark:bg-purple-900/20'>
                    <p className='text-gray-700 dark:text-gray-300 text-sm'>
                      <strong>빈티지 느낌:</strong> 60Hz 이하와 8kHz 이상을
                      제거하여 오래된 라디오 같은 느낌을 만듭니다.
                    </p>
                  </div>
                  <div className='p-3 rounded bg-orange-50 dark:bg-orange-900/20'>
                    <p className='text-gray-700 dark:text-gray-300 text-sm'>
                      <strong>공격적인 느낌:</strong> 중고음(3-6kHz)을 강조하고,
                      저음을 타이트하게 만듭니다.
                    </p>
                  </div>
                </div>
              </div>

              <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-white'>
                  3단계: 비교와 미세 조정
                </h3>
                <div className='space-y-2'>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    <strong>A/B 비교:</strong> 대부분의 EQ 플러그인에는
                    bypass(우회) 버튼이 있습니다. 조절 전후를 번갈아 들으며
                    실제로 개선되었는지 확인하세요.
                  </p>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    <strong>음량 보정:</strong> EQ를 적용하면 전체 음량이 달라질
                    수 있습니다. 공정한 비교를 위해 음량을 맞춰야 합니다.
                  </p>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    <strong>휴식 후 재점검:</strong> 귀는 쉽게 피로해지고
                    적응합니다. 10-15분 휴식 후 다시 들어보면 새로운 관점을 얻을
                    수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 흔한 실수와 해결책 */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white'>
              흔한 실수와 해결책
            </h2>

            <div className='space-y-4'>
              <div className='p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  과도한 조절
                </h3>
                <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                  <strong>증상:</strong> 소리가 부자연스럽고 인공적입니다. 특정
                  주파수가 과도하게 튀거나 없습니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                  <strong>원인:</strong> 한 번에 너무 많이(±6dB 이상)
                  조절했거나, 너무 많은 밴드를 동시에 사용했습니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  <strong>해결:</strong> 모든 조절을 절반으로 줄이고 다시
                  들어보세요. 필요 최소한만 조절하는 것이 목표입니다.
                </p>
              </div>

              <div className='p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  저음 과다
                </h3>
                <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                  <strong>증상:</strong> 소리가 혼탁하고 무겁습니다. 작은
                  스피커나 스마트폰에서 들으면 문제가 더 심해집니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                  <strong>원인:</strong> 저음을 올리는 것에만 집중했거나,
                  하이패스 필터를 사용하지 않았습니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  <strong>해결:</strong> 모든 트랙에 80-100Hz 하이패스 필터를
                  기본으로 적용하세요. 저음은 올리지 말고 중음을 줄여서
                  상대적으로 강조하세요.
                </p>
              </div>

              <div className='p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  치찰음 과다
                </h3>
                <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                  <strong>증상:</strong> 'ㅅ', 'ㅆ' 소리가 날카롭고 귀에
                  거슬립니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                  <strong>원인:</strong> 5-8kHz를 과도하게 올렸거나, 컴프레션 후
                  고음이 강조되었습니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  <strong>해결:</strong> 6-8kHz를 2-3dB 줄이거나,
                  디에서(De-esser)를 사용하세요. 디에서는 치찰음만 선택적으로
                  줄입니다.
                </p>
              </div>

              <div className='p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  위상 문제
                </h3>
                <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                  <strong>증상:</strong> EQ를 적용했는데 소리가 오히려 더
                  이상해지거나 얇아집니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                  <strong>원인:</strong> 일부 EQ는 위상을 변화시켜 다른 트랙과의
                  위상 관계를 망칠 수 있습니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  <strong>해결:</strong> Linear Phase EQ를 사용하거나, 최소한의
                  조절만 하세요. 특히 저음역에서 위상 문제가 많이 발생합니다.
                </p>
              </div>
            </div>
          </section>

          {/* 추천 이퀄라이저 플러그인 */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white'>
              추천 이퀄라이저 플러그인
            </h2>

            <div className='mb-6'>
              <h3 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white'>
                무료 플러그인
              </h3>
              <div className='space-y-4'>
                <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    TDR Nova
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    무료지만 전문가급 기능을 제공하는 다이나믹 EQ입니다.
                    파라메트릭 EQ와 컴프레서의 장점을 결합했습니다.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    MEqualizer (MeldaProduction)
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    강력한 분석 도구와 함께 제공되는 무료 EQ입니다. 시각적
                    피드백이 뛰어납니다.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    EQ 내장 (DAW 기본 제공)
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    Ableton의 EQ Eight, Logic의 Channel EQ, Pro Tools의 EQ III
                    등 대부분의 DAW 기본 EQ도 훌륭합니다.
                  </p>
                </div>
              </div>
            </div>

            <div className='mb-6'>
              <h3 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white'>
                유료 플러그인
              </h3>
              <div className='space-y-4'>
                <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    FabFilter Pro-Q 3
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    업계 표준으로 자리잡은 EQ입니다. 직관적인 인터페이스, 강력한
                    분석 기능, Linear Phase 모드를 제공합니다.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    Waves SSL E-Channel
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    전설적인 SSL 콘솔의 EQ를 모델링했습니다. 음악적이고 따뜻한
                    사운드를 제공합니다.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    iZotope Neutron
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    AI 기반 자동 EQ 제안 기능이 있어 초보자에게 좋습니다.
                    학습용으로도 유용합니다.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    Sonnox Oxford EQ
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    방송과 마스터링 분야에서 신뢰받는 고급 EQ입니다.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 장르별 이퀄라이징 특징 */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white'>
              장르별 이퀄라이징 특징
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              <div className='p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  팝
                </h3>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  밝고 현대적인 사운드. 저음은 타이트하게, 고음은 반짝이게.
                  2-5kHz에서 명료도, 10kHz 이상에서 공기감을 강조합니다.
                </p>
              </div>

              <div className='p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  힙합
                </h3>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  강력한 저음이 중요합니다. 40-60Hz에서 베이스와 킥의 무게감을
                  확보하되, 머디하지 않게 200-400Hz는 정리합니다.
                </p>
              </div>

              <div className='p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  재즈
                </h3>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  따뜻하고 자연스러운 사운드. 과도한 조절을 피하고, 200-500Hz의
                  따뜻함을 유지합니다. 고음은 부드럽게 처리합니다.
                </p>
              </div>

              <div className='p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  록
                </h3>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  중음이 강조된 공격적인 사운드. 기타와 보컬이 2-5kHz에서
                  경쟁하므로, 각각 다른 주파수를 강조하여 공간을 만듭니다.
                </p>
              </div>

              <div className='p-4 rounded-lg bg-pink-50 dark:bg-pink-900/20 border border-pink-200 dark:border-pink-800'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  클래식
                </h3>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  최소한의 조절. 자연스러운 악기 음색을 유지하는 것이
                  목표입니다. 문제 주파수만 조심스럽게 제거합니다.
                </p>
              </div>

              <div className='p-4 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  EDM
                </h3>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  극단적이고 과장된 주파수 조절이 가능합니다. 킥의 펀치(60Hz),
                  스네어의 크랙(200Hz), 신스의 밝기(5-10kHz)를 과감하게
                  강조합니다.
                </p>
              </div>
            </div>
          </section>

          {/* 마치며 */}
          <section className='mb-10 p-6 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800'>
            <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white'>
              마치며
            </h2>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
              이퀄라이저는 오디오 편집에서 가장 중요한 도구 중 하나이지만,
              마법의 버튼은 아닙니다. 좋지 않은 녹음을 완벽하게 만들 수는
              없지만, 좋은 녹음을 훌륭하게 만들 수 있습니다.
            </p>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
              이 글에서 소개한 원칙과 기법들을 바탕으로 꾸준히 연습하세요.
              처음에는 각 주파수가 어떻게 들리는지 익히는 데 집중하고, 점차
              미묘한 차이를 구별할 수 있게 됩니다. 귀가 트레이닝되면 어떤
              주파수를 어떻게 조절해야 할지 자연스럽게 알게 됩니다.
            </p>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
              무엇보다 중요한 것은 '더 좋게' 만드는 것이지 '다르게' 만드는 것이
              아니라는 점입니다. 항상 조절 전후를 비교하며, 실제로 개선되었는지
              냉정하게 판단하세요. 때로는 아무것도 하지 않는 것이 최선일 수도
              있습니다.
            </p>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
              이제 여러분의 오디오 파일을 열고 이퀄라이저로 음질을 한 단계
              업그레이드해보세요!
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
