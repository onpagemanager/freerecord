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
  Shield,
  Settings,
  Music,
  Zap,
  AlertTriangle,
} from 'lucide-react';

export default function BlogDetail() {
  // 게시글 메타 정보
  const postMeta = {
    id: 3,
    title: '음성 변조로 만드는 독특한 효과들',
    author: '크리에이터',
    date: '2024-01-13',
    views: 2100,
    likes: 145,
    comments: 42,
    category: '팁',
    tags: [
      '음성변조',
      '효과',
      '크리에이티브',
      '오디오편집',
      '팟캐스트',
      '유튜브',
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
              콘텐츠 제작의 세계에서 음성은 단순히 정보를 전달하는 수단을 넘어, 창의성과
              개성을 표현하는 강력한 도구입니다. 특히 음성 변조 기술은 평범한 목소리를
              로봇, 외계인, 괴물, 또는 완전히 다른 인물의 목소리로 바꿔주어 콘텐츠에 독특한
              매력을 더해줍니다. 오늘은 다양한 음성 변조 효과를 활용하여 독특한 오디오
              콘텐츠를 만드는 방법을 상세히 소개해드리겠습니다.
            </p>
          </div>

          {/* 음성 변조가 필요한 이유 */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2'>
              <Sparkles className='w-6 h-6 text-purple-600 dark:text-purple-400' />
              음성 변조가 필요한 이유
            </h2>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
              음성 변조는 단순한 재미를 넘어 실용적인 목적으로도 광범위하게 활용됩니다.
            </p>

            <ul className='space-y-3 mb-6'>
              <li className='flex items-start gap-3'>
                <span className='text-purple-600 dark:text-purple-400 font-bold mt-1'>
                  •
                </span>
                <div>
                  <strong className='text-gray-900 dark:text-white'>프라이버시 보호:</strong>
                  <span className='text-gray-700 dark:text-gray-300'>
                    {' '}
                    인터뷰나 증언 영상에서 신원을 보호해야 할 때, 음성 변조는 필수적입니다.
                    목소리만으로도 개인을 식별할 수 있기 때문에, 민감한 내용을 다룰 때는
                    반드시 음성 변조를 고려해야 합니다.
                  </span>
                </div>
              </li>
              <li className='flex items-start gap-3'>
                <span className='text-purple-600 dark:text-purple-400 font-bold mt-1'>
                  •
                </span>
                <div>
                  <strong className='text-gray-900 dark:text-white'>캐릭터 연출:</strong>
                  <span className='text-gray-700 dark:text-gray-300'>
                    {' '}
                    애니메이션, 게임, 오디오 드라마 제작 시 다양한 캐릭터를 표현할 수
                    있습니다. 한 명의 성우가 여러 역할을 소화할 때나, 비현실적인 캐릭터를
                    표현할 때 특히 유용합니다.
                  </span>
                </div>
              </li>
              <li className='flex items-start gap-3'>
                <span className='text-purple-600 dark:text-purple-400 font-bold mt-1'>
                  •
                </span>
                <div>
                  <strong className='text-gray-900 dark:text-white'>창의적 표현:</strong>
                  <span className='text-gray-700 dark:text-gray-300'>
                    {' '}
                    ASMR, 실험적 음악, 사운드 아트 등에서 독특한 청각적 경험을 만들어냅니다.
                    평범한 소리도 변조를 거치면 완전히 새로운 예술 작품이 될 수 있습니다.
                  </span>
                </div>
              </li>
              <li className='flex items-start gap-3'>
                <span className='text-purple-600 dark:text-purple-400 font-bold mt-1'>
                  •
                </span>
                <div>
                  <strong className='text-gray-900 dark:text-white'>브랜딩:</strong>
                  <span className='text-gray-700 dark:text-gray-300'>
                    {' '}
                    유튜브나 팟캐스트에서 특정한 음성 효과를 시그니처로 사용하면 강력한
                    브랜드 아이덴티티를 구축할 수 있습니다. 듣는 순간 누구의 콘텐츠인지 알
                    수 있게 만드는 것이죠.
                  </span>
                </div>
              </li>
              <li className='flex items-start gap-3'>
                <span className='text-purple-600 dark:text-purple-400 font-bold mt-1'>
                  •
                </span>
                <div>
                  <strong className='text-gray-900 dark:text-white'>엔터테인먼트:</strong>
                  <span className='text-gray-700 dark:text-gray-300'>
                    {' '}
                    코미디 콘텐츠, 패러디, 밈 제작에서 웃음을 유발하는 효과적인 도구입니다.
                    음성 변조만으로도 평범한 대사가 웃긴 대사로 바뀔 수 있습니다.
                  </span>
                </div>
              </li>
            </ul>
          </section>

          {/* 음성 변조의 기본 원리 */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2'>
              <Settings className='w-6 h-6 text-blue-600 dark:text-blue-400' />
              음성 변조의 기본 원리
            </h2>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
              음성 변조를 효과적으로 사용하려면 기본 원리를 이해하는 것이 도움이 됩니다.
            </p>

            <div className='space-y-4'>
              <div className='p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  피치(Pitch) 조절
                </h3>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  음의 높낮이를 조절합니다. 피치를 높이면 어린아이나 만화 캐릭터 같은
                  목소리가 되고, 낮추면 굵고 위엄 있는 목소리가 됩니다. 반음(semitone)
                  단위로 조절하는데, ±12 semitone이 한 옥타브입니다.
                </p>
              </div>

              <div className='p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  포먼트(Formant) 변경
                </h3>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  목소리의 음색을 결정하는 요소입니다. 피치와 독립적으로 조절할 수 있어,
                  피치는 그대로 두고 목소리의 성별이나 나이만 바꿀 수 있습니다. 포먼트를
                  올리면 여성스러운 목소리, 내리면 남성스러운 목소리가 됩니다.
                </p>
              </div>

              <div className='p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  속도(Tempo) 조정
                </h3>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  말하는 속도를 바꿉니다. 피치를 유지하면서 속도만 바꾸거나, 둘 다 함께 바꿀
                  수 있습니다. 느린 속도는 괴물이나 거인, 빠른 속도는 다람쥐나 요정 같은
                  캐릭터를 표현할 때 좋습니다.
                </p>
              </div>

              <div className='p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  공간 효과(Reverb, Echo)
                </h3>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  목소리가 울리는 공간의 특성을 부여합니다. 큰 홀, 동굴, 우주선 내부 등
                  다양한 환경을 음향적으로 재현할 수 있습니다.
                </p>
              </div>

              <div className='p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  왜곡(Distortion)
                </h3>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  신호를 의도적으로 찌그러뜨려 거칠고 공격적인 느낌을 만듭니다. 로봇, 괴물,
                  전화 목소리 등을 표현할 때 사용합니다.
                </p>
              </div>
            </div>
          </section>

          {/* 대표적인 음성 변조 효과들 */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2'>
              <Music className='w-6 h-6 text-indigo-600 dark:text-indigo-400' />
              대표적인 음성 변조 효과들
            </h2>

            {/* 1. 로봇 음성 */}
            <div className='mb-6'>
              <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-white'>
                1. 로봇 음성 (Robot Voice)
              </h3>
              <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-3'>
                로봇 음성은 SF 콘텐츠나 AI 캐릭터를 표현할 때 가장 많이 사용되는 효과입니다.
              </p>
              <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-3'>
                <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  만드는 방법:
                </h4>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  보코더(Vocoder)나 링 모듈레이터(Ring Modulator)를 사용합니다. 약간의
                  디지털 왜곡과 메탈릭한 공명을 추가하면 더욱 기계적인 느낌이 납니다. 피치를
                  약간 낮추고(-3 semitone), 억양을 평탄하게 만들면 감정 없는 로봇의 느낌을
                  줄 수 있습니다.
                </p>
              </div>
              <div className='p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'>
                <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  활용 예시:
                </h4>
                <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                  AI 어시스턴트 캐릭터, 사이버펑크 배경의 안드로이드, 시스템 안내 음성,
                  미래형 내비게이션 등에 적합합니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  <strong className='text-gray-900 dark:text-white'>세부 조정:</strong> EQ로
                  중저음(200-500Hz)을 제거하고 중고음(2-4kHz)을 강조하면 더 기계적인 소리가
                  납니다. 비트 크러셔(Bit Crusher)를 살짝 걸면 디지털 노이즈가 추가되어
                  더욱 사실적입니다.
                </p>
              </div>
            </div>

            {/* 2. 헬륨 음성 */}
            <div className='mb-6'>
              <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-white'>
                2. 헬륨 음성 (Chipmunk Voice)
              </h3>
              <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-3'>
                헬륨을 마신 것처럼 높고 빠른 목소리입니다.
              </p>
              <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-3'>
                <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  만드는 방법:
                </h4>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  피치를 5-8 semitone 올리고 속도를 약 120-150%로 증가시킵니다. 포먼트도
                  함께 올리면 더 자연스럽습니다.
                </p>
              </div>
              <div className='p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'>
                <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  활용 예시:
                </h4>
                <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                  코미디 콘텐츠, 어린이용 캐릭터, 다람쥐나 작은 동물 캐릭터, 패러디 영상에
                  좋습니다. 진지한 장면을 우스꽝스럽게 만들 때도 효과적입니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  <strong className='text-gray-900 dark:text-white'>주의사항:</strong> 너무
                  많이 올리면 알아듣기 어려워지므로, 명료도를 유지하는 선에서 조절해야
                  합니다.
                </p>
              </div>
            </div>

            {/* 3. 악마/괴물 음성 */}
            <div className='mb-6'>
              <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-white'>
                3. 악마/괴물 음성 (Demon Voice)
              </h3>
              <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-3'>
                무섭고 위협적인 느낌을 주는 효과입니다.
              </p>
              <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-3'>
                <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  만드는 방법:
                </h4>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  원본 음성의 피치를 -8에서 -12 semitone 낮춥니다. 여기에 약간 지연된(-10ms
                  ~ -50ms) 같은 음성을 레이어링하고, 디스토션과 깊은 리버브를 추가합니다.
                  저음역대(80-200Hz)를 강조하면 더욱 위협적입니다.
                </p>
              </div>
              <div className='p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'>
                <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  활용 예시:
                </h4>
                <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                  호러 게임, 공포 영화 더빙, 할로윈 콘텐츠, 다크 판타지 캐릭터 보이스에
                  적합합니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  <strong className='text-gray-900 dark:text-white'>레이어링 기법:</strong>{' '}
                  같은 대사를 여러 번 녹음하여 살짝 다른 피치로 겹치면 여러 목소리가
                  동시에 말하는 듯한 불길한 효과를 만들 수 있습니다.
                </p>
              </div>
            </div>

            {/* 4. 전화/무전기 음성 */}
            <div className='mb-6'>
              <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-white'>
                4. 전화/무전기 음성 (Radio/Phone Voice)
              </h3>
              <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-3'>
                오래된 통신 기기를 통해 들리는 듯한 효과입니다.
              </p>
              <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-3'>
                <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  만드는 방법:
                </h4>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  EQ로 저음역대(100Hz 이하)와 고음역대(3kHz 이상)를 대폭 줄입니다. 중간
                  대역(800Hz-2.5kHz)만 남기면 됩니다. 약간의 노이즈와 압축을 추가하고,
                  비트 레이트를 낮추면 더욱 사실적입니다.
                </p>
              </div>
              <div className='p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800'>
                <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  활용 예시:
                </h4>
                <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                  전화 통화 장면, 경찰 무전, 군대 통신, 레트로 라디오 방송 재현, 스파이 영화
                  등에 사용됩니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  <strong className='text-gray-900 dark:text-white'>시대별 변형:</strong>{' '}
                  1950년대 라디오는 더 좁은 주파수 대역(1-2kHz)을, 현대 스마트폰은 좀 더
                  넓은 대역을 사용하면 차이를 표현할 수 있습니다.
                </p>
              </div>
            </div>

            {/* 5. 수중 음성 */}
            <div className='mb-6'>
              <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-white'>
                5. 수중 음성 (Underwater Voice)
              </h3>
              <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-3'>
                물속에서 말하는 듯한 몽환적인 효과입니다.
              </p>
              <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-3'>
                <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  만드는 방법:
                </h4>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  로우패스 필터로 2kHz 이상의 고음을 제거합니다. 약간의 코러스(Chorus)와
                  플랜저(Flanger) 효과를 추가하고, 느린 LFO(Low Frequency Oscillator)로
                  모듈레이션을 걸면 물결치는 느낌이 납니다.
                </p>
              </div>
              <div className='p-4 rounded-lg bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-800'>
                <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  활용 예시:
                </h4>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  수중 장면, 꿈 시퀀스, 회상 장면, 의식을 잃어가는 장면, 초현실적 분위기
                  연출에 좋습니다.
                </p>
              </div>
            </div>

            {/* 6. 외계인 음성 */}
            <div className='mb-6'>
              <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-white'>
                6. 외계인 음성 (Alien Voice)
              </h3>
              <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-3'>
                비현실적이고 낯선 느낌의 목소리입니다.
              </p>
              <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-3'>
                <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  만드는 방법:
                </h4>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  피치 시프터로 불규칙한 변조를 주거나, 링 모듈레이터로 금속성 배음을
                  추가합니다. 리버스 리버브(거꾸로 재생한 리버브)를 살짝 섞으면 더욱
                  초자연적인 느낌이 납니다.
                </p>
              </div>
              <div className='p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800'>
                <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  활용 예시:
                </h4>
                <p className='text-gray-700 dark:text-gray-300 text-sm mb-2'>
                  SF 영화나 게임의 외계 종족, 초자연적 존재, 차원이 다른 생명체 등을 표현할
                  때 사용합니다.
                </p>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  <strong className='text-gray-900 dark:text-white'>창의적 접근:</strong>{' '}
                  여러 효과를 무작위로 조합하거나, 예상치 못한 파라미터 값을 사용하면 정말
                  독특한 외계인 목소리를 만들 수 있습니다.
                </p>
              </div>
            </div>

            {/* 7. 노인 음성 */}
            <div className='mb-6'>
              <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-white'>
                7. 노인 음성 (Old Age Voice)
              </h3>
              <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-3'>
                나이 든 사람의 목소리를 재현합니다.
              </p>
              <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-3'>
                <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  만드는 방법:
                </h4>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  피치를 약간 낮추고(-2 ~ -4 semitone), 포먼트도 함께 낮춥니다. 약간의
                  떨림(Tremolo, 4-6Hz)을 추가하고, 고음역의 명료도를 살짝 줄이면 됩니다.
                  숨소리나 입안의 소리를 강조하면 더 사실적입니다.
                </p>
              </div>
              <div className='p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800'>
                <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  활용 예시:
                </h4>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  노인 캐릭터 연기, 시간 경과 표현, 과거 회상 내레이션 등에 활용됩니다.
                </p>
              </div>
            </div>

            {/* 8. 동굴/큰 공간 음성 */}
            <div className='mb-6'>
              <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-white'>
                8. 동굴/큰 공간 음성 (Cavern Echo)
              </h3>
              <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-3'>
                넓고 울리는 공간에서 말하는 듯한 효과입니다.
              </p>
              <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mb-3'>
                <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  만드는 방법:
                </h4>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  긴 리버브(3-5초)와 프리딜레이(100-200ms)를 추가합니다. 여러 번 반복되는
                  에코를 설정하되, 각 반복마다 볼륨이 점진적으로 줄어들게 합니다.
                </p>
              </div>
              <div className='p-4 rounded-lg bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-800'>
                <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  활용 예시:
                </h4>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  동굴, 대성당, 거대한 홀, 고대 유적, 산속 협곡 등의 장면에 적합합니다.
                </p>
              </div>
            </div>
          </section>

          {/* 음성 변조를 위한 최고의 도구들 */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2'>
              <Zap className='w-6 h-6 text-yellow-500' />
              음성 변조를 위한 최고의 도구들
            </h2>

            {/* 무료 소프트웨어 */}
            <div className='mb-6'>
              <h3 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white'>
                무료 소프트웨어
              </h3>

              <div className='space-y-3'>
                <div className='p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    Audacity
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    완전 무료 오픈소스 오디오 편집 프로그램입니다. 피치 변경, 속도 조절,
                    이퀄라이저, 리버브, 에코 등 기본적인 음성 변조에 필요한 모든 기능을
                    제공합니다. 초보자도 쉽게 배울 수 있고, 플러그인을 추가하면 더 많은
                    효과를 사용할 수 있습니다.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    Voicemod Free
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    실시간 음성 변조 소프트웨어로, 게이머와 스트리머에게 인기가 많습니다.
                    다양한 프리셋 효과를 제공하며, Discord, Zoom, OBS 등과 호환됩니다.
                    무료 버전도 충분히 유용합니다.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    MorphVOX Junior
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    간단한 인터페이스로 실시간 음성 변조가 가능합니다. 로봇, 괴물, 어린이,
                    여성/남성 등 기본 프리셋을 제공합니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 유료 전문 소프트웨어 */}
            <div className='mb-6'>
              <h3 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white'>
                유료 전문 소프트웨어
              </h3>

              <div className='space-y-3'>
                <div className='p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    Adobe Audition
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    전문가용 오디오 편집 프로그램으로, 매우 정교한 음성 변조가 가능합니다.
                    스펙트럴 편집, 고급 노이즈 제거, 다양한 이펙트 프로세서를 제공합니다.
                    Creative Cloud 구독으로 사용할 수 있습니다.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    iZotope RX
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    음성 복원과 변조에 특화된 전문가용 도구입니다. AI 기반 기능으로 매우
                    자연스러운 음성 변조가 가능하며, 영화 산업에서도 널리 사용됩니다.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    Celemony Melodyne
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    피치와 타이밍을 정밀하게 조절할 수 있는 프로그램입니다. 노래 목소리
                    편집에 주로 사용되지만, 음성 변조에도 탁월합니다.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    Waves Plugins
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    다양한 보컬 이펙트 플러그인을 제공합니다. Vocal Rider, Vocal Bender,
                    OVox 등은 창의적인 음성 변조에 매우 유용합니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 모바일 앱 */}
            <div className='mb-6'>
              <h3 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white'>
                모바일 앱
              </h3>

              <div className='space-y-3'>
                <div className='p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    Voice Changer Plus (iOS)
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    40가지 이상의 음성 효과를 제공하며, 녹음과 동시에 효과를 적용할 수
                    있습니다. 간편한 공유 기능도 제공합니다.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    Voice Changer with Effects (Android)
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    다양한 음성 효과와 백그라운드 사운드를 제공합니다. 녹음한 파일에 효과를
                    적용하거나 실시간으로 변조할 수 있습니다.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    VoiceFX
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    직관적인 인터페이스로 쉽게 음성을 변조하고, 소셜 미디어에 바로 공유할
                    수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 실전 활용 가이드 */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2'>
              <Settings className='w-6 h-6 text-teal-600 dark:text-teal-400' />
              실전 활용 가이드
            </h2>

            {/* 단계별 작업 프로세스 */}
            <div className='mb-6'>
              <h3 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white'>
                단계별 작업 프로세스
              </h3>

              <div className='space-y-4'>
                <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    1단계: 깨끗한 원본 녹음
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    음성 변조의 품질은 원본 녹음 품질에 크게 좌우됩니다. 노이즈가 적고
                    명료한 음성을 녹음하세요. 마이크와 입 사이 거리를 일정하게 유지하고,
                    조용한 환경에서 녹음하는 것이 중요합니다.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    2단계: 노이즈 제거 및 정리
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    변조를 적용하기 전에 배경 소음, 입안 소리, 숨소리 등을 제거합니다.
                    음성 변조는 노이즈도 함께 변조하기 때문에, 깨끗한 원본이 필수입니다.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    3단계: 주요 변조 적용
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    피치, 포먼트, 속도 등 기본 변조를 적용합니다. 한 번에 모든 효과를 넣지
                    말고, 하나씩 적용하면서 결과를 확인하세요.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    4단계: 세부 효과 추가
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    EQ, 리버브, 딜레이, 디스토션 등 추가 효과를 적용합니다. 각 효과의
                    파라미터를 세밀하게 조정하여 원하는 느낌을 만듭니다.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    5단계: 믹싱과 마스터링
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    최종 음량을 조절하고, 필요하면 컴프레서나 리미터를 사용합니다. 변조된
                    음성이 전체 오디오 믹스에서 잘 들리도록 조정합니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 자연스러움 유지하기 */}
            <div className='mb-6'>
              <h3 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white'>
                자연스러움 유지하기
              </h3>
              <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
                음성 변조의 함정은 과도하게 적용하여 알아듣기 어렵게 만드는 것입니다.
              </p>

              <ul className='space-y-3'>
                <li className='flex items-start gap-3'>
                  <span className='text-teal-600 dark:text-teal-400 font-bold mt-1'>•</span>
                  <div>
                    <strong className='text-gray-900 dark:text-white'>명료도 우선:</strong>
                    <span className='text-gray-700 dark:text-gray-300'>
                      {' '}
                      아무리 멋진 효과라도 무슨 말인지 알아들을 수 없다면 소용없습니다.
                      항상 명료도를 우선시하고, 효과는 적절한 수준에서 멈춰야 합니다.
                    </span>
                  </div>
                </li>
                <li className='flex items-start gap-3'>
                  <span className='text-teal-600 dark:text-teal-400 font-bold mt-1'>•</span>
                  <div>
                    <strong className='text-gray-900 dark:text-white'>문맥에 맞게:</strong>
                    <span className='text-gray-700 dark:text-gray-300'>
                      {' '}
                      콘텐츠의 분위기와 목적에 맞는 효과를 선택하세요. 진지한 다큐멘터리에
                      헬륨 음성을 사용하거나, 코미디에 악마 음성을 쓰는 것은(의도적인
                      경우가 아니라면) 적절하지 않습니다.
                    </span>
                  </div>
                </li>
                <li className='flex items-start gap-3'>
                  <span className='text-teal-600 dark:text-teal-400 font-bold mt-1'>•</span>
                  <div>
                    <strong className='text-gray-900 dark:text-white'>미묘함의 힘:</strong>
                    <span className='text-gray-700 dark:text-gray-300'>
                      {' '}
                      때로는 작은 변화가 큰 변화보다 효과적입니다. 피치를 1-2 semitone만
                      바꿔도 분위기가 달라질 수 있습니다.
                    </span>
                  </div>
                </li>
                <li className='flex items-start gap-3'>
                  <span className='text-teal-600 dark:text-teal-400 font-bold mt-1'>•</span>
                  <div>
                    <strong className='text-gray-900 dark:text-white'>A/B 테스트:</strong>
                    <span className='text-gray-700 dark:text-gray-300'>
                      {' '}
                      원본과 변조된 버전을 번갈아 들으며 비교하세요. 여러 버전을 만들어 가장
                      적합한 것을 선택하는 것이 좋습니다.
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            {/* 창의적인 활용 사례 */}
            <div className='mb-6'>
              <h3 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white'>
                창의적인 활용 사례
              </h3>

              <div className='space-y-3'>
                <div className='p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    스토리텔링 강화
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    팟캐스트나 오디오 드라마에서 음성 변조를 사용하면 한 명의 내레이터가
                    여러 캐릭터를 연기할 수 있습니다. 각 캐릭터마다 고유한 음성 특성을
                    부여하면 청취자가 누가 말하는지 쉽게 구별할 수 있습니다.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    교육 콘텐츠
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    어린이 교육 영상에서 만화 캐릭터나 동물 목소리를 사용하면 집중도와
                    흥미를 높일 수 있습니다. 역사 속 인물을 재현할 때도 시대에 맞는 음성
                    효과(오래된 라디오 느낌 등)를 추가하면 몰입감이 높아집니다.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    음악 프로덕션
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    힙합, 일렉트로닉, 실험 음악에서 음성 변조는 중요한 창작 도구입니다.
                    Auto-Tune, Vocoder, Talkbox 등의 효과는 이미 많은 히트곡에서 사용되고
                    있습니다.
                  </p>
                </div>

                <div className='p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800'>
                  <h4 className='font-semibold text-gray-900 dark:text-white mb-2'>
                    밈과 바이럴 콘텐츠
                  </h4>
                  <p className='text-gray-700 dark:text-gray-300 text-sm'>
                    유머러스한 음성 변조는 소셜 미디어에서 빠르게 확산됩니다. TikTok,
                    Instagram Reels, YouTube Shorts 등에서 재미있는 음성 효과는 조회수를
                    크게 높일 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 주의사항과 법적 고려사항 */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2'>
              <AlertTriangle className='w-6 h-6 text-orange-500' />
              주의사항과 법적 고려사항
            </h2>

            <div className='space-y-4'>
              <div className='p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  저작권
                </h3>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  유명인의 목소리를 모방하거나 변조하여 사용할 때는 주의가 필요합니다.
                  특히 상업적 목적이라면 초상권과 저작권 문제가 발생할 수 있습니다.
                </p>
              </div>

              <div className='p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  딥페이크 윤리
                </h3>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  AI 기반 음성 합성 기술의 발전으로 누구의 목소리든 재현할 수 있게
                  되었지만, 악의적 사용은 법적 문제를 일으킬 수 있습니다. 항상 윤리적으로
                  사용해야 합니다.
                </p>
              </div>

              <div className='p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  프라이버시
                </h3>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  실제 사람의 음성을 변조하여 사용할 때는 당사자의 동의를 받아야 합니다.
                  특히 인터뷰나 증언의 경우 명확한 허가가 필요합니다.
                </p>
              </div>

              <div className='p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  과용 주의
                </h3>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  너무 많은 효과를 동시에 사용하면 소리가 지저분해지고 청취 피로도가
                  높아집니다. '적을수록 좋다(Less is more)' 원칙을 기억하세요.
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
              음성 변조는 오디오 콘텐츠에 무한한 가능성을 제공합니다. 로봇부터 외계인까지,
              어린아이부터 노인까지, 상상할 수 있는 모든 목소리를 만들어낼 수 있습니다.
              중요한 것은 기술보다 창의성입니다.
            </p>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
              이 글에서 소개한 기본 원리와 기법들을 바탕으로, 여러분만의 독특한 음성 효과를
              실험해보세요. 처음에는 프리셋을 사용하다가 점차 파라미터를 직접 조절하며
              자신만의 시그니처 사운드를 개발할 수 있습니다.
            </p>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
              음성 변조는 단순히 기술적인 트릭이 아니라, 청취자에게 새로운 경험을 선사하는
              예술입니다. 지금 바로 마이크를 켜고 첫 실험을 시작해보세요. 여러분의 목소리가
              어떤 놀라운 변신을 할지 기대됩니다!
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

