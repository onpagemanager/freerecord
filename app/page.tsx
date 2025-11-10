'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Mic,
  Volume2,
  Gauge,
  Music,
  Sliders,
  RotateCcw,
  Scissors,
  Merge,
  Sparkles,
  PlayCircle,
  Download,
} from 'lucide-react';

export default function Home() {
  // 주요 기능 목록
  const mainFeatures = [
    {
      icon: Mic,
      title: '고품질 녹음',
      description: '브라우저에서 바로 고품질 오디오를 녹음하세요',
      href: '/record',
      color: 'text-blue-500',
    },
    {
      icon: Volume2,
      title: '음량 조절',
      description: '오디오의 음량을 쉽게 조절하고 최적화하세요',
      href: '/change-volume',
      color: 'text-green-500',
    },
    {
      icon: Gauge,
      title: '속도 변경',
      description: '재생 속도를 조절하여 학습이나 편집에 활용하세요',
      href: '/change-speed',
      color: 'text-purple-500',
    },
    {
      icon: Music,
      title: '음정 변경',
      description: '음정을 조절하여 다양한 효과를 만들어보세요',
      href: '/change-pitch',
      color: 'text-pink-500',
    },
    {
      icon: Sliders,
      title: '이퀄라이저',
      description: '음질을 세밀하게 조절하고 최적화하세요',
      href: '/equalizer',
      color: 'text-orange-500',
    },
    {
      icon: RotateCcw,
      title: '역재생',
      description: '오디오를 역방향으로 재생하여 독특한 효과를 만들어보세요',
      href: '/reverse',
      color: 'text-red-500',
    },
    {
      icon: Scissors,
      title: '오디오 다듬기',
      description: '불필요한 부분을 제거하고 원하는 구간만 추출하세요',
      href: '/trim',
      color: 'text-indigo-500',
    },
    {
      icon: Merge,
      title: '오디오 병합',
      description: '여러 오디오 파일을 하나로 합치세요',
      href: '/audio-joiner',
      color: 'text-teal-500',
    },
  ];

  // 사용 예시 목록
  const useCases = [
    {
      title: '음성 메모',
      description: '중요한 아이디어나 메모를 빠르게 녹음하세요',
    },
    {
      title: '팟캐스트 제작',
      description: '간단한 팟캐스트 에피소드를 제작하고 편집하세요',
    },
    {
      title: '음악 편집',
      description: '음악 파일을 편집하고 다양한 효과를 적용하세요',
    },
    {
      title: '학습 도구',
      description: '강의 녹음을 속도 조절하여 효율적으로 학습하세요',
    },
  ];

  return (
    <div className='min-h-screen'>
      {/* 히어로 섹션 */}
      <section className='relative overflow-hidden bg-linear-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-32 pb-20'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-4xl mx-auto text-center'>
            {/* 메인 타이틀 */}
            <div className='inline-flex items-center gap-2 px-4 py-2 mb-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full border border-gray-200 dark:border-gray-700'>
              <Sparkles className='w-4 h-4 text-purple-500' />
              <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                무료 온라인 오디오 도구
              </span>
            </div>

            <h1 className='text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'>
              음성을 자유롭게
              <br />
              녹음하고 편집하세요
            </h1>

            <p className='text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed'>
              브라우저에서 바로 사용할 수 있는 강력한 오디오 녹음 및 편집 도구.
              <br />
              설치 없이 바로 시작하세요.
            </p>

            {/* CTA 버튼들 */}
            <div className='flex flex-col sm:flex-row items-center justify-center gap-4 mb-12'>
              <Button
                asChild
                size='lg'
                className='text-lg px-8 py-6 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200'
              >
                <Link href='/record'>
                  <PlayCircle className='w-5 h-5 mr-2' />
                  지금 시작하기
                </Link>
              </Button>
              <Button
                asChild
                size='lg'
                variant='outline'
                className='text-lg px-8 py-6 border-2 dark:border-gray-700'
              >
                <Link href='/blogs'>더 알아보기</Link>
              </Button>
            </div>

            {/* 특징 요약 */}
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16'>
              <div className='text-center'>
                <div className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
                  100%
                </div>
                <div className='text-sm text-gray-600 dark:text-gray-400'>
                  무료
                </div>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
                  설치 불필요
                </div>
                <div className='text-sm text-gray-600 dark:text-gray-400'>
                  브라우저에서 바로
                </div>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
                  빠른 처리
                </div>
                <div className='text-sm text-gray-600 dark:text-gray-400'>
                  실시간 편집
                </div>
              </div>
              <div className='text-center'>
                <div className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
                  프라이버시
                </div>
                <div className='text-sm text-gray-600 dark:text-gray-400'>
                  로컬 처리
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 배경 장식 요소 */}
        <div className='absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none'>
          <div className='absolute top-20 left-10 w-72 h-72 bg-blue-300/20 rounded-full blur-3xl'></div>
          <div className='absolute bottom-20 right-10 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl'></div>
        </div>
      </section>

      {/* 주요 기능 섹션 */}
      <section className='py-20 bg-white dark:bg-gray-950'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white'>
              강력한 기능들
            </h2>
            <p className='text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
              다양한 오디오 편집 도구를 한 곳에서 만나보세요
            </p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {mainFeatures.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <Link
                  key={index}
                  href={feature.href}
                  className='group relative p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1'
                >
                  <div
                    className={`w-12 h-12 mb-4 ${feature.color} flex items-center justify-center rounded-lg bg-gray-50 dark:bg-gray-800 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className='w-6 h-6' />
                  </div>
                  <h3 className='text-xl font-semibold mb-2 text-gray-900 dark:text-white'>
                    {feature.title}
                  </h3>
                  <p className='text-gray-600 dark:text-gray-400 text-sm leading-relaxed'>
                    {feature.description}
                  </p>
                  <div className='mt-4 text-purple-600 dark:text-purple-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                    사용하기 →
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 사용 예시 섹션 */}
      <section className='py-20 bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-4xl sm:text-5xl font-bold mb-4 text-gray-900 dark:text-white'>
              다양한 활용 방법
            </h2>
            <p className='text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto'>
              일상에서 바로 활용할 수 있는 다양한 사용 사례
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {useCases.map((useCase, index) => (
              <div
                key={index}
                className='p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300'
              >
                <h3 className='text-xl font-semibold mb-3 text-gray-900 dark:text-white'>
                  {useCase.title}
                </h3>
                <p className='text-gray-600 dark:text-gray-400'>
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA 섹션 */}
      <section className='py-20 bg-linear-to-r from-blue-600 mb-20 rounded-xl via-purple-600 to-pink-600'>
        <div className='mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='max-w-3xl mx-auto text-center'>
            <h2 className='text-4xl sm:text-5xl font-bold mb-6 text-white'>
              지금 바로 시작하세요
            </h2>
            <p className='text-xl text-white/90 mb-8'>
              설치나 회원가입 없이 바로 사용할 수 있습니다.
              <br />
              브라우저에서 오디오를 녹음하고 편집해보세요.
            </p>
            <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
              <Button
                asChild
                size='lg'
                variant='secondary'
                className='text-lg px-8 py-6 bg-white text-purple-600 hover:bg-gray-100 shadow-lg'
              >
                <Link href='/record'>
                  <Mic className='w-5 h-5 mr-2' />
                  녹음 시작하기
                </Link>
              </Button>
              <Button
                asChild
                size='lg'
                variant='ghost'
                className='text-lg px-8 py-6 border-2 border-white text-white hover:bg-white/10'
              >
                <Link href='/blogs'>
                  <Download className='w-5 h-5 mr-2' />
                  사용 가이드 보기
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
