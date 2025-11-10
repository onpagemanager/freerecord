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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  // 시간 포맷팅 (MM:SS)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  // 웨이브 그리기 함수 (개선된 시각 효과)
  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const timeDataArray = new Uint8Array(bufferLength);
    const frequencyDataArray = new Uint8Array(analyser.frequencyBinCount);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);

      // 시간 도메인 데이터 (웨이브폼)
      analyser.getByteTimeDomainData(timeDataArray);
      // 주파수 도메인 데이터 (스펙트럼)
      analyser.getByteFrequencyData(frequencyDataArray);

      // 배경 그리기 (그라데이션 효과)
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(15, 23, 42, 0.95)');
      gradient.addColorStop(0.5, 'rgba(30, 41, 59, 0.9)');
      gradient.addColorStop(1, 'rgba(15, 23, 42, 0.95)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 기준선 그리기 (중앙)
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      // 주파수 스펙트럼 막대 그래프 (하단)
      const barCount = 64; // 표시할 막대 개수
      const barWidth = canvas.width / barCount;
      const spectrumHeight = canvas.height * 0.3; // 스펙트럼 영역 높이

      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor(
          (i / barCount) * frequencyDataArray.length
        );
        const barHeight =
          (frequencyDataArray[dataIndex] / 255) * spectrumHeight;

        // 그라데이션 색상 (주파수에 따라)
        const hue = (i / barCount) * 180 + 180; // 청록색에서 파란색으로
        const saturation = 70 + (frequencyDataArray[dataIndex] / 255) * 30;
        const lightness = 50 + (frequencyDataArray[dataIndex] / 255) * 20;

        ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        ctx.fillRect(
          i * barWidth,
          canvas.height - barHeight,
          barWidth - 1,
          barHeight
        );

        // 반사 효과 (상단에도 미러링)
        ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.3)`;
        ctx.fillRect(i * barWidth, 0, barWidth - 1, barHeight * 0.5);
      }

      // 웨이브폼 그리기 (중앙 라인)
      ctx.lineWidth = 2;
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      // 그라데이션 스트로크
      const waveGradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
      waveGradient.addColorStop(0, '#22d3ee');
      waveGradient.addColorStop(0.5, '#06b6d4');
      waveGradient.addColorStop(1, '#22d3ee');
      ctx.strokeStyle = waveGradient;

      for (let i = 0; i < bufferLength; i++) {
        const v = timeDataArray[i] / 128.0;
        const y = canvas.height / 2 + (v * canvas.height) / 4;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.stroke();

      // 웨이브폼 채우기 (그라데이션)
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.lineTo(0, canvas.height / 2);
      ctx.closePath();

      const fillGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      fillGradient.addColorStop(0, 'rgba(34, 211, 238, 0.1)');
      fillGradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.2)');
      fillGradient.addColorStop(1, 'rgba(34, 211, 238, 0.1)');
      ctx.fillStyle = fillGradient;
      ctx.fill();

      // 상단 웨이브폼 (미러링)
      ctx.beginPath();
      x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = timeDataArray[i] / 128.0;
        const y = canvas.height / 2 - (v * canvas.height) / 4;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.strokeStyle = 'rgba(34, 211, 238, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    };

    draw();
  };

  // 웨이브 애니메이션 중지
  const stopWaveform = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // 배경만 그리기
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // 기준선만 그리기
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      }
    }
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
        // 현재 재생 시간을 정확히 저장
        setCurrentTime(audioRef.current.currentTime);
        audioRef.current.pause();
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      // 웨이브 중지
      stopWaveform();
      setIsPlaying(false);
    } else {
      // 재생
      if (!audioRef.current) {
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        audio.onended = () => {
          setIsPlaying(false);
          setCurrentTime(duration); // 원본 길이로 설정
          if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
          }
          // 웨이브 중지
          stopWaveform();
        };
      }

      const audio = audioRef.current;

      // 재생 완료 후 재시작: currentTime이 duration과 같거나 거의 같으면 처음부터 재생
      let playTime = currentTime;
      if (Math.abs(currentTime - duration) < 0.1) {
        playTime = 0;
        setCurrentTime(0);
      }

      // 저장된 playTime을 실제 재생 시간으로 변환 (속도 적용)
      // playTime은 원본 시간 기준이므로, 실제 재생 시간으로 변환
      audio.currentTime = playTime / speed;
      audio.playbackRate = speed; // 속도 설정

      // AudioContext 및 AnalyserNode 설정 (웨이브폼용)
      try {
        // AudioContext가 없거나 닫혔으면 새로 생성
        let audioContext = audioContextRef.current;
        if (!audioContext || audioContext.state === 'closed') {
          audioContext = new (window.AudioContext ||
            (window as any).webkitAudioContext)();
          audioContextRef.current = audioContext;
        }

        // MediaElementSource가 아직 생성되지 않았을 때만 생성
        if (!sourceRef.current) {
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 2048;
          analyserRef.current = analyser;

          const source = audioContext.createMediaElementSource(audio);
          sourceRef.current = source;
          source.connect(analyser);
          analyser.connect(audioContext.destination);
        }

        // 웨이브 그리기 시작
        drawWaveform();
      } catch (err) {
        console.error('Audio context error:', err);
      }

      audio.play();

      // 재생 위치 추적 (원본 시간 기준)
      progressIntervalRef.current = setInterval(() => {
        if (audio) {
          // audio.currentTime은 실제 재생 시간이므로, 속도를 곱해서 원본 시간으로 변환
          const originalTime = audio.currentTime * speed;
          setCurrentTime(Math.min(originalTime, duration));
          // 원본 길이 체크
          if (originalTime >= duration) {
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

  // 리샘플링 함수 (속도 변경을 위해 - 선형 보간)
  // 원본의 모든 내용을 포함하도록 보장
  const resample = (
    samples: Float32Array,
    speedRatio: number
  ): Float32Array => {
    if (speedRatio === 1.0) {
      return new Float32Array(samples);
    }

    const inputLength = samples.length;
    // 원본의 마지막 샘플까지 포함되도록 출력 길이 계산
    // 마지막 샘플의 인덱스가 포함되려면: (outputLength - 1) * speedRatio >= inputLength - 1
    // 따라서: outputLength >= (inputLength - 1) / speedRatio + 1
    const outputLength = Math.ceil((inputLength - 1) / speedRatio) + 1;
    const result = new Float32Array(outputLength);

    for (let i = 0; i < outputLength; i++) {
      // 입력 샘플 인덱스 계산 (원본의 모든 샘플을 포함)
      const sourceIndex = i * speedRatio;
      const indexFloor = Math.floor(sourceIndex);
      const indexCeil = Math.min(indexFloor + 1, inputLength - 1);
      const fraction = sourceIndex - indexFloor;

      // 선형 보간
      if (indexFloor < inputLength) {
        result[i] =
          samples[indexFloor] * (1 - fraction) + samples[indexCeil] * fraction;
      } else {
        // 원본 범위를 벗어나면 마지막 샘플 사용
        result[i] = samples[inputLength - 1];
      }
    }

    return result;
  };

  // 속도 변경 및 다운로드
  const handleChangeSpeed = async () => {
    if (!audioBuffer || !audioFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      const numberOfChannels = audioBuffer.numberOfChannels;
      const originalSampleRate = audioBuffer.sampleRate;
      const originalLength = audioBuffer.length;

      // 원본 길이를 유지 (속도 변경 시에도 원본과 동일한 길이)
      const newLength = originalLength;

      // 오프라인 컨텍스트를 사용하여 속도 변경 (원본 길이 유지)
      const offlineContext = new OfflineAudioContext(
        numberOfChannels,
        newLength,
        originalSampleRate
      );

      // 소스 생성
      const source = offlineContext.createBufferSource();
      source.buffer = audioBuffer;
      source.playbackRate.value = speed; // 속도 설정

      // GainNode로 볼륨 제어
      const gainNode = offlineContext.createGain();
      source.connect(gainNode);
      gainNode.connect(offlineContext.destination);

      // 오프라인 렌더링 시작
      source.start(0);
      const processedBuffer = await offlineContext.startRendering();

      // WAV로 변환
      const wavBlob = audioBufferToWav(processedBuffer);

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

  // Canvas 크기 조정
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const resizeCanvas = () => {
        const container = canvas.parentElement;
        if (container) {
          canvas.width = container.clientWidth;
          canvas.height = 200;
        }
      };
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      return () => window.removeEventListener('resize', resizeCanvas);
    }
  }, []);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      // 웨이브 애니메이션 정리
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
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
      <div className='container max-w-4xl'>
        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 overflow-hidden'>
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

          {/* 웨이브 시각화 영역 */}
          {audioFile && (
            <div className='mb-8 rounded-lg overflow-hidden bg-slate-900'>
              <canvas
                ref={canvasRef}
                className='w-full h-[200px] block'
                style={{ background: 'rgba(15, 23, 42, 0.9)' }}
              />
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
                        원본: {formatTime(duration)} | 속도:{' '}
                        {formatSpeed(speed)}
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
                <div className='relative px-4 py-3'>
                  <input
                    type='range'
                    min='0.25'
                    max='4.0'
                    step='0.05'
                    value={speed}
                    onChange={e => setSpeed(Number(e.target.value))}
                    className='w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer'
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                        ((speed - 0.25) / (4.0 - 0.25)) * 100
                      }%, #e5e7eb ${
                        ((speed - 0.25) / (4.0 - 0.25)) * 100
                      }%, #e5e7eb 100%)`,
                    }}
                  />
                  <div className='flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-2 px-1'>
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
