'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Upload,
  Play,
  Pause,
  Download,
  Music,
  RotateCcw,
  RefreshCw,
} from 'lucide-react';

export default function Reverse() {
  // 상태 관리
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [reversedAudioUrl, setReversedAudioUrl] = useState<string | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [reversedBuffer, setReversedBuffer] = useState<AudioBuffer | null>(
    null
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isReversed, setIsReversed] = useState(false); // 역방향 여부
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 시간 포맷팅 (MM:SS)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  // 파일 선택 핸들러
  const handleFileSelect = async (file: File) => {
    setError(null);
    setAudioFile(file);

    // 기존 오디오 정리
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    if (reversedAudioUrl) {
      URL.revokeObjectURL(reversedAudioUrl);
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }

    const url = URL.createObjectURL(file);
    setAudioUrl(url);

    try {
      // AudioContext 생성
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      // 파일을 ArrayBuffer로 읽기
      const arrayBuffer = await file.arrayBuffer();
      const buffer = await audioContext.decodeAudioData(arrayBuffer);
      setAudioBuffer(buffer);

      // 길이 설정
      const length = buffer.duration;
      setDuration(length);
      setCurrentTime(0);
      setIsReversed(false);

      // 역방향 오디오 자동 생성
      await createReversedAudio(buffer, audioContext);
    } catch (err) {
      setError('오디오 파일을 로드할 수 없습니다.');
      console.error('Audio loading error:', err);
    }
  };

  // 역방향 오디오 생성
  const createReversedAudio = async (
    buffer: AudioBuffer,
    audioContext: AudioContext
  ) => {
    try {
      setIsProcessing(true);

      // 새로운 AudioBuffer 생성 (동일한 속성)
      const numberOfChannels = buffer.numberOfChannels;
      const length = buffer.length;
      const sampleRate = buffer.sampleRate;
      const reversedBuffer = audioContext.createBuffer(
        numberOfChannels,
        length,
        sampleRate
      );

      // 각 채널의 데이터를 역순으로 복사
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const originalData = buffer.getChannelData(channel);
        const channelData = new Float32Array(originalData);
        const reversedData = reversedBuffer.getChannelData(channel);

        // 역순으로 복사
        for (let i = 0; i < length; i++) {
          reversedData[i] = channelData[length - 1 - i];
        }
      }

      setReversedBuffer(reversedBuffer);

      // WAV로 변환하여 URL 생성
      const wavBlob = audioBufferToWav(reversedBuffer);
      const reversedUrl = URL.createObjectURL(wavBlob);
      setReversedAudioUrl(reversedUrl);
    } catch (err) {
      setError('역방향 오디오 생성 중 오류가 발생했습니다.');
      console.error('Reverse audio error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // 드래그 앤 드롭 핸들러
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('audio/')) {
      handleFileSelect(file);
    } else {
      setError('오디오 파일만 업로드할 수 있습니다.');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // 재생/일시정지
  const togglePlay = async () => {
    const urlToPlay = isReversed ? reversedAudioUrl : audioUrl;
    if (!urlToPlay) {
      setError('재생할 오디오가 없습니다.');
      return;
    }

    if (isPlaying) {
      // 일시정지
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setIsPlaying(false);
    } else {
      // 재생
      try {
        // 기존 Audio 요소가 있으면 정리 (소스 변경 시 새로 생성하는 것이 안전)
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
        }

        // Audio 요소 새로 생성
        if (!audioRef.current) {
          const audio = new Audio(urlToPlay);
          audioRef.current = audio;

          // 에러 핸들링
          audio.onerror = () => {
            setError('오디오를 재생할 수 없습니다.');
            setIsPlaying(false);
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
              progressIntervalRef.current = null;
            }
          };

          audio.onended = () => {
            setIsPlaying(false);
            setCurrentTime(duration);
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
              progressIntervalRef.current = null;
            }
          };

          // 오디오 로드 대기
          await new Promise<void>((resolve, reject) => {
            if (audio.readyState >= 2) {
              // 이미 로드됨
              resolve();
            } else {
              audio.oncanplaythrough = () => resolve();
              audio.onerror = () => reject(new Error('오디오 로드 실패'));
              audio.load(); // 명시적으로 로드
            }
          });
        }

        const audio = audioRef.current;
        audio.currentTime = currentTime;

        // 재생 시도
        await audio.play();

        // 재생 위치 추적
        progressIntervalRef.current = setInterval(() => {
          if (audio) {
            setCurrentTime(audio.currentTime);
          }
        }, 100);

        setIsPlaying(true);
        setError(null);
      } catch (err) {
        setError('오디오 재생 중 오류가 발생했습니다.');
        console.error('Play error:', err);
        setIsPlaying(false);
      }
    }
  };

  // 원본/역방향 전환
  const toggleReverse = () => {
    if (!audioUrl || !reversedAudioUrl) return;

    // 재생 중이면 일시정지하고 Audio 요소 정리
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }

    // Audio 요소를 정리하여 새 소스로 재생할 수 있도록 함
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setIsReversed(!isReversed);
    setCurrentTime(0);
  };

  // 다운로드
  const handleDownload = () => {
    const bufferToDownload = isReversed ? reversedBuffer : audioBuffer;
    if (!bufferToDownload || !audioFile) return;

    try {
      // WAV로 변환
      const wavBlob = audioBufferToWav(bufferToDownload);

      // 다운로드
      const url = URL.createObjectURL(wavBlob);
      const a = document.createElement('a');
      a.href = url;
      const originalName = audioFile.name.replace(/\.[^/.]+$/, '');
      const suffix = isReversed ? '_reversed' : '';
      a.download = `${originalName}${suffix}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('다운로드 중 오류가 발생했습니다.');
      console.error('Download error:', err);
    }
  };

  // AudioBuffer를 WAV Blob으로 변환
  const audioBufferToWav = (buffer: AudioBuffer): Blob => {
    const length = buffer.length;
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const arrayBuffer = new ArrayBuffer(44 + length * numberOfChannels * 2);
    const view = new DataView(arrayBuffer);

    // WAV 헤더 작성
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * numberOfChannels * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numberOfChannels * 2, true);
    view.setUint16(32, numberOfChannels * 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, length * numberOfChannels * 2, true);

    // PCM 데이터 작성
    const channelDataArrays: Float32Array[] = [];
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      channelDataArrays.push(new Float32Array(channelData));
    }

    let offset = 44;
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, channelDataArrays[channel][i]));
        view.setInt16(
          offset,
          sample < 0 ? sample * 0x8000 : sample * 0x7fff,
          true
        );
        offset += 2;
      }
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
  };

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (reversedAudioUrl) {
        URL.revokeObjectURL(reversedAudioUrl);
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      // AudioContext가 닫히지 않았을 때만 닫기
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== 'closed'
      ) {
        audioContextRef.current.close().catch(err => {
          // 이미 닫혔거나 닫는 중인 경우 무시
          console.warn('AudioContext close error:', err);
        });
      }
    };
  }, [audioUrl, reversedAudioUrl]);

  return (
    <div className='flex min-h-screen justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-5'>
      <div className='container'>
        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12'>
          {/* 제목 */}
          <div className='text-center mb-8'>
            <h1 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2'>
              오디오 역방향
            </h1>
            <p className='text-gray-600 dark:text-gray-400'>
              오디오 파일을 역방향으로 재생하도록 변환하세요
            </p>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className='mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
              <p className='text-red-800 dark:text-red-200 text-sm'>{error}</p>
            </div>
          )}

          {/* 파일 업로드 영역 */}
          {!audioFile && (
            <div
              className='mb-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer'
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className='w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500' />
              <p className='text-lg font-medium text-gray-700 dark:text-gray-300 mb-2'>
                파일을 드래그 앤 드롭하거나 클릭하여 선택
              </p>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                MP3, WAV, OGG 등 오디오 파일 지원
              </p>
              <input
                ref={fileInputRef}
                type='file'
                accept='audio/*'
                className='hidden'
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileSelect(file);
                  }
                }}
              />
            </div>
          )}

          {/* 처리 중 표시 */}
          {isProcessing && (
            <div className='mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg'>
              <div className='flex items-center justify-center gap-3'>
                <div className='w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
                <p className='text-blue-800 dark:text-blue-200 text-sm'>
                  역방향 오디오 생성 중...
                </p>
              </div>
            </div>
          )}

          {/* 오디오 편집 영역 */}
          {audioFile && audioBuffer && (
            <>
              {/* 파일 정보 */}
              <div className='mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <Music className='w-5 h-5 text-blue-500' />
                    <div>
                      <p className='font-medium text-gray-900 dark:text-white'>
                        {audioFile.name}
                      </p>
                      <p className='text-sm text-gray-500 dark:text-gray-400'>
                        {formatTime(duration)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      setAudioFile(null);
                      setAudioBuffer(null);
                      setReversedBuffer(null);
                      setAudioUrl(null);
                      setReversedAudioUrl(null);
                      setCurrentTime(0);
                      setIsReversed(false);
                      setIsPlaying(false);
                      if (audioRef.current) {
                        audioRef.current.pause();
                        audioRef.current = null;
                      }
                      if (audioUrl) {
                        URL.revokeObjectURL(audioUrl);
                      }
                      if (reversedAudioUrl) {
                        URL.revokeObjectURL(reversedAudioUrl);
                      }
                    }}
                  >
                    새 파일 선택
                  </Button>
                </div>
              </div>

              {/* 재생 모드 표시 */}
              <div className='mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <RefreshCw
                      className={`w-5 h-5 ${
                        isReversed ? 'text-blue-600' : 'text-gray-400'
                      }`}
                    />
                    <span className='font-medium text-gray-900 dark:text-white'>
                      현재 모드: {isReversed ? '역방향' : '원본'}
                    </span>
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={toggleReverse}
                    disabled={!reversedAudioUrl}
                    className='flex items-center gap-2'
                  >
                    <RotateCcw className='w-4 h-4' />
                    {isReversed ? '원본으로 전환' : '역방향으로 전환'}
                  </Button>
                </div>
              </div>

              {/* 재생 컨트롤 */}
              <div className='mb-8'>
                <div className='flex items-center justify-center gap-4 mb-6'>
                  <Button
                    onClick={togglePlay}
                    variant='default'
                    size='lg'
                    className='flex items-center gap-2'
                    disabled={!audioBuffer || (!reversedAudioUrl && isReversed)}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className='w-5 h-5' />
                        일시정지
                      </>
                    ) : (
                      <>
                        <Play className='w-5 h-5' />
                        재생
                      </>
                    )}
                  </Button>
                </div>

                {/* 재생 진행 표시 */}
                <div className='mb-6'>
                  <div className='flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2'>
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                    <div
                      className='bg-blue-500 h-2 rounded-full transition-all duration-100'
                      style={{
                        width: `${
                          duration > 0 ? (currentTime / duration) * 100 : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* 다운로드 버튼 */}
              <div className='flex justify-center gap-4'>
                <Button
                  onClick={handleDownload}
                  variant='default'
                  size='lg'
                  className='flex items-center gap-2'
                  disabled={!audioBuffer || (!reversedBuffer && isReversed)}
                >
                  <Download className='w-5 h-5' />
                  {isReversed ? '역방향 파일 다운로드' : '원본 파일 다운로드'}
                </Button>
              </div>
            </>
          )}

          {/* 기능 설명 */}
          <div className='mt-8 bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6'>
            <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
              사용 방법
            </h2>
            <ol className='space-y-2 text-gray-600 dark:text-gray-400 list-decimal list-inside'>
              <li>오디오 파일을 드래그 앤 드롭하거나 클릭하여 선택하세요</li>
              <li>자동으로 역방향 오디오가 생성됩니다</li>
              <li>원본/역방향 전환 버튼으로 모드를 변경할 수 있습니다</li>
              <li>재생 버튼을 눌러 원본 또는 역방향 오디오를 들어보세요</li>
              <li>다운로드 버튼을 클릭하여 저장하세요</li>
            </ol>

            <div className='mt-4 pt-4 border-t border-gray-200 dark:border-gray-600'>
              <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                주요 기능
              </h3>
              <ul className='space-y-1 text-sm text-gray-600 dark:text-gray-400'>
                <li className='flex items-start gap-2'>
                  <span className='text-green-500 mt-1'>✓</span>
                  <span>오디오를 역방향으로 자동 변환</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-green-500 mt-1'>✓</span>
                  <span>원본과 역방향 오디오 간 즉시 전환</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-green-500 mt-1'>✓</span>
                  <span>실시간 재생으로 미리보기</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-green-500 mt-1'>✓</span>
                  <span>원본 품질 유지</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-green-500 mt-1'>✓</span>
                  <span>모든 오디오 포맷 지원</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
