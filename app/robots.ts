import { MetadataRoute } from 'next';

/**
 * robots.txt 파일 생성
 * 검색 엔진 크롤러에게 사이트 크롤링 규칙을 제공합니다.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://freerecord.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/', // API 경로는 크롤링 제외
          '/_next/', // Next.js 내부 파일 제외
          '/admin/', // 관리자 페이지가 있다면 제외
        ],
      },
      // Google 봇에 대한 특별 규칙
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

