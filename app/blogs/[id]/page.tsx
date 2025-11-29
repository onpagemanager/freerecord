'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Clock,
  Heart,
  MessageCircle,
  Eye,
  Share2,
  BookOpen,
  Loader2,
} from 'lucide-react';
import { BackButton } from '@/app/back-button';
import { supabase } from '@/lib/supabase';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from 'next-themes';

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

export default function BlogDetail() {
  const params = useParams();
  const postId = params?.id ? Number(params.id) : null;
  const { theme, systemTheme } = useTheme();

  // 현재 테마 감지 (다크 모드인지 확인)
  const isDarkMode =
    theme === 'dark' || (theme === 'system' && systemTheme === 'dark');

  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Supabase에서 블로그 데이터 가져오기
  useEffect(() => {
    const fetchPost = async () => {
      if (!postId) {
        setError('게시글 ID가 없습니다.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // blog_freerecord 테이블에서 특정 ID의 데이터 조회
        const { data, error: fetchError } = await supabase
          .from('blog_freerecord')
          .select('*')
          .eq('id', postId)
          .single(); // 단일 행만 반환

        if (fetchError) {
          throw fetchError;
        }

        if (!data) {
          throw new Error('게시글을 찾을 수 없습니다.');
        }

        // Supabase 데이터를 Post 인터페이스에 맞게 변환
        // 실제 테이블 구조에 맞게 필드 매핑을 조정해주세요
        const transformedPost: Post = {
          id: data.id || data.blog_id,
          title: data.title || '',
          author: data.author || data.author_name || '작성자',
          authorAvatar: data.author_avatar || data.author_avatar_url,
          content: data.content || data.body || data.description || '',
          date:
            data.created_at ||
            data.date ||
            data.published_at ||
            new Date().toISOString(),
          views: data.views || data.view_count || 0,
          likes: data.likes || data.like_count || 0,
          comments: data.comments || data.comment_count || 0,
          category: data.category || data.category_name || '기타',
          tags: Array.isArray(data.tags)
            ? data.tags
            : typeof data.tags === 'string'
            ? data.tags.split(',').map((tag: string) => tag.trim())
            : [],
          isPinned: data.is_pinned || data.pinned || false,
        };

        setPost(transformedPost);

        // 조회수 증가 (선택사항 - 필요시 주석 해제)
        // await supabase
        //   .from('blog_freerecord')
        //   .update({ views: (transformedPost.views || 0) + 1 })
        //   .eq('id', postId);
      } catch (err: any) {
        console.error('블로그 데이터 로딩 오류:', err);
        setError(err.message || '게시글을 불러오는 중 오류가 발생했습니다.');
        setPost(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId]);

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // 공유 버튼 클릭 핸들러
  const handleShareClick = async () => {
    try {
      // 게시글 데이터가 없는 경우 방어 로직
      if (!post) {
        alert('게시글 정보를 불러오지 못했습니다.');
        return;
      }

      // 현재 페이지 URL 안전하게 가져오기
      const currentUrl =
        typeof window !== 'undefined' ? window.location.href : '';

      if (!currentUrl) {
        // URL 을 가져올 수 없는 경우
        alert('현재 페이지 주소를 가져올 수 없습니다.');
        return;
      }

      // Web Share API 지원 브라우저 (모바일/일부 데스크탑)
      if (typeof navigator !== 'undefined' && 'share' in navigator) {
        // navigator.share 는 일부 브라우저에서만 지원되므로 any 로 캐스팅
        const webNavigator = navigator as any;
        await webNavigator.share({
          title: post.title,
          text: post.content
            ? post.content.slice(0, 80) +
              (post.content.length > 80 ? '...' : '')
            : '블로그 글 공유',
          url: currentUrl,
        });
        return;
      }

      // Web Share API 미지원 시: 클립보드에 URL 복사
      if (typeof navigator !== 'undefined') {
        // clipboard 를 지원하는 브라우저 타입 보강
        const navigatorWithClipboard = navigator as Navigator & {
          clipboard?: {
            writeText?: (data: string) => Promise<void>;
          };
        };

        if (
          navigatorWithClipboard.clipboard &&
          navigatorWithClipboard.clipboard.writeText
        ) {
          await navigatorWithClipboard.clipboard.writeText(currentUrl);
          alert('현재 글 링크가 클립보드에 복사되었습니다.');
          return;
        }
      }

      // 매우 구형 브라우저용 fallback (document 사용 가능 여부 확인)
      if (typeof document !== 'undefined') {
        const temporaryInputElement = document.createElement('input');
        temporaryInputElement.value = currentUrl;
        document.body.appendChild(temporaryInputElement);
        temporaryInputElement.select();
        document.execCommand('copy');
        document.body.removeChild(temporaryInputElement);
        alert('현재 글 링크가 클립보드에 복사되었습니다.');
        return;
      }
    } catch (error) {
      console.error('공유 중 오류가 발생했습니다:', error);
      alert('공유 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  // 로딩 중 표시
  if (isLoading) {
    return (
      <div className='container py-8'>
        <div className='max-w-4xl mx-auto text-center py-12'>
          <Loader2 className='w-8 h-8 animate-spin text-purple-600 dark:text-purple-400 mx-auto mb-4' />
          <p className='text-gray-500 dark:text-gray-400 text-lg'>
            게시글을 불러오는 중...
          </p>
        </div>
      </div>
    );
  }

  // 에러 표시
  if (error || !post) {
    return (
      <div className='container py-8'>
        <div className='mb-6'>
          <Link
            href='/blogs'
            className='inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors'
          >
            <ArrowLeft className='w-4 h-4' />
            <span>블로그 목록으로</span>
          </Link>
        </div>
        <div className='max-w-4xl mx-auto text-center py-12'>
          <p className='text-red-500 dark:text-red-400 text-lg mb-2'>
            오류가 발생했습니다
          </p>
          <p className='text-gray-500 dark:text-gray-400 text-sm'>
            {error || '게시글을 찾을 수 없습니다.'}
          </p>
        </div>
      </div>
    );
  }

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
              {post.category}
            </span>
          </div>

          {/* 제목 */}
          <h1 className='text-3xl sm:text-4xl font-bold mb-6 text-gray-900 dark:text-white leading-tight'>
            {post.title}
          </h1>

          {/* 메타 정보 */}
          <div className='flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 pb-6'>
            {/* 작성자 */}
            <div className='flex items-center gap-2'>
              <span className='font-medium text-gray-700 dark:text-gray-300'>
                {post.author}
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

            {/* 공유 버튼 - 상단 메타 영역 */}
            <button
              type='button'
              onClick={handleShareClick}
              className='ml-auto flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'
            >
              <Share2 className='w-4 h-4' />
              <span>공유</span>
            </button>
          </div>
        </header>

        {/* 본문 내용 */}
        <article
          className='prose prose-lg dark:prose-invert max-w-none mb-12 
          prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
          prose-h1:text-3xl prose-h1:mb-4 prose-h1:mt-8 prose-h1:border-b prose-h1:border-gray-200 dark:prose-h1:border-gray-800 prose-h1:pb-2
          prose-h2:text-2xl prose-h2:mb-3 prose-h2:mt-6 prose-h2:text-gray-900 dark:prose-h2:text-white
          prose-h3:text-xl prose-h3:mb-2 prose-h3:mt-4 prose-h3:text-gray-900 dark:prose-h3:text-white
          prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
          prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold
          prose-code:text-purple-600 dark:prose-code:text-purple-400 prose-code:font-mono prose-code:text-sm
          prose-pre:bg-gray-900 dark:prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700 dark:prose-pre:border-gray-600
          prose-blockquote:border-l-4 prose-blockquote:border-purple-500 prose-blockquote:bg-purple-50 dark:prose-blockquote:bg-purple-900/20 prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:my-4 prose-blockquote:rounded-r-lg
          prose-a:text-purple-600 dark:prose-a:text-purple-400 hover:prose-a:text-purple-700 dark:hover:prose-a:text-purple-500 prose-a:font-medium prose-a:underline prose-a:underline-offset-2 prose-a:transition-colors
          prose-ul:list-disc prose-ul:pl-6 prose-ul:my-4 prose-ul:space-y-2
          prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-4 prose-ol:space-y-2
          prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-li:leading-relaxed
          prose-img:rounded-lg prose-img:shadow-xl prose-img:my-6 prose-img:mx-auto
          prose-hr:border-gray-300 dark:prose-hr:border-gray-700 prose-hr:my-8
          prose-table:w-full prose-table:my-6
          prose-th:bg-gray-100 dark:prose-th:bg-gray-800 prose-th:font-semibold
          prose-td:border-gray-200 dark:prose-td:border-gray-700'
        >
          {/* Supabase에서 가져온 본문 내용을 Markdown으로 렌더링 */}
          {post.content ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[
                rehypeRaw,
                [
                  rehypeSanitize,
                  {
                    // 허용할 태그와 속성 설정 (XSS 방지)
                    tagNames: [
                      'p',
                      'br',
                      'strong',
                      'em',
                      'u',
                      's',
                      'del',
                      'ins',
                      'h1',
                      'h2',
                      'h3',
                      'h4',
                      'h5',
                      'h6',
                      'ul',
                      'ol',
                      'li',
                      'blockquote',
                      'code',
                      'pre',
                      'a',
                      'img',
                      'table',
                      'thead',
                      'tbody',
                      'tr',
                      'th',
                      'td',
                      'hr',
                      'div',
                      'span',
                    ],
                    attributes: {
                      a: ['href', 'title', 'target', 'rel'],
                      img: ['src', 'alt', 'title', 'width', 'height'],
                      code: ['className'],
                      pre: ['className'],
                      div: ['className'],
                      span: ['className'],
                    },
                  },
                ],
              ]}
              components={{
                // 코드 블록 커스터마이징
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  const language = match ? match[1] : '';

                  return !inline && match ? (
                    <div className='my-6'>
                      <SyntaxHighlighter
                        style={isDarkMode ? vscDarkPlus : oneLight}
                        language={language}
                        PreTag='div'
                        className='rounded-lg m-0!'
                        customStyle={{
                          borderRadius: '0.5rem',
                          padding: '1.25rem',
                          fontSize: '0.875rem',
                          lineHeight: '1.5',
                        }}
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code
                      className={`${className} px-1.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-mono font-semibold`}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                // 링크 커스터마이징
                a({ node, href, children, ...props }: any) {
                  const isExternal = href?.startsWith('http');
                  return (
                    <a
                      href={href}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      className='text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-500 font-medium underline underline-offset-2 transition-colors decoration-2'
                      {...props}
                    >
                      {children}
                    </a>
                  );
                },
                // 이미지 커스터마이징
                img({ node, src, alt, ...props }: any) {
                  return (
                    <div className='my-6 flex justify-center'>
                      <img
                        src={src}
                        alt={alt}
                        className='rounded-xl shadow-2xl max-w-full h-auto border border-gray-200 dark:border-gray-700'
                        loading='lazy'
                        {...props}
                      />
                    </div>
                  );
                },
                // 테이블 커스터마이징
                table({ node, children, ...props }: any) {
                  return (
                    <div className='overflow-x-auto my-6 rounded-lg border border-gray-200 dark:border-gray-700'>
                      <table className='min-w-full border-collapse' {...props}>
                        {children}
                      </table>
                    </div>
                  );
                },
                th({ node, children, ...props }: any) {
                  return (
                    <th
                      className='border-b border-gray-300 dark:border-gray-700 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 font-semibold text-left text-gray-900 dark:text-white'
                      {...props}
                    >
                      {children}
                    </th>
                  );
                },
                td({ node, children, ...props }: any) {
                  return (
                    <td
                      className='border-b border-gray-200 dark:border-gray-800 px-4 py-3 text-gray-700 dark:text-gray-300'
                      {...props}
                    >
                      {children}
                    </td>
                  );
                },
                // 제목 커스터마이징
                h1({ node, children, ...props }: any) {
                  return (
                    <h1
                      className='text-3xl font-bold mb-4 mt-8 pb-2 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white'
                      {...props}
                    >
                      {children}
                    </h1>
                  );
                },
                h2({ node, children, ...props }: any) {
                  return (
                    <h2
                      className='text-2xl font-bold mb-3 mt-6 text-gray-900 dark:text-white'
                      {...props}
                    >
                      {children}
                    </h2>
                  );
                },
                h3({ node, children, ...props }: any) {
                  return (
                    <h3
                      className='text-xl font-semibold mb-2 mt-4 text-gray-900 dark:text-white'
                      {...props}
                    >
                      {children}
                    </h3>
                  );
                },
                // 인용문 커스터마이징
                blockquote({ node, children, ...props }: any) {
                  return (
                    <blockquote
                      className='border-l-4 border-purple-500 bg-purple-50 dark:bg-purple-900/20 py-3 px-5 my-4 rounded-r-lg text-gray-700 dark:text-gray-300 italic'
                      {...props}
                    >
                      {children}
                    </blockquote>
                  );
                },
                // 리스트 커스터마이징
                ul({ node, children, ...props }: any) {
                  return (
                    <ul
                      className='list-disc pl-6 my-4 space-y-2 text-gray-700 dark:text-gray-300'
                      {...props}
                    >
                      {children}
                    </ul>
                  );
                },
                ol({ node, children, ...props }: any) {
                  return (
                    <ol
                      className='list-decimal pl-6 my-4 space-y-2 text-gray-700 dark:text-gray-300'
                      {...props}
                    >
                      {children}
                    </ol>
                  );
                },
                li({ node, children, ...props }: any) {
                  return (
                    <li className='leading-relaxed' {...props}>
                      {children}
                    </li>
                  );
                },
                // 구분선 커스터마이징
                hr({ node, ...props }: any) {
                  return (
                    <hr
                      className='my-8 border-0 border-t border-gray-300 dark:border-gray-700'
                      {...props}
                    />
                  );
                },
              }}
            >
              {post.content}
            </ReactMarkdown>
          ) : (
            <p className='text-gray-500 dark:text-gray-400'>내용이 없습니다.</p>
          )}
        </article>

        {/* 태그 섹션 */}
        {post.tags && post.tags.length > 0 && (
          <div className='mb-8 pt-6 border-t border-gray-200 dark:border-gray-800'>
            <div className='flex flex-wrap gap-2'>
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className='px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer'
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 액션 버튼 */}
        <div className='flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200 dark:border-gray-800'>
          <div className='flex items-center gap-4'>
            <button className='flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300'>
              <Heart className='w-4 h-4' />
              <span>좋아요 {post.likes}</span>
            </button>
            <button
              type='button'
              onClick={handleShareClick}
              className='flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300'
            >
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
