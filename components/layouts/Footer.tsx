'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  Globe,
  Linkedin,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Footer 링크 데이터 구조
interface FooterLink {
  name: string;
  href: string;
  external?: boolean; // 외부 링크 여부
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

// Footer 컴포넌트 - 모든 페이지 하단에 표시
export default function Footer() {
  // Footer 링크 데이터
  const footerColumns: FooterColumn[] = [
    {
      title: '제품',
      links: [
        { name: '최신 기능', href: '/blogs' },
        { name: '녹음기', href: '/record' },
        { name: '음성변조', href: '/voice-changer' },
        { name: '오디오 편집', href: '/trim' },
        { name: '이퀄라이저', href: '/equalizer' },
        { name: '모든 기능', href: '/' },
      ],
    },
    {
      title: '도구',
      links: [
        { name: '녹음기', href: '/record' },
        { name: '음량변경', href: '/change-volume' },
        { name: '속도변경', href: '/change-speed' },
        { name: '음정변경', href: '/change-pitch' },
        { name: '역재생', href: '/reverse' },
        { name: '오디오 병합', href: '/audio-joiner' },
      ],
    },
    {
      title: '도움말',
      links: [
        { name: '도움말 센터', href: '/blogs' },
        { name: '보안', href: '/blogs' },
        { name: '접근성', href: '/blogs' },
        { name: '사이트맵', href: '/blogs' },
      ],
    },
    {
      title: '회사',
      links: [
        { name: '소개', href: '/blogs' },
        { name: '뉴스', href: '/blogs' },
        { name: '채용', href: '/blogs', external: true },
        { name: '연락처', href: '/blogs' },
      ],
    },
    {
      title: '리소스',
      links: [
        { name: '블로그', href: '/blogs' },
        { name: '튜토리얼', href: '/blogs' },
        { name: '템플릿', href: '/blogs' },
        { name: 'API 문서', href: '/blogs', external: true },
      ],
    },
    {
      title: '법적 정보',
      links: [
        { name: '개인정보처리방침', href: '/privacy' },
        { name: '이용약관', href: '/terms' },
        { name: '쿠키 정책', href: '/blogs' },
        { name: '라이선스', href: '/blogs' },
      ],
    },
  ];

  // 소셜 미디어 링크
  const socialLinks = [
    { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com' },
    { name: 'Instagram', icon: Instagram, href: 'https://instagram.com' },
    { name: 'Facebook', icon: Facebook, href: 'https://facebook.com' },
    { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
    { name: 'YouTube', icon: Youtube, href: 'https://youtube.com' },
  ];

  return (
    <footer className='w-full bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800'>
      {/* 상단 섹션 - 메인 콘텐츠 */}
      <div className='w-full px-4 sm:px-6 lg:px-8 py-12'>
        <div className='max-w-7xl mx-auto'>
          <div className='grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8'>
            {/* 왼쪽 컬럼 - 로고 및 다운로드 */}
            <div className='col-span-2 md:col-span-2 lg:col-span-2'>
              <Link href='/' className='inline-block mb-4'>
                <Image
                  src='/logo.png'
                  alt='FreeRecorder'
                  width={150}
                  height={60}
                  className='dark:invert'
                />
              </Link>
              <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
                무료 온라인 오디오 도구
              </p>
              <div className='flex flex-col sm:flex-row gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  className='w-full sm:w-auto justify-center'
                  asChild
                >
                  <a href='#'>Windows</a>
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='w-full sm:w-auto justify-center'
                  asChild
                >
                  <a href='#'>Mac</a>
                </Button>
              </div>
            </div>

            {/* 나머지 컬럼들 - 링크 목록 */}
            {footerColumns.map((column, index) => (
              <div key={index} className='col-span-1'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-4 text-sm'>
                  {column.title}
                </h3>
                <ul className='space-y-3'>
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        className='text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 flex items-center gap-1 group'
                      >
                        {link.name}
                        {link.external && (
                          <ExternalLink className='w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity' />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 하단 섹션 - 언어, 소셜, 법적 정보 */}
      <div className='w-full px-4 sm:px-6 lg:px-8 py-6 border-t border-gray-200 dark:border-gray-800'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex flex-col sm:flex-row items-center justify-between gap-4'>
            {/* 왼쪽 - 언어 선택 및 소셜 미디어 */}
            <div className='flex flex-col sm:flex-row items-center gap-6'>
              {/* 언어 선택 */}
              <div className='flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400'>
                <Globe className='w-4 h-4' />
                <span>한국어 (KR)</span>
              </div>

              {/* 소셜 미디어 아이콘 */}
              <div className='flex items-center gap-4'>
                {socialLinks.map(social => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200'
                      aria-label={social.name}
                    >
                      <IconComponent className='w-5 h-5' />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* 오른쪽 - 법적 정보 및 저작권 */}
            <div className='flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-600 dark:text-gray-400'>
              <Link
                href='/privacy'
                className='hover:text-gray-900 dark:hover:text-white transition-colors duration-200'
              >
                개인정보처리방침
              </Link>
              <span className='hidden sm:inline'>•</span>
              <Link
                href='/terms'
                className='hover:text-gray-900 dark:hover:text-white transition-colors duration-200'
              >
                이용약관
              </Link>
              <span className='hidden sm:inline'>•</span>
              <span>© {new Date().getFullYear()} All Rights Reserved</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
