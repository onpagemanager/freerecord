import type { Metadata } from 'next';
import { Noto_Sans_KR } from 'next/font/google';
import './globals.css';
// Header와 Footer 컴포넌트 import
import Header from '../components/layouts/Header';
import Footer from '../components/layouts/Footer';
import { ThemeProvider } from '../components/theme-provider';

// NotoSansKR 폰트 설정 - 모든 페이지에 적용
const notoSansKr = Noto_Sans_KR({
  weight: ['400', '500', '600', '700'], // 다양한 굵기 지원
  subsets: ['latin'], // 한글 포함
  display: 'swap',
  preload: true,
  variable: '--font-noto-sans',
});

export const metadata: Metadata = {
  // 기본 메타데이터
  title: {
    default: '무료 음성녹음 & 편집 | Freerecord – 고음질 보이스 레코더, 속도·음정 변경 지원',
    template: '%s | Freerecord',
  },
  description:
    '무료 온라인 음성 녹음 및 편집 도구. 고음질 보이스 레코더로 음성 녹음, 속도 변경, 음정 변경, 목소리 변조 등 다양한 기능을 브라우저에서 바로 사용하세요. 설치 없이 무료로 이용 가능합니다.',
  keywords: [
    '무료 음성 녹음',
    '무료 음성 편집',
    '고음질 음성 녹음',
    '무료 음성녹음 편집 프로그램',
    '온라인 음성 녹음',
    '웹 음성 녹음기',
    '음성 속도변경',
    '음성 음정변경',
    '목소리 변조 기능',
    '목소리 바꾸기 온라인',
    'voice record free',
    'high quality voice recording',
    'audio speed change online',
    'pitch shift voice editor',
    'voice modulation software free',
    'change voice effect online',
    'free voice recorder & editor',
    'vocal pitch changer free',
    'voice speed control tool',
    'record voice online no download',
    '온라인 보이스 레코더 무료',
    '음성 효과 주기 온라인',
  ],
  authors: [{ name: 'Freerecord' }],
  creator: 'Freerecord',
  publisher: 'Freerecord',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://freerecord.com'),
  alternates: {
    canonical: '/',
    languages: {
      'ko-KR': '/',
      'en-US': '/',
    },
  },
  // Open Graph 메타데이터
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: '/',
    siteName: 'Freerecord',
    title: '무료 음성녹음 & 편집 | Freerecord – 고음질 보이스 레코더, 속도·음정 변경 지원',
    description:
      '무료 온라인 음성 녹음 및 편집 도구. 고음질 보이스 레코더로 음성 녹음, 속도 변경, 음정 변경, 목소리 변조 등 다양한 기능을 브라우저에서 바로 사용하세요.',
    images: [
      {
        url: '/og-image.jpg', // 추후 OG 이미지 추가 필요
        width: 1200,
        height: 630,
        alt: 'Freerecord - 무료 음성 녹음 및 편집 도구',
      },
    ],
  },
  // Twitter Card 메타데이터
  twitter: {
    card: 'summary_large_image',
    title: '무료 음성녹음 & 편집 | Freerecord',
    description:
      '무료 온라인 음성 녹음 및 편집 도구. 고음질 보이스 레코더로 음성 녹음, 속도 변경, 음정 변경, 목소리 변조 등 다양한 기능을 브라우저에서 바로 사용하세요.',
    images: ['/og-image.jpg'],
  },
  // 검색 엔진 최적화
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // 추가 메타데이터
  category: '음성 녹음 및 편집 도구',
  classification: '온라인 오디오 편집기',
  // Sitemap 링크 추가
  other: {
    'sitemap': `${process.env.NEXT_PUBLIC_SITE_URL || 'https://freerecord.com'}/sitemap.xml`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko' suppressHydrationWarning>
      <body className={`${notoSansKr.className} antialiased`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className='container'>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
