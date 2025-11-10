'use client';

import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// 이전 페이지로 돌아가는 버튼 컴포넌트
export function BackButton() {
  const handleBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  return (
    <Button
      size='lg'
      variant='outline'
      className='w-full sm:w-auto'
      onClick={handleBack}
      type='button'
    >
      <ArrowLeft className='w-4 h-4 mr-2' />
      이전 페이지
    </Button>
  );
}

