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
} from 'lucide-react';
import { BackButton } from '@/app/back-button';

export default function BlogDetail() {
  // 게시글 메타 정보
  const postMeta = {
    id: 1,
    title: '오디오 편집의 기본: 음량 조절 방법',
    author: '오디오마스터',
    date: '2024-01-15',
    views: 1250,
    likes: 89,
    comments: 23,
    category: '튜토리얼',
    tags: [
      '오디오편집',
      '음량조절',
      '오디오기초',
      '편집튜토리얼',
      'DAW',
      '팟캐스트제작',
      '유튜브오디오',
      '음향편집',
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
              오디오 편집을 처음 시작하는 분들이 가장 먼저 마주하는 것이 바로
              음량 조절입니다. 겉보기엔 단순해 보이지만, 올바른 음량 조절은
              전체적인 음질과 청취 경험에 결정적인 영향을 미칩니다. 오늘은
              오디오 편집의 가장 기본이 되는 음량 조절에 대해 자세히
              알아보겠습니다.
            </p>
          </div>

          {/* 음량 조절이 중요한 이유 */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white'>
              음량 조절이 중요한 이유
            </h2>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
              음량 조절은 단순히 소리를 크게 하거나 작게 하는 것 이상의 의미를
              가집니다. 적절한 음량 조절은 다음과 같은 효과를 가져옵니다.
            </p>

            <ul className='space-y-3 mb-6'>
              <li className='flex items-start gap-3'>
                <span className='text-purple-600 dark:text-purple-400 font-bold mt-1'>
                  •
                </span>
                <div>
                  <strong className='text-gray-900 dark:text-white'>
                    청취자의 편안함:
                  </strong>
                  <span className='text-gray-700 dark:text-gray-300'>
                    {' '}
                    너무 큰 소리는 귀에 부담을 주고, 너무 작은 소리는 내용을
                    제대로 들을 수 없게 만듭니다. 적절한 음량은 청취자가
                    편안하게 콘텐츠를 즐길 수 있도록 합니다.
                  </span>
                </div>
              </li>
              <li className='flex items-start gap-3'>
                <span className='text-purple-600 dark:text-purple-400 font-bold mt-1'>
                  •
                </span>
                <div>
                  <strong className='text-gray-900 dark:text-white'>
                    전문성 향상:
                  </strong>
                  <span className='text-gray-700 dark:text-gray-300'>
                    {' '}
                    균일하고 안정적인 음량은 콘텐츠의 전문성을 높여줍니다.
                    유튜브 영상이나 팟캐스트를 들을 때 음량이 들쭉날쭉하면
                    시청자는 금방 이탈하게 됩니다.
                  </span>
                </div>
              </li>
              <li className='flex items-start gap-3'>
                <span className='text-purple-600 dark:text-purple-400 font-bold mt-1'>
                  •
                </span>
                <div>
                  <strong className='text-gray-900 dark:text-white'>
                    플랫폼 기준 충족:
                  </strong>
                  <span className='text-gray-700 dark:text-gray-300'>
                    {' '}
                    유튜브, 스포티파이, 애플 뮤직 등 각 플랫폼마다 권장하는 음량
                    기준이 있습니다. 이를 맞추지 않으면 자동으로 음량이 조정되어
                    의도한 음질이 나오지 않을 수 있습니다.
                  </span>
                </div>
              </li>
            </ul>
          </section>

          {/* 기본 용어 이해하기 */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white'>
              기본 용어 이해하기
            </h2>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
              음량 조절을 제대로 하려면 먼저 기본 용어를 알아야 합니다.
            </p>

            <div className='space-y-4'>
              <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  데시벨(dB)
                </h3>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  음량의 크기를 나타내는 단위입니다. 0dB은 최대 음량을 의미하며,
                  마이너스 값으로 표시됩니다. 예를 들어 -6dB은 최대 음량보다 6dB
                  작다는 의미입니다.
                </p>
              </div>

              <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  피크(Peak)
                </h3>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  오디오 파일에서 가장 큰 음량을 가진 순간을 말합니다. 피크가
                  0dB을 넘으면 클리핑이 발생하여 소리가 깨집니다.
                </p>
              </div>

              <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  RMS(Root Mean Square)
                </h3>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  평균 음량을 나타내는 값입니다. 피크와 달리 전체적인 음량
                  크기를 파악할 수 있습니다.
                </p>
              </div>

              <div className='p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                  LUFS(Loudness Units Full Scale)
                </h3>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  사람이 실제로 느끼는 음량의 크기를 측정하는 단위입니다. 최근
                  방송과 스트리밍 플랫폼에서 표준으로 사용됩니다.
                </p>
              </div>
            </div>
          </section>

          {/* 음량 조절의 기본 원칙 */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white'>
              음량 조절의 기본 원칙
            </h2>

            <div className='space-y-6'>
              <div>
                <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-white'>
                  1. 클리핑 방지하기
                </h3>
                <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
                  클리핑은 음량이 최대치를 넘어 소리가 왜곡되는 현상입니다. 편집
                  소프트웨어에서 파형이 빨간색으로 표시되면 클리핑이 발생한
                  것입니다. 이를 방지하려면 항상 피크 레벨을 -3dB에서 -6dB
                  사이로 유지하는 것이 좋습니다.
                </p>
              </div>

              <div>
                <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-white'>
                  2. 헤드룸 확보하기
                </h3>
                <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
                  헤드룸은 최대 음량과 실제 사용하는 음량 사이의 여유 공간을
                  말합니다. 최소 -3dB에서 -6dB 정도의 헤드룸을 두면 추가
                  작업이나 포맷 변환 시 여유가 생깁니다.
                </p>
              </div>

              <div>
                <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-white'>
                  3. 일관성 유지하기
                </h3>
                <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
                  영상이나 팟캐스트 전체에서 음량이 일관되게 유지되어야 합니다.
                  장면 전환이나 화자 변경 시 음량 차이가 크면 청취자가 불편함을
                  느낍니다.
                </p>
              </div>
            </div>
          </section>

          {/* 실전 음량 조절 방법 */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white'>
              실전 음량 조절 방법
            </h2>

            <div className='space-y-6'>
              <div>
                <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-white'>
                  게인(Gain) 조절
                </h3>
                <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
                  게인은 녹음된 오디오 신호 자체의 크기를 조절하는 것입니다.
                  대부분의 DAW(Digital Audio Workstation)에서 클립의 게인을 직접
                  조절할 수 있습니다. 녹음 음량이 너무 작거나 클 때 가장 먼저
                  사용하는 방법입니다.
                </p>
              </div>

              <div>
                <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-white'>
                  볼륨 페이더 활용
                </h3>
                <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
                  믹서 창의 볼륨 페이더를 사용하면 트랙별 음량을 세밀하게 조절할
                  수 있습니다. 페이더는 게인과 달리 출력 음량을 조절하므로, 여러
                  트랙의 밸런스를 맞출 때 유용합니다.
                </p>
              </div>

              <div>
                <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-white'>
                  노멀라이제이션(Normalization)
                </h3>
                <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
                  노멀라이제이션은 오디오의 최대 피크를 특정 레벨로 맞추는
                  기능입니다. 예를 들어 -3dB로 노멀라이즈하면 가장 큰 소리가
                  -3dB이 되도록 전체 음량을 조절합니다. 간단하지만 다이나믹
                  레인지가 변하지 않는다는 한계가 있습니다.
                </p>
              </div>

              <div>
                <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-white'>
                  컴프레서 사용
                </h3>
                <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
                  컴프레서는 큰 소리와 작은 소리의 차이를 줄여주는 도구입니다.
                  음성 녹음에서 특히 유용한데, 큰 소리는 줄이고 작은 소리는
                  상대적으로 키워서 전체적으로 균일한 음량을 만들어줍니다.
                </p>
              </div>

              <div>
                <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-white'>
                  리미터 적용
                </h3>
                <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
                  리미터는 설정한 레벨 이상으로 음량이 올라가지 못하도록
                  막아주는 도구입니다. 마스터 트랙에 리미터를 걸어두면 예상치
                  못한 클리핑을 방지할 수 있습니다.
                </p>
              </div>
            </div>
          </section>

          {/* 플랫폼별 권장 음량 */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white'>
              플랫폼별 권장 음량
            </h2>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
              각 플랫폼마다 권장하는 음량 기준이 다르므로, 업로드 전에 확인하는
              것이 좋습니다.
            </p>

            <div className='space-y-3'>
              <div className='p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>
                  유튜브
                </h3>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  -13 LUFS에서 -15 LUFS 사이를 권장합니다. 이보다 크면 자동으로
                  음량이 낮아집니다.
                </p>
              </div>

              <div className='p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>
                  스포티파이
                </h3>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  -14 LUFS를 기준으로 합니다. 이보다 큰 음원은 자동으로 볼륨이
                  줄어듭니다.
                </p>
              </div>

              <div className='p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>
                  팟캐스트
                </h3>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  -16 LUFS에서 -19 LUFS 정도가 적당합니다. 대화 중심 콘텐츠는
                  음악보다 낮은 기준을 적용합니다.
                </p>
              </div>

              <div className='p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-1'>
                  방송
                </h3>
                <p className='text-gray-700 dark:text-gray-300 text-sm'>
                  -23 LUFS가 국제 표준입니다. TV나 라디오 방송용 콘텐츠를
                  제작한다면 이 기준을 따라야 합니다.
                </p>
              </div>
            </div>
          </section>

          {/* 초보자가 흔히 하는 실수 */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white'>
              초보자가 흔히 하는 실수
            </h2>

            <ul className='space-y-3'>
              <li className='flex items-start gap-3'>
                <span className='text-red-500 font-bold mt-1'>×</span>
                <div>
                  <strong className='text-gray-900 dark:text-white'>
                    과도한 음량 증폭:
                  </strong>
                  <span className='text-gray-700 dark:text-gray-300'>
                    {' '}
                    소리가 작다고 무작정 음량을 올리면 클리핑이 발생하거나
                    노이즈가 증폭됩니다. 적절한 레벨을 유지하는 것이 중요합니다.
                  </span>
                </div>
              </li>
              <li className='flex items-start gap-3'>
                <span className='text-red-500 font-bold mt-1'>×</span>
                <div>
                  <strong className='text-gray-900 dark:text-white'>
                    미터 무시하기:
                  </strong>
                  <span className='text-gray-700 dark:text-gray-300'>
                    {' '}
                    귀로만 판단하지 말고 반드시 미터를 확인해야 합니다. 사람의
                    귀는 쉽게 속을 수 있습니다.
                  </span>
                </div>
              </li>
              <li className='flex items-start gap-3'>
                <span className='text-red-500 font-bold mt-1'>×</span>
                <div>
                  <strong className='text-gray-900 dark:text-white'>
                    헤드폰만으로 판단:
                  </strong>
                  <span className='text-gray-700 dark:text-gray-300'>
                    {' '}
                    헤드폰과 스피커에서 들리는 소리가 다를 수 있습니다. 여러
                    환경에서 테스트하는 것이 좋습니다.
                  </span>
                </div>
              </li>
              <li className='flex items-start gap-3'>
                <span className='text-red-500 font-bold mt-1'>×</span>
                <div>
                  <strong className='text-gray-900 dark:text-white'>
                    컴프레서 과용:
                  </strong>
                  <span className='text-gray-700 dark:text-gray-300'>
                    {' '}
                    컴프레서를 너무 강하게 걸면 소리가 답답하고 생동감이
                    없어집니다. 자연스러운 다이나믹을 유지하는 것이 중요합니다.
                  </span>
                </div>
              </li>
            </ul>
          </section>

          {/* 실습 팁 */}
          <section className='mb-10'>
            <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white'>
              실습 팁
            </h2>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
              음량 조절을 익히는 가장 좋은 방법은 직접 해보는 것입니다. 무료
              DAW인 Audacity나 GarageBand로 시작할 수 있습니다. 먼저 자신의
              목소리를 녹음하고, 위에서 설명한 방법들을 하나씩 적용해보세요.
            </p>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
              좋아하는 팟캐스트나 유튜브 영상의 음량을 분석해보는 것도 좋은 학습
              방법입니다. LUFS 미터 플러그인을 사용하면 전문가들이 어떤 레벨로
              작업하는지 확인할 수 있습니다.
            </p>
          </section>

          {/* 마치며 */}
          <section className='mb-10 p-6 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border border-purple-200 dark:border-purple-800'>
            <h2 className='text-2xl font-bold mb-4 text-gray-900 dark:text-white'>
              마치며
            </h2>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
              음량 조절은 오디오 편집의 기초이자 가장 중요한 요소입니다.
              처음에는 복잡해 보일 수 있지만, 기본 원칙을 이해하고 꾸준히
              연습하면 누구나 마스터할 수 있습니다. 클리핑을 방지하고, 일관성을
              유지하며, 플랫폼 기준을 준수하는 것만 기억해도 절반은 성공입니다.
            </p>
            <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
              오늘 배운 내용을 바탕으로 여러분만의 오디오 콘텐츠를 만들어보세요.
              좋은 음질은 청취자에게 전문성과 신뢰를 전달하는 첫걸음입니다.
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
