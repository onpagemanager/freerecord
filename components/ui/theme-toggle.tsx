'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// 테마 토글 컴포넌트 - 다크모드/라이트모드 전환
export function ThemeToggle() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // 클라이언트 사이드에서만 마운트되도록 처리 (hydration 오류 방지)
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // 서버 사이드 렌더링 중에는 버튼만 표시
  if (!mounted) {
    return (
      <Button variant='outline' size='icon' className='w-9 h-9'>
        <Sun className='h-4 w-4' />
        <span className='sr-only'>테마 전환</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon' className='w-9 h-9'>
          {theme === 'light' ? (
            <Sun className='h-4 w-4' />
          ) : (
            <Moon className='h-4 w-4' />
          )}
          <span className='sr-only'>테마 전환</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => setTheme('light')}>
          <Sun className='mr-2 h-4 w-4' />
          <span>라이트 모드</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          <Moon className='mr-2 h-4 w-4' />
          <span>다크 모드</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          <span className='mr-2 h-4 w-4 flex items-center justify-center'>💻</span>
          <span>시스템 설정</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

