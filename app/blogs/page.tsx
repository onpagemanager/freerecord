'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Clock,
  Heart,
  MessageCircle,
  Eye,
  TrendingUp,
  Star,
  Filter,
  Award,
  Flame,
  Newspaper,
  Loader2,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// 탭 타입 정의
type TabType = 'recent' | 'popular' | 'trending' | 'featured';

// 게시글 데이터 타입 정의
interface Post {
  id: number;
  title: string;
  author: string;
  authorAvatar?: string;
  content: string;
  date: string;
  views: number;
  likes: number;
  comments: number;
  category: string;
  tags: string[];
  isPinned?: boolean;
}

export default function Blogs() {
  const [activeTab, setActiveTab] = useState<TabType>('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Supabase에서 블로그 데이터 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // blog_freerecord 테이블에서 데이터 조회
        // 테이블 구조에 맞게 필드명을 조정해주세요
        const { data, error: fetchError } = await supabase
          .from('blog_freerecord')
          .select('*')
          .order('created_at', { ascending: false }); // 최신순으로 정렬

        if (fetchError) {
          throw fetchError;
        }

        // Supabase 데이터를 Post 인터페이스에 맞게 변환
        // 실제 테이블 구조에 맞게 필드 매핑을 조정해주세요
        const transformedPosts: Post[] = (data || []).map((item: any) => ({
          id: item.id || item.blog_id,
          title: item.title || '',
          author: item.author || item.author_name || '작성자',
          authorAvatar: item.author_avatar || item.author_avatar_url,
          content: item.content || item.description || item.excerpt || '',
          date:
            item.created_at ||
            item.date ||
            item.published_at ||
            new Date().toISOString(),
          views: item.views || item.view_count || 0,
          likes: item.likes || item.like_count || 0,
          comments: item.comments || item.comment_count || 0,
          category: item.category || item.category_name || '기타',
          tags: Array.isArray(item.tags)
            ? item.tags
            : typeof item.tags === 'string'
            ? item.tags.split(',').map((tag: string) => tag.trim())
            : [],
          isPinned: item.is_pinned || item.pinned || false,
        }));

        setPosts(transformedPosts);
      } catch (err: any) {
        console.error('블로그 데이터 로딩 오류:', err);
        setError(
          err.message || '블로그 데이터를 불러오는 중 오류가 발생했습니다.'
        );
        setPosts([]); // 에러 발생 시 빈 배열로 설정
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // 탭별 게시글 필터링
  const getFilteredPosts = () => {
    let filtered = [...posts];

    // 검색어 필터링
    if (searchQuery) {
      filtered = filtered.filter(
        post =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.tags.some(tag =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // 카테고리 필터링
    if (selectedCategory !== '전체') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // 탭별 정렬
    switch (activeTab) {
      case 'recent':
        // 최신순 (고정글 먼저, 그 다음 날짜순)
        filtered.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        break;
      case 'popular':
        // 인기순 (조회수 + 좋아요)
        filtered.sort((a, b) => {
          const scoreA = a.views + a.likes * 10;
          const scoreB = b.views + b.likes * 10;
          return scoreB - scoreA;
        });
        break;
      case 'trending':
        // 트렌딩 (최근 조회수 증가율)
        filtered.sort((a, b) => {
          const trendA = a.views + a.likes * 5 + a.comments * 3;
          const trendB = b.views + b.likes * 5 + b.comments * 3;
          return trendB - trendA;
        });
        break;
      case 'featured':
        // 추천 (고정글 + 높은 좋아요)
        filtered = filtered.filter(post => post.isPinned || post.likes > 80);
        filtered.sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          return b.likes - a.likes;
        });
        break;
    }

    return filtered;
  };

  const filteredPosts = getFilteredPosts();

  // 카테고리 목록 추출
  const categories = [
    '전체',
    ...Array.from(new Set(posts.map(post => post.category))),
  ];

  // 날짜 포맷팅 함수
  // - Supabase에서 넘어오는 created_at(UTC) 기준으로
  //   한국 시간(KST)에서의 오늘/어제/며칠 전을 자연스럽게 보여주기 위한 함수
  const formatDate = (dateString: string) => {
    // 1) 안전하게 Date 객체로 변환
    const targetDate = new Date(dateString);

    // 잘못된 날짜 문자열인 경우 그대로 반환하여 에러 방지
    if (Number.isNaN(targetDate.getTime())) {
      return dateString;
    }

    const now = new Date();

    // 2) 시/분/초는 버리고 "날짜만" 비교 (타임존, 시간 차이로 인한 오표기 방지)
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const startOfTarget = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate()
    );

    const diffTime = startOfToday.getTime() - startOfTarget.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // 3) 일수 차이에 따라 한국어로 표현
    if (diffDays === 0) return '오늘';
    if (diffDays === 1) return '어제';
    if (diffDays > 1 && diffDays < 7) return `${diffDays}일 전`;
    if (diffDays >= 7 && diffDays < 30)
      return `${Math.floor(diffDays / 7)}주 전`;

    // 30일 이상 차이 나면 풀 날짜로 표시
    return targetDate.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className='container py-8'>
      {/* 헤더 섹션 */}
      <div className='mb-8'>
        <h1 className='sr-only'>freerecord blogs</h1>
      </div>

      {/* 검색 및 필터 섹션 */}
      <div className='mb-6 flex flex-col sm:flex-row gap-4'>
        {/* 검색 바 */}
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
          <input
            type='text'
            placeholder='게시글 검색...'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className='w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 focus:border-transparent transition-all'
          />
        </div>

        {/* 카테고리 필터 */}
        <div className='relative'>
          <Filter className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className='pl-10 pr-8 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 focus:border-transparent transition-all appearance-none cursor-pointer'
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 메인 컨텐츠 영역 - 2컬럼 레이아웃 */}
      <div className='flex flex-col lg:flex-row gap-6'>
        {/* 왼쪽 영역: 블로그 게시글 목록 */}
        <div className='flex-1 lg:w-2/3'>
          {/* 탭 메뉴 */}
          <div className='mb-6 border-b border-gray-200 dark:border-gray-700'>
            <div className='flex space-x-1 overflow-x-auto'>
              <button
                onClick={() => setActiveTab('recent')}
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors relative ${
                  activeTab === 'recent'
                    ? 'text-purple-600 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                최신
                {activeTab === 'recent' && (
                  <span className='absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400'></span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('popular')}
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors relative ${
                  activeTab === 'popular'
                    ? 'text-purple-600 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                인기
                {activeTab === 'popular' && (
                  <span className='absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400'></span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('trending')}
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors relative ${
                  activeTab === 'trending'
                    ? 'text-purple-600 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                트렌딩
                {activeTab === 'trending' && (
                  <span className='absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400'></span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('featured')}
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap transition-colors relative ${
                  activeTab === 'featured'
                    ? 'text-purple-600 dark:text-purple-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                추천
                {activeTab === 'featured' && (
                  <span className='absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600 dark:bg-purple-400'></span>
                )}
              </button>
            </div>
          </div>

          {/* 게시글 목록 */}
          <div className='flex flex-col gap-y-4'>
            {isLoading ? (
              <div className='text-center py-12'>
                <Loader2 className='w-8 h-8 animate-spin text-purple-600 dark:text-purple-400 mx-auto mb-4' />
                <p className='text-gray-500 dark:text-gray-400 text-lg'>
                  게시글을 불러오는 중...
                </p>
              </div>
            ) : error ? (
              <div className='text-center py-12'>
                <p className='text-red-500 dark:text-red-400 text-lg mb-2'>
                  오류가 발생했습니다
                </p>
                <p className='text-gray-500 dark:text-gray-400 text-sm'>
                  {error}
                </p>
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className='text-center py-12'>
                <p className='text-gray-500 dark:text-gray-400 text-lg'>
                  검색 결과가 없습니다. 다른 검색어를 시도해보세요.
                </p>
              </div>
            ) : (
              filteredPosts.map(post => (
                <Link key={post.id} href={`/blogs/${post.id}`}>
                  <article className='group p-6 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-purple-300 dark:hover:border-purple-700 transition-all duration-300 hover:shadow-lg cursor-pointer'>
                    <div className='flex items-start justify-between gap-4'>
                      <div className='flex-1 min-w-0'>
                        {/* 제목 및 고정 표시 */}
                        <div className='flex items-center gap-2 mb-2'>
                          {post.isPinned && (
                            <Star className='w-4 h-4 text-yellow-500 fill-yellow-500 shrink-0' />
                          )}
                          <h2 className='text-xl font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2'>
                            {post.title}
                          </h2>
                        </div>

                        {/* 내용 미리보기 */}
                        <p className='text-gray-600 dark:text-gray-400 mb-4 line-clamp-2'>
                          {post.content}
                        </p>

                        {/* 메타 정보 */}
                        <div className='flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400'>
                          {/* 작성자 */}
                          <div className='flex items-center gap-2'>
                            <span className='font-medium text-gray-700 dark:text-gray-300'>
                              작성자 : admin
                            </span>
                          </div>

                          {/* 날짜 */}
                          <div className='flex items-center gap-1'>
                            <Clock className='w-4 h-4' />
                            <span>{formatDate(post.date)}</span>
                          </div>

                          {/* 조회수 */}
                          <div className='flex items-center gap-1'>
                            <Eye className='w-4 h-4' />
                            <span>{post.views.toLocaleString()}</span>
                          </div>

                          {/* 좋아요 */}
                          <div className='flex items-center gap-1'>
                            <Heart className='w-4 h-4' />
                            <span>{post.likes}</span>
                          </div>

                          {/* 댓글 */}
                          <div className='flex items-center gap-1'>
                            <MessageCircle className='w-4 h-4' />
                            <span>{post.comments}</span>
                          </div>

                          {/* 카테고리 */}
                          <span className='px-2 py-1 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium'>
                            {post.category}
                          </span>
                        </div>

                        {/* 태그 */}
                        {post.tags.length > 0 && (
                          <div className='flex flex-wrap gap-2 mt-3'>
                            {post.tags.map((tag, index) => (
                              <span
                                key={index}
                                className='px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs'
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* 트렌딩 아이콘 (트렌딩 탭일 때만 표시) */}
                      {activeTab === 'trending' &&
                        (post.views > 1000 || post.likes > 100) && (
                          <div className='shrink-0'>
                            <TrendingUp className='w-6 h-6 text-orange-500' />
                          </div>
                        )}
                    </div>
                  </article>
                </Link>
              ))
            )}
          </div>

          {/* 페이지네이션 */}
          {filteredPosts.length > 0 && (
            <div className='mt-8 flex justify-center'>
              <div className='flex gap-2'>
                <button className='px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
                  이전
                </button>
                <button className='px-4 py-2 rounded-lg bg-purple-600 dark:bg-purple-500 text-white'>
                  1
                </button>
                <button className='px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'>
                  2
                </button>
                <button className='px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'>
                  다음
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 오른쪽 영역: 랭킹/뉴스 사이드바 */}
        <aside className='w-full lg:w-1/3 space-y-6'>
          {/* 인기 게시글 랭킹 */}
          <div className='bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6'>
            <div className='flex items-center gap-2 mb-4'>
              <Award className='w-5 h-5 text-yellow-500' />
              <h2 className='text-lg font-bold text-gray-900 dark:text-white'>
                인기 게시글
              </h2>
            </div>
            <div className='space-y-3'>
              {[...posts]
                .sort((a, b) => {
                  const scoreA = a.views + a.likes * 10 + a.comments * 5;
                  const scoreB = b.views + b.likes * 10 + b.comments * 5;
                  return scoreB - scoreA;
                })
                .slice(0, 5)
                .map((post, index) => (
                  <Link
                    key={post.id}
                    href={`/blogs/${post.id}`}
                    className='flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer group'
                  >
                    {/* 순위 */}
                    <div
                      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index === 0
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                          : index === 1
                          ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400'
                          : index === 2
                          ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-500'
                      }`}
                    >
                      {index + 1}
                    </div>
                    {/* 제목 및 정보 */}
                    <div className='flex-1 min-w-0'>
                      <h3 className='text-sm font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2 mb-1'>
                        {post.title}
                      </h3>
                      <div className='flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400'>
                        <span>{post.author}</span>
                        <span>•</span>
                        <span>{formatDate(post.date)}</span>
                      </div>
                      <div className='flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400'>
                        <div className='flex items-center gap-1'>
                          <Eye className='w-3 h-3' />
                          <span>{post.views.toLocaleString()}</span>
                        </div>
                        <div className='flex items-center gap-1'>
                          <Heart className='w-3 h-3' />
                          <span>{post.likes}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>

          {/* 트렌딩 뉴스 */}
          <div className='bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6'>
            <div className='flex items-center gap-2 mb-4'>
              <Flame className='w-5 h-5 text-orange-500' />
              <h2 className='text-lg font-bold text-gray-900 dark:text-white'>
                트렌딩 뉴스
              </h2>
            </div>
            <div className='space-y-4'>
              {[...posts]
                .sort((a, b) => {
                  const trendA = a.views + a.likes * 5 + a.comments * 3;
                  const trendB = b.views + b.likes * 5 + b.comments * 3;
                  return trendB - trendA;
                })
                .slice(0, 4)
                .map(post => (
                  <Link
                    key={post.id}
                    href={`/blogs/${post.id}`}
                    className='group cursor-pointer border-b border-gray-200 dark:border-gray-800 last:border-0 pb-4 last:pb-0 block'
                  >
                    <div className='flex items-start gap-3'>
                      <TrendingUp className='w-4 h-4 text-orange-500 mt-1 shrink-0' />
                      <div className='flex-1 min-w-0'>
                        <h3 className='text-sm font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2 mb-2'>
                          {post.title}
                        </h3>
                        <div className='flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400'>
                          <span>{formatDate(post.date)}</span>
                          <span>•</span>
                          <span className='px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'>
                            {post.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            </div>
          </div>

          {/* 최신 뉴스 */}
          <div className='bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6'>
            <div className='flex items-center gap-2 mb-4'>
              <Newspaper className='w-5 h-5 text-blue-500' />
              <h2 className='text-lg font-bold text-gray-900 dark:text-white'>
                최신 뉴스
              </h2>
            </div>
            <div className='space-y-4'>
              {[...posts]
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .slice(0, 4)
                .map(post => (
                  <Link
                    key={post.id}
                    href={`/blogs/${post.id}`}
                    className='group cursor-pointer border-b border-gray-200 dark:border-gray-800 last:border-0 pb-4 last:pb-0 block'
                  >
                    <h3 className='text-sm font-semibold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2 mb-2'>
                      {post.title}
                    </h3>
                    <div className='flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400'>
                      <Clock className='w-3 h-3' />
                      <span>{formatDate(post.date)}</span>
                      <span>•</span>
                      <span>{post.author}</span>
                    </div>
                  </Link>
                ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
