'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Upload,
  Play,
  Pause,
  Download,
  Scissors,
  Volume2,
  Music,
} from 'lucide-react';

export default function Trim() {
  // 상태 관리
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0); // 전체 길이 (초)
  const [startTime, setStartTime] = useState(0); // 시작 시간 (초)
  const [endTime, setEndTime] = useState(0); // 끝 시간 (초)
  const [currentTime, setCurrentTime] = useState(0); // 현재 재생 시간 (초)
  const [isDragging, setIsDragging] = useState<'start' | 'end' | null>(null);
  const [fadeIn, setFadeIn] = useState(false); // Fade in 옵션
  const [fadeOut, setFadeOut] = useState(false); // Fade out 옵션
  const [isProcessing, setIsProcessing] = useState(false); // 처리 중 여부
  const [error, setError] = useState<string | null>(null);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
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
      setStartTime(0);
      setEndTime(length);
      setCurrentTime(0);

      // 웨이브폼 그리기
      drawWaveform(buffer);
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

  // 웨이브폼 그리기
  const drawWaveform = (buffer: AudioBuffer) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // 배경 그리기
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, width, height);

    // 오디오 데이터 가져오기
    const channelData = buffer.getChannelData(0);
    const samples = channelData.length;
    const step = Math.ceil(samples / width);
    const amp = height / 2;

    // 웨이브폼 그리기
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 1;
    ctx.beginPath();

    for (let i = 0; i < width; i++) {
      const sampleIndex = Math.floor(i * step);
      const sample = channelData[sampleIndex] || 0;
      const y = amp + sample * amp;
      if (i === 0) {
        ctx.moveTo(i, y);
      } else {
        ctx.lineTo(i, y);
      }
    }

    ctx.stroke();

    // 선택 영역 표시
    drawSelection(ctx, width, height);
  };

  // 선택 영역 그리기
  const drawSelection = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    if (!audioBuffer) return;

    const startX = (startTime / duration) * width;
    const endX = (endTime / duration) * width;

    // 선택 영역 배경
    ctx.fillStyle = 'rgba(34, 211, 238, 0.2)';
    ctx.fillRect(startX, 0, endX - startX, height);

    // 시작/끝 라인
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(startX, 0);
    ctx.lineTo(startX, height);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(endX, 0);
    ctx.lineTo(endX, height);
    ctx.stroke();

    // 핸들 그리기
    ctx.fillStyle = '#22d3ee';
    ctx.fillRect(startX - 4, 0, 8, height);
    ctx.fillRect(endX - 4, 0, 8, height);
  };

  // 슬라이더 위치에서 시간 계산
  const getTimeFromPosition = (clientX: number): number => {
    if (!containerRef.current || !audioBuffer) return 0;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    return percentage * duration;
  };

  // 마우스 다운 핸들러
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!audioBuffer) return;

    const time = getTimeFromPosition(e.clientX);
    const startDist = Math.abs(time - startTime);
    const endDist = Math.abs(time - endTime);
    const threshold = duration * 0.02; // 2% 범위 내에서 핸들 인식

    if (startDist < threshold || startDist < endDist) {
      setIsDragging('start');
      setStartTime(Math.max(0, Math.min(time, endTime - 0.1)));
    } else if (endDist < threshold) {
      setIsDragging('end');
      setEndTime(Math.min(duration, Math.max(time, startTime + 0.1)));
    } else {
      // 재생 위치 이동
      setCurrentTime(time);
      if (audioRef.current) {
        audioRef.current.currentTime = time;
      }
    }
  };

  // 마우스 이동 핸들러
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !audioBuffer) return;

    const time = getTimeFromPosition(e.clientX);

    if (isDragging === 'start') {
      setStartTime(Math.max(0, Math.min(time, endTime - 0.1)));
    } else if (isDragging === 'end') {
      setEndTime(Math.min(duration, Math.max(time, startTime + 0.1)));
    }

    // 웨이브폼 다시 그리기
    if (canvasRef.current && audioBuffer) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        drawWaveform(audioBuffer);
      }
    }
  };

  // 마우스 업 핸들러
  const handleMouseUp = () => {
    setIsDragging(null);
  };

  // 재생/일시정지
  const togglePlay = () => {
    if (!audioUrl || !audioBuffer) return;

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
          setCurrentTime(endTime);
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
          }
        };
      }

      const audio = audioRef.current;
      audio.currentTime = Math.max(startTime, currentTime);
      audio.play();

      // 재생 위치 추적
      progressIntervalRef.current = setInterval(() => {
        if (audio) {
          const time = audio.currentTime;
          setCurrentTime(time);

          // 끝 시간에 도달하면 정지
          if (time >= endTime) {
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

  // 오디오 트림 및 다운로드
  const handleTrim = async () => {
    if (!audioBuffer || !audioFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      // 트림할 길이 계산
      const trimLength = endTime - startTime;
      const sampleRate = audioBuffer.sampleRate;
      const numberOfChannels = audioBuffer.numberOfChannels;
      const startSample = Math.floor(startTime * sampleRate);
      const endSample = Math.floor(endTime * sampleRate);
      const length = endSample - startSample;

      // 새로운 AudioBuffer 생성
      const newBuffer = audioContext.createBuffer(
        numberOfChannels,
        length,
        sampleRate
      );

      // 오디오 데이터 복사
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const originalData = audioBuffer.getChannelData(channel);
        const newData = newBuffer.getChannelData(channel);
        const channelData = new Float32Array(originalData);
        const trimmedData = channelData.subarray(startSample, endSample);

        // Fade in 적용
        if (fadeIn) {
          const fadeLength = Math.min(sampleRate * 0.5, length); // 0.5초 또는 전체 길이
          for (let i = 0; i < fadeLength; i++) {
            trimmedData[i] *= i / fadeLength;
          }
        }

        // Fade out 적용
        if (fadeOut) {
          const fadeLength = Math.min(sampleRate * 0.5, length); // 0.5초 또는 전체 길이
          for (let i = 0; i < fadeLength; i++) {
            trimmedData[length - 1 - i] *= i / fadeLength;
          }
        }

        newData.set(trimmedData);
      }

      // WAV로 변환
      const wavBlob = audioBufferToWav(newBuffer);

      // 다운로드
      const url = URL.createObjectURL(wavBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `trimmed-${audioFile.name.replace(/\.[^/.]+$/, '')}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('오디오 트림 중 오류가 발생했습니다.');
      console.error('Trim error:', err);
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

  // Canvas 크기 조정
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && containerRef.current) {
      const resizeCanvas = () => {
        const container = containerRef.current;
        if (container) {
          canvas.width = container.clientWidth;
          canvas.height = 200;
          if (audioBuffer) {
            drawWaveform(audioBuffer);
          }
        }
      };
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      return () => window.removeEventListener('resize', resizeCanvas);
    }
  }, [audioBuffer]);

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
    <div className='flex min-h-screen justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-5'>
      <div className='container'>
        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12'>
          {/* 제목 */}
          <div className='text-center mb-8'>
            <h1 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2'>
              오디오 트림
            </h1>
            <p className='text-gray-600 dark:text-gray-400'>
              오디오 파일을 업로드하고 원하는 구간을 잘라내세요
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
                      setAudioUrl(null);
                      setStartTime(0);
                      setEndTime(0);
                      setCurrentTime(0);
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

              {/* 웨이브폼 */}
              <div
                ref={containerRef}
                className='mb-6 rounded-lg overflow-hidden bg-slate-900 cursor-pointer relative'
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <canvas
                  ref={canvasRef}
                  className='w-full h-[200px] block'
                  style={{ background: '#1e293b' }}
                />
              </div>

              {/* 시간 표시 및 컨트롤 */}
              <div className='mb-6'>
                <div className='flex items-center justify-between mb-4'>
                  <div className='text-sm text-gray-600 dark:text-gray-400'>
                    <span className='font-medium'>시작:</span>{' '}
                    {formatTime(startTime)}
                  </div>
                  <div className='text-sm text-gray-600 dark:text-gray-400'>
                    <span className='font-medium'>현재:</span>{' '}
                    {formatTime(currentTime)}
                  </div>
                  <div className='text-sm text-gray-600 dark:text-gray-400'>
                    <span className='font-medium'>끝:</span>{' '}
                    {formatTime(endTime)}
                  </div>
                </div>

                {/* 재생 컨트롤 */}
                <div className='flex items-center gap-4 justify-center mb-6'>
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

                {/* Fade 옵션 */}
                <div className='flex items-center gap-6 justify-center mb-6'>
                  <label className='flex items-center gap-2 cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={fadeIn}
                      onChange={e => setFadeIn(e.target.checked)}
                      className='w-4 h-4'
                    />
                    <span className='text-sm text-gray-700 dark:text-gray-300'>
                      Fade In
                    </span>
                  </label>
                  <label className='flex items-center gap-2 cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={fadeOut}
                      onChange={e => setFadeOut(e.target.checked)}
                      className='w-4 h-4'
                    />
                    <span className='text-sm text-gray-700 dark:text-gray-300'>
                      Fade Out
                    </span>
                  </label>
                </div>

                {/* 트림 버튼 */}
                <div className='flex justify-center'>
                  <Button
                    onClick={handleTrim}
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
                        <Scissors className='w-5 h-5' />
                        트림 및 다운로드
                      </>
                    )}
                  </Button>
                </div>
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
              <li>웨이브폼에서 시작과 끝 지점을 드래그하여 선택하세요</li>
              <li>재생 버튼을 눌러 선택한 구간을 미리 들어보세요</li>
              <li>필요시 Fade In/Out 옵션을 선택하세요</li>
              <li>트림 및 다운로드 버튼을 클릭하여 저장하세요</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
