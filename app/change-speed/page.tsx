'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Upload,
  Play,
  Pause,
  Download,
  Gauge,
  Music,
  RotateCcw,
  FastForward,
  Rewind,
} from 'lucide-react';

export default function ChangeSpeed() {
  // 상태 관리
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0); // 전체 길이 (초)
  const [currentTime, setCurrentTime] = useState(0); // 현재 재생 시간 (초)
  const [speed, setSpeed] = useState(1.0); // 속도 (0.25x ~ 4.0x)
  const [isProcessing, setIsProcessing] = useState(false); // 처리 중 여부
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
      setSpeed(1.0); // 기본 속도 1.0x
    } catch (err) {
      setError('오디오 파일을 로드할 수 없습니다.');
      console.error('Audio loading error:', err);
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
  const togglePlay = () => {
    if (!audioUrl) return;

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
      if (!audioRef.current) {
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.onended = () => {
          setIsPlaying(false);
          setCurrentTime(duration / speed); // 속도 적용된 시간
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
          }
        };
      }

      const audio = audioRef.current;
      audio.currentTime = currentTime;
      audio.playbackRate = speed; // 속도 설정
      audio.play();

      // 재생 위치 추적 (속도 적용된 시간)
      progressIntervalRef.current = setInterval(() => {
        if (audio) {
          setCurrentTime(audio.currentTime);
          // 속도 적용된 전체 길이 체크
          if (audio.currentTime >= duration / speed) {
            audio.pause();
            setIsPlaying(false);
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
              progressIntervalRef.current = null;
            }
          }
        }
      }, 100);

      setIsPlaying(true);
    }
  };

  // 속도 변경 시 재생 중이면 업데이트
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed, isPlaying]);

  // 속도 아이콘 선택
  const getSpeedIcon = () => {
    if (speed < 1.0) return <Rewind className='w-5 h-5' />;
    if (speed > 1.0) return <FastForward className='w-5 h-5' />;
    return <Gauge className='w-5 h-5' />;
  };

  // 리샘플링 함수 (속도 변경을 위해)
  const resample = (
    samples: Float32Array | ArrayLike<number>,
    fromRate: number,
    toRate: number
  ): Float32Array => {
    // 입력을 배열로 변환
    const inputValues: number[] = [];
    for (let i = 0; i < samples.length; i++) {
      inputValues.push(samples[i]);
    }

    if (fromRate === toRate) {
      return new Float32Array(inputValues);
    }

    const ratio = fromRate / toRate;
    const newLength = Math.round(inputValues.length / ratio);
    const result = new Float32Array(newLength);

    for (let i = 0; i < newLength; i++) {
      const index = i * ratio;
      const indexFloor = Math.floor(index);
      const indexCeil = Math.min(indexFloor + 1, inputValues.length - 1);
      const fraction = index - indexFloor;

      result[i] =
        inputValues[indexFloor] * (1 - fraction) +
        inputValues[indexCeil] * fraction;
    }

    return result;
  };

  // 속도 변경 및 다운로드
  const handleChangeSpeed = async () => {
    if (!audioBuffer || !audioFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      // 속도에 따라 리샘플링
      const originalSampleRate = audioBuffer.sampleRate;
      const newSampleRate = Math.round(originalSampleRate * speed);
      const numberOfChannels = audioBuffer.numberOfChannels;
      const originalLength = audioBuffer.length;
      const newLength = Math.round(originalLength / speed);

      // 새로운 AudioBuffer 생성
      const newBuffer = audioContext.createBuffer(
        numberOfChannels,
        newLength,
        originalSampleRate // 원본 샘플레이트 유지
      );

      // 오디오 데이터 리샘플링
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const originalData = audioBuffer.getChannelData(channel);
        const channelData = new Float32Array(originalData);
        const resampledData = resample(channelData, 1, speed);
        const newData = newBuffer.getChannelData(channel);

        // 리샘플링된 데이터를 새 버퍼에 복사
        const copyLength = Math.min(resampledData.length, newLength);
        for (let i = 0; i < copyLength; i++) {
          newData[i] = resampledData[i];
        }
      }

      // WAV로 변환
      const wavBlob = audioBufferToWav(newBuffer);

      // 다운로드
      const url = URL.createObjectURL(wavBlob);
      const a = document.createElement('a');
      a.href = url;
      const originalName = audioFile.name.replace(/\.[^/.]+$/, '');
      const speedText = `${speed.toFixed(2)}x`;
      a.download = `${originalName}_${speedText}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('속도 변경 중 오류가 발생했습니다.');
      console.error('Speed change error:', err);
    } finally {
      setIsProcessing(false);
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

  // 속도 표시 포맷
  const formatSpeed = (speedValue: number): string => {
    return `${speedValue.toFixed(2)}x`;
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
  }, [audioUrl]);

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4'>
      <div className='w-full max-w-4xl'>
        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12'>
          {/* 제목 */}
          <div className='text-center mb-8'>
            <h1 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2'>
              오디오 속도 변경
            </h1>
            <p className='text-gray-600 dark:text-gray-400'>
              오디오 파일의 재생 속도를 증가하거나 감소시키세요
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
                        원본: {formatTime(duration)} | 변경 후:{' '}
                        {formatTime(duration / speed)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => {
                      setAudioFile(null);
                      setAudioBuffer(null);
                      setAudioUrl(null);
                      setCurrentTime(0);
                      setSpeed(1.0);
                      setIsPlaying(false);
                      if (audioRef.current) {
                        audioRef.current.pause();
                        audioRef.current = null;
                      }
                      if (audioUrl) {
                        URL.revokeObjectURL(audioUrl);
                      }
                    }}
                  >
                    새 파일 선택
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
                    disabled={!audioBuffer}
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
                    <span>{formatTime(duration / speed)}</span>
                  </div>
                  <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                    <div
                      className='bg-blue-500 h-2 rounded-full transition-all duration-100'
                      style={{
                        width: `${
                          duration > 0
                            ? (currentTime / (duration / speed)) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* 속도 조절 영역 */}
              <div className='mb-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg'>
                <div className='flex items-center gap-4 mb-4'>
                  {getSpeedIcon()}
                  <span className='text-lg font-semibold text-gray-900 dark:text-white min-w-[80px]'>
                    {formatSpeed(speed)}
                  </span>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setSpeed(1.0)}
                    className='flex items-center gap-1'
                  >
                    <RotateCcw className='w-4 h-4' />
                    초기화
                  </Button>
                </div>

                {/* 속도 슬라이더 */}
                <div className='relative'>
                  <input
                    type='range'
                    min='0.25'
                    max='4.0'
                    step='0.05'
                    value={speed}
                    onChange={e => setSpeed(Number(e.target.value))}
                    className='w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider'
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                        ((speed - 0.25) / (4.0 - 0.25)) * 100
                      }%, #e5e7eb ${
                        ((speed - 0.25) / (4.0 - 0.25)) * 100
                      }%, #e5e7eb 100%)`,
                    }}
                  />
                  <div className='flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-2'>
                    <span>0.25x</span>
                    <span className='font-medium'>1.0x (원본)</span>
                    <span>4.0x</span>
                  </div>
                </div>

                {/* 빠른 선택 버튼 */}
                <div className='mt-4 flex flex-wrap gap-2 justify-center'>
                  {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map(value => (
                    <Button
                      key={value}
                      variant={speed === value ? 'default' : 'outline'}
                      size='sm'
                      onClick={() => setSpeed(value)}
                    >
                      {formatSpeed(value)}
                    </Button>
                  ))}
                </div>

                {/* 속도 설명 */}
                <div className='mt-4 text-sm text-gray-600 dark:text-gray-400'>
                  <p>
                    • 0.25x-1.0x: 속도 감소 (느리게 재생)
                    <br />• 1.0x: 원본 속도 유지
                    <br />• 1.0x-4.0x: 속도 증가 (빠르게 재생)
                  </p>
                </div>
              </div>

              {/* 다운로드 버튼 */}
              <div className='flex justify-center'>
                <Button
                  onClick={handleChangeSpeed}
                  variant='default'
                  size='lg'
                  className='flex items-center gap-2'
                  disabled={isProcessing || !audioBuffer}
                >
                  {isProcessing ? (
                    <>
                      <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                      처리 중...
                    </>
                  ) : (
                    <>
                      <Download className='w-5 h-5' />
                      변경된 파일 다운로드
                    </>
                  )}
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
              <li>재생 버튼을 눌러 원본 오디오를 들어보세요</li>
              <li>속도 슬라이더를 조절하여 원하는 속도를 설정하세요</li>
              <li>변경된 파일 다운로드 버튼을 클릭하여 저장하세요</li>
            </ol>

            <div className='mt-4 pt-4 border-t border-gray-200 dark:border-gray-600'>
              <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                주요 기능
              </h3>
              <ul className='space-y-1 text-sm text-gray-600 dark:text-gray-400'>
                <li className='flex items-start gap-2'>
                  <span className='text-green-500 mt-1'>✓</span>
                  <span>0.25x ~ 4.0x 범위의 속도 조절</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-green-500 mt-1'>✓</span>
                  <span>실시간 재생으로 속도 미리보기</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-green-500 mt-1'>✓</span>
                  <span>
                    빠른 선택 버튼 (0.5x, 0.75x, 1.0x, 1.25x, 1.5x, 2.0x)
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-green-500 mt-1'>✓</span>
                  <span>모든 오디오 포맷 지원</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-green-500 mt-1'>✓</span>
                  <span>원본 품질 유지</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
