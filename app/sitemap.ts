import { MetadataRoute } from 'next';

/**
 * sitemap.xml 파일 생성
 * 검색 엔진에 사이트 구조를 알려주어 인덱싱을 돕습니다.
 * Next.js는 이 파일을 자동으로 /sitemap.xml 경로에서 제공합니다.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // 환경 변수에서 사이트 URL 가져오기, 없으면 기본값 사용
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://freerecord.com';
  const currentDate = new Date();

  // 모든 페이지 목록 - 우선순위와 업데이트 빈도 설정
  const routes: MetadataRoute.Sitemap = [
    // 홈페이지 - 최우선
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    // 주요 기능 페이지들 - 높은 우선순위
    {
      url: `${baseUrl}/record`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/voice-changer`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/change-volume`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/change-speed`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/change-pitch`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/equalizer`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // 보조 기능 페이지들 - 중간 우선순위
    {
      url: `${baseUrl}/reverse`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/trim`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/audio-joiner`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    // 콘텐츠 페이지
    {
      url: `${baseUrl}/blogs`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // 법적 페이지들 - 낮은 우선순위
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  return routes;
}
