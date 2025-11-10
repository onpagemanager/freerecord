'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const menuItems = [
  { name: '녹음기', href: '/record' },
  { name: '음성변조', href: '/voice-changer' },
  { name: '음량변경', href: '/change-volume' },
  { name: '속도변경', href: '/change-speed' },
  { name: '음정변경', href: '/change-pitch' },
  { name: '이퀄라이저', href: '/equalizer' },
  { name: '역재생', href: '/reverse' },
  { name: '오디오 다듬기', href: '/trim' },
  { name: '오디오 병합', href: '/audio-joiner' },
  { name: '블로그', href: '/blogs' },
];

// Header 컴포넌트 - 모든 페이지 상단에 표시
export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  // 스크롤 이벤트 감지
  useEffect(() => {
    const handleScroll = () => {
      // 스크롤 위치가 50px 이상이면 isScrolled를 true로 설정
      setIsScrolled(window.scrollY > 50);
    };

    // 초기 스크롤 위치 확인
    handleScroll();

    // 스크롤 이벤트 리스너 추가
    window.addEventListener('scroll', handleScroll);

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header className='sticky top-0 left-0 right-0 z-50 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800'>
      <div className='w-full px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center h-20'>
          {/* 로고 - 왼쪽 */}
          <Link href='/' className='flex items-center space-x-1 shrink-0'>
            <Image
              src='/logo.png'
              alt='freerecorder'
              width={200}
              height={80}
              className='dark:invert'
            />
          </Link>

          {/* 메뉴 - 중앙 */}
          <nav className='hidden lg:flex items-center justify-center flex-1 space-x-8'>
            {menuItems.map(item => (
              <Link
                key={item.name}
                href={item.href}
                className={`hover:text-gray-900 dark:hover:text-white font-medium transition-colors duration-200 relative group ${
                  isScrolled
                    ? 'text-gray-600 dark:text-gray-400'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {item.name}
                <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 dark:bg-white group-hover:w-full transition-all duration-200'></span>
              </Link>
            ))}
          </nav>

          {/* 다크모드 토글 - 오른쪽 */}
          <div className='shrink-0 ml-auto'>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
