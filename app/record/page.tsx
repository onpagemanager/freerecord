'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Play, Pause, Download, Trash2 } from 'lucide-react';

// 녹음 상태 타입
type RecordingState = 'idle' | 'recording' | 'paused' | 'recorded';

export default function Record() {
  // 상태 관리
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [recordingTime, setRecordingTime] = useState(0); // 녹음 시간 (초)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null); // 녹음된 오디오
  const [audioUrl, setAudioUrl] = useState<string | null>(null); // 재생용 URL
  const [isPlaying, setIsPlaying] = useState(false); // 재생 중 여부
  const [error, setError] = useState<string | null>(null); // 에러 메시지

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 녹음 시간 포맷팅 (MM:SS)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  // 마이크 권한 요청 및 스트림 가져오기
  const getMediaStream = async (): Promise<MediaStream | null> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      return stream;
    } catch (err) {
      if (err instanceof Error) {
        if (
          err.name === 'NotAllowedError' ||
          err.name === 'PermissionDeniedError'
        ) {
          setError(
            '마이크 권한이 거부되었습니다. 브라우저 설정에서 마이크 권한을 허용해주세요.'
          );
        } else if (
          err.name === 'NotFoundError' ||
          err.name === 'DevicesNotFoundError'
        ) {
          setError(
            '마이크를 찾을 수 없습니다. 마이크가 연결되어 있는지 확인해주세요.'
          );
        } else {
          setError(
            '마이크에 접근할 수 없습니다. 브라우저를 새로고침하고 다시 시도해주세요.'
          );
        }
      }
      return null;
    }
  };

  // 녹음 시작
  const startRecording = async () => {
    setError(null);
    const stream = await getMediaStream();
    if (!stream) return;

    streamRef.current = stream;
    audioChunksRef.current = [];

    try {
      // MediaRecorder 생성 (브라우저 호환성 고려)
      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : 'audio/webm'; // 기본값

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
      });

      mediaRecorderRef.current = mediaRecorder;

      // 녹음 데이터 수집
      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // 녹음 완료 처리
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setRecordingState('recorded');
        setRecordingTime(0);

        // 스트림 정리
        stream.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      };

      // 녹음 시작
      mediaRecorder.start();
      setRecordingState('recording');

      // 타이머 시작
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      setError('녹음을 시작할 수 없습니다.');
      stream.getTracks().forEach(track => track.stop());
      console.error('Recording error:', err);
    }
  };

  // 녹음 중지
  const stopRecording = () => {
    if (mediaRecorderRef.current && recordingState === 'recording') {
      mediaRecorderRef.current.stop();
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  // 녹음 재생
  const playRecording = () => {
    if (!audioUrl) return;

    if (!audioRef.current) {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
      };
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // 녹음 삭제 및 초기화
  const resetRecording = () => {
    // 오디오 정리
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    // 상태 초기화
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingState('idle');
    setRecordingTime(0);
    setIsPlaying(false);
    setError(null);
  };

  // 오디오 다운로드
  const downloadRecording = () => {
    if (!audioBlob) return;

    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recording-${new Date().getTime()}.${
      audioBlob.type.includes('webm') ? 'webm' : 'mp4'
    }`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      // 타이머 정리
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // 스트림 정리
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      // 오디오 URL 정리
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4'>
      <div className='w-full max-w-2xl'>
        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12'>
          {/* 제목 */}
          <div className='text-center mb-8'>
            <h1 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2'>
              보이스 레코더
            </h1>
            <p className='text-gray-600 dark:text-gray-400'>
              마이크를 사용하여 음성을 녹음하세요
            </p>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className='mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
              <p className='text-red-800 dark:text-red-200 text-sm'>{error}</p>
            </div>
          )}

          {/* 녹음 시간 표시 */}
          <div className='text-center mb-8'>
            <div className='text-6xl md:text-7xl font-mono font-bold text-gray-900 dark:text-white mb-4'>
              {formatTime(recordingTime)}
            </div>
            {recordingState === 'recording' && (
              <div className='flex items-center justify-center gap-2 text-red-600 dark:text-red-400'>
                <div className='w-3 h-3 bg-red-600 rounded-full animate-pulse'></div>
                <span className='text-sm font-medium'>녹음 중...</span>
              </div>
            )}
          </div>

          {/* 메인 녹음 버튼 */}
          <div className='flex justify-center mb-8'>
            {recordingState === 'idle' && (
              <button
                onClick={startRecording}
                className='w-24 h-24 md:w-32 md:h-32 rounded-full bg-red-500 hover:bg-red-600 active:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center group'
                aria-label='녹음 시작'
              >
                <Mic className='w-12 h-12 md:w-16 md:h-16 group-hover:scale-110 transition-transform' />
              </button>
            )}

            {recordingState === 'recording' && (
              <button
                onClick={stopRecording}
                className='w-24 h-24 md:w-32 md:h-32 rounded-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center animate-pulse'
                aria-label='녹음 중지'
              >
                <Square className='w-8 h-8 md:w-10 md:h-10' />
              </button>
            )}

            {recordingState === 'recorded' && (
              <div className='flex items-center gap-4'>
                <button
                  onClick={playRecording}
                  className='w-20 h-20 md:w-24 md:h-24 rounded-full bg-green-500 hover:bg-green-600 active:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center'
                  aria-label={isPlaying ? '일시정지' : '재생'}
                >
                  {isPlaying ? (
                    <Pause className='w-8 h-8 md:w-10 md:h-10' />
                  ) : (
                    <Play className='w-8 h-8 md:w-10 md:h-10 ml-1' />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* 녹음 완료 후 액션 버튼들 */}
          {recordingState === 'recorded' && (
            <div className='flex flex-col sm:flex-row gap-3 justify-center'>
              <Button
                onClick={downloadRecording}
                variant='default'
                size='lg'
                className='flex items-center gap-2'
              >
                <Download className='w-5 h-5' />
                다운로드
              </Button>
              <Button
                onClick={resetRecording}
                variant='outline'
                size='lg'
                className='flex items-center gap-2'
              >
                <Trash2 className='w-5 h-5' />
                새로 녹음
              </Button>
            </div>
          )}

          {/* 안내 메시지 */}
          <div className='mt-8 text-center'>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              {recordingState === 'idle' &&
                '녹음 버튼을 클릭하여 녹음을 시작하세요'}
              {recordingState === 'recording' &&
                '녹음 중입니다. 중지 버튼을 눌러 녹음을 완료하세요'}
              {recordingState === 'recorded' &&
                '녹음이 완료되었습니다. 재생하거나 다운로드할 수 있습니다'}
            </p>
          </div>
        </div>

        {/* 기능 설명 */}
        <div className='mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6'>
          <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
            주요 기능
          </h2>
          <ul className='space-y-2 text-gray-600 dark:text-gray-400'>
            <li className='flex items-start gap-2'>
              <span className='text-green-500 mt-1'>✓</span>
              <span>브라우저에서 바로 녹음 가능 (설치 불필요)</span>
            </li>
            <li className='flex items-start gap-2'>
              <span className='text-green-500 mt-1'>✓</span>
              <span>녹음된 파일은 로컬에만 저장 (프라이버시 보장)</span>
            </li>
            <li className='flex items-start gap-2'>
              <span className='text-green-500 mt-1'>✓</span>
              <span>녹음 시간 실시간 표시</span>
            </li>
            <li className='flex items-start gap-2'>
              <span className='text-green-500 mt-1'>✓</span>
              <span>녹음 완료 후 즉시 재생 및 다운로드</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
