import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

/**
 * sitemap.xml 파일 생성
 * - Next.js App Router 의 내장 sitemap 기능 사용
 * - 정적 페이지 + Supabase 블로그 글 상세 페이지를 모두 포함
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 환경 변수에서 사이트 URL 가져오기, 없으면 기본값 사용
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://freerecord.com';
  const currentDate = new Date();

  // 1. 정적 페이지 경로들
  const staticRoutes: MetadataRoute.Sitemap = [
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
    // 블로그 리스트 페이지
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

  // 2. Supabase 에서 블로그 글 상세 페이지 경로들 가져오기
  let blogRoutes: MetadataRoute.Sitemap = [];

  try {
    // blog_freerecord 테이블에서 id, created_at 만 조회 (가볍게)
    const { data, error } = await supabase
      .from('blog_freerecord')
      .select('id, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('sitemap - 블로그 데이터 조회 오류:', error);
    } else if (data && Array.isArray(data)) {
      blogRoutes = data
        .filter(item => item && (item as any).id != null)
        .map(item => {
          const typedItem = item as { id: number | string; created_at?: string };

          // created_at 이 있으면 해당 날짜, 없으면 현재 날짜 사용
          const lastModifiedDate = typedItem.created_at
            ? new Date(typedItem.created_at)
            : currentDate;

          return {
            url: `${baseUrl}/blogs/${typedItem.id}`,
            lastModified: lastModifiedDate,
            changeFrequency: 'weekly' as const,
            priority: 0.6,
          };
        });
    }
  } catch (err) {
    // 예기치 않은 오류 방어
    console.error('sitemap - 블로그 경로 생성 중 예외 발생:', err);
  }

  // 3. 정적 경로 + 블로그 상세 경로 합쳐서 반환
  return [...staticRoutes, ...blogRoutes];
}
