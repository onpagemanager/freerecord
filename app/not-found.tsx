import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BackButton } from './back-button';

export default function NotFound() {
  return (
    <div className='min-h-[60vh] flex items-center justify-center px-4 sm:px-6 lg:px-8'>
      <div className='max-w-2xl mx-auto text-center'>
        {/* 404 숫자 */}
        <div className='mb-8'>
          <h1 className='text-9xl font-bold text-gray-200 dark:text-gray-800 select-none'>
            404
          </h1>
        </div>

        {/* 메시지 */}
        <div className='mb-12'>
          <h2 className='text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white'>
            페이지를 찾을 수 없습니다
          </h2>
          <p className='text-lg text-gray-600 dark:text-gray-400 mb-2'>
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </p>
          <p className='text-sm text-gray-500 dark:text-gray-500'>
            URL을 다시 확인해주시거나 아래 버튼을 통해 홈으로 돌아가세요.
          </p>
        </div>

        {/* 액션 버튼 */}
        <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
          <Button asChild size='lg' className='w-full sm:w-auto'>
            <Link href='/'>
              <Home className='w-4 h-4 mr-2' />
              홈으로 돌아가기
            </Link>
          </Button>
          <BackButton />
        </div>

        {/* 빠른 링크 */}
        <div className='mt-16 pt-8 border-t border-gray-200 dark:border-gray-800'>
          <p className='text-sm font-medium text-gray-700 dark:text-gray-300 mb-4'>
            인기 페이지
          </p>
          <div className='flex flex-wrap items-center justify-center gap-4'>
            <Link
              href='/record'
              className='text-sm text-blue-600 dark:text-blue-400 hover:underline'
            >
              녹음기
            </Link>
            <span className='text-gray-300 dark:text-gray-700'>•</span>
            <Link
              href='/voice-changer'
              className='text-sm text-blue-600 dark:text-blue-400 hover:underline'
            >
              음성변조
            </Link>
            <span className='text-gray-300 dark:text-gray-700'>•</span>
            <Link
              href='/change-volume'
              className='text-sm text-blue-600 dark:text-blue-400 hover:underline'
            >
              음량변경
            </Link>
            <span className='text-gray-300 dark:text-gray-700'>•</span>
            <Link
              href='/change-speed'
              className='text-sm text-blue-600 dark:text-blue-400 hover:underline'
            >
              속도변경
            </Link>
            <span className='text-gray-300 dark:text-gray-700'>•</span>
            <Link
              href='/blogs'
              className='text-sm text-blue-600 dark:text-blue-400 hover:underline'
            >
              블로그
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

