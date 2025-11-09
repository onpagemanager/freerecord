'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';

const menuItems = [
  { name: 'record', href: '/record' },
  { name: 'trim', href: '/trim' },
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
    <header className='fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800'>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-20'>
          {/* 로고 */}
          <Link href='/' className='flex items-center space-x-1'>
            <Image
              src='/logo_w.png'
              alt='freerecorder'
              width={200}
              height={80}
            />
          </Link>
          <nav className='hidden lg:flex items-center space-x-8'>
            {menuItems.map(item => (
              <Link
                key={item.name}
                href={item.href}
                className={`hover:text-white font-medium transition-colors duration-200 relative group ${
                  isScrolled ? 'text-gray-200/60' : 'text-gray-200'
                }`}
              >
                {item.name}
                <span className='absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-200'></span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
