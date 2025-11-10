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
  TrendingUp,
  TrendingDown,
  Minus,
} from 'lucide-react';

export default function ChangePitch() {
  // 상태 관리
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0); // 전체 길이 (초)
  const [currentTime, setCurrentTime] = useState(0); // 현재 재생 시간 (초)
  const [pitch, setPitch] = useState(0); // 피치 (semitones, -12 ~ +12)
  const [isProcessing, setIsProcessing] = useState(false); // 처리 중 여부
  const [error, setError] = useState<string | null>(null);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

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
    if (sourceRef.current) {
      sourceRef.current.stop();
      sourceRef.current = null;
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
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
      setPitch(0); // 기본 피치 0 (원본)
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
  const togglePlay = async () => {
    if (!audioBuffer || !audioContextRef.current) return;

    if (isPlaying) {
      // 일시정지
      if (sourceRef.current) {
        // 현재 재생 시간을 정확히 계산하여 저장
        if (audioContextRef.current && startTimeRef.current !== null) {
          const elapsed =
            audioContextRef.current.currentTime - startTimeRef.current;
          setCurrentTime(Math.min(elapsed, duration));
        }

        sourceRef.current.stop();
        sourceRef.current = null;
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
      const audioContext = audioContextRef.current;

      // 재생 완료 후 재시작: currentTime이 duration과 같거나 거의 같으면 처음부터 재생
      let startTime = currentTime;
      if (Math.abs(currentTime - duration) < 0.1) {
        startTime = 0;
        setCurrentTime(0);
      }

      // 기존 소스 정리
      if (sourceRef.current) {
        sourceRef.current.stop();
        sourceRef.current = null;
      }

      // AudioBufferSourceNode 생성
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.detune.value = pitch * 100; // semitones를 cents로 변환 (1 semitone = 100 cents)

      // GainNode로 볼륨 제어
      const gainNode = audioContext.createGain();

      // AnalyserNode 생성 및 연결 (웨이브폼용)
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;

      source.connect(gainNode);
      gainNode.connect(analyser);
      analyser.connect(audioContext.destination);

      // 웨이브 그리기 시작
      drawWaveform();

      // 재생 시작 - 저장된 startTime부터 재생
      const offset = Math.min(startTime, duration);
      startTimeRef.current = audioContext.currentTime - offset;
      source.start(0, offset);

      // 재생 완료 이벤트
      source.onended = () => {
        setIsPlaying(false);
        setCurrentTime(duration);
        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
          progressIntervalRef.current = null;
        }
        // 웨이브 중지
        stopWaveform();
      };

      sourceRef.current = source;

      // 재생 위치 추적
      progressIntervalRef.current = setInterval(() => {
        if (audioContext && sourceRef.current) {
          const elapsed = audioContext.currentTime - startTimeRef.current;
          setCurrentTime(Math.min(elapsed, duration));
          if (elapsed >= duration) {
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

  // 피치 변경 시 재생 중이면 업데이트
  useEffect(() => {
    if (sourceRef.current && isPlaying) {
      sourceRef.current.detune.value = pitch * 100;
    }
  }, [pitch, isPlaying]);

  // 피치 아이콘 선택
  const getPitchIcon = () => {
    if (pitch < 0) return <TrendingDown className='w-5 h-5' />;
    if (pitch > 0) return <TrendingUp className='w-5 h-5' />;
    return <Minus className='w-5 h-5' />;
  };

  // Semitones를 표시 형식으로 변환
  const formatPitch = (semitones: number): string => {
    if (semitones === 0) return '0 (원본)';
    const sign = semitones > 0 ? '+' : '';
    return `${sign}${semitones} semitones`;
  };

  // 피치 변경을 위한 리샘플링 함수 (선형 보간)
  const resampleForPitch = (
    samples: Float32Array,
    pitchRatio: number
  ): Float32Array => {
    if (pitchRatio === 1.0) {
      return new Float32Array(samples);
    }

    const inputLength = samples.length;
    // 원본 길이 유지 (템포 유지)
    const outputLength = inputLength;
    const result = new Float32Array(outputLength);

    for (let i = 0; i < outputLength; i++) {
      // 원본 샘플 인덱스 계산
      // 피치를 높이면 (pitchRatio > 1): 원본을 더 빠르게 읽음
      // 피치를 낮추면 (pitchRatio < 1): 원본을 더 느리게 읽음
      const sourceIndex = i / pitchRatio;
      const indexFloor = Math.floor(sourceIndex);
      const indexCeil = Math.min(indexFloor + 1, inputLength - 1);
      const fraction = sourceIndex - indexFloor;

      // 선형 보간
      if (indexFloor >= 0 && indexFloor < inputLength) {
        if (indexCeil < inputLength && indexCeil > indexFloor) {
          // 두 샘플 사이 선형 보간
          result[i] =
            samples[indexFloor] * (1 - fraction) +
            samples[indexCeil] * fraction;
        } else {
          // 경계 처리: 마지막 샘플 사용
          result[i] = samples[indexFloor];
        }
      } else if (indexFloor < 0) {
        // 시작 부분: 첫 샘플 사용
        result[i] = samples[0];
      } else {
        // 끝 부분: 마지막 샘플 사용
        result[i] = samples[inputLength - 1];
      }
    }

    return result;
  };

  // 피치 변경 및 다운로드
  const handleChangePitch = async () => {
    if (!audioBuffer || !audioFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      // 피치 변경을 위한 비율 계산
      // pitch > 0: 피치가 높아짐 (주파수가 높아짐)
      // pitch < 0: 피치가 낮아짐 (주파수가 낮아짐)
      const pitchRatio = Math.pow(2, pitch / 12); // semitones를 주파수 비율로 변환
      const originalSampleRate = audioBuffer.sampleRate;
      const numberOfChannels = audioBuffer.numberOfChannels;
      const originalLength = audioBuffer.length;

      // 템포는 유지하므로 재생 시간(길이)은 동일
      const newLength = originalLength;

      // 새로운 AudioBuffer 생성 (원본 샘플레이트 유지)
      const newBuffer = audioContext.createBuffer(
        numberOfChannels,
        newLength,
        originalSampleRate
      );

      // 피치 시프팅을 위한 리샘플링 (모든 채널 처리)
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const originalData = audioBuffer.getChannelData(channel);
        const resampledData = resampleForPitch(originalData, pitchRatio);
        const newData = newBuffer.getChannelData(channel);

        // 리샘플링된 데이터를 새 버퍼에 복사
        const copyLength = Math.min(resampledData.length, newLength);
        for (let i = 0; i < copyLength; i++) {
          newData[i] = resampledData[i];
        }

        // 남은 공간이 있으면 0으로 채우기 (무음)
        if (copyLength < newLength) {
          for (let i = copyLength; i < newLength; i++) {
            newData[i] = 0;
          }
        }
      }

      // WAV로 변환
      const wavBlob = audioBufferToWav(newBuffer);

      // 다운로드
      const url = URL.createObjectURL(wavBlob);
      const a = document.createElement('a');
      a.href = url;
      const originalName = audioFile.name.replace(/\.[^/.]+$/, '');
      const pitchText =
        pitch === 0 ? '' : pitch > 0 ? `_+${pitch}st` : `_${pitch}st`;
      a.download = `${originalName}${pitchText}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('피치 변경 중 오류가 발생했습니다.');
      console.error('Pitch change error:', err);
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
      if (sourceRef.current) {
        sourceRef.current.stop();
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
              음정 변경
            </h1>
            <p className='text-gray-600 dark:text-gray-400'>
              오디오 파일의 음높이를 변경하세요 (템포는 유지됩니다)
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
                      setCurrentTime(0);
                      setPitch(0);
                      setIsPlaying(false);
                      if (sourceRef.current) {
                        sourceRef.current.stop();
                        sourceRef.current = null;
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

              {/* 피치 조절 영역 */}
              <div className='mb-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg'>
                <div className='flex items-center gap-4 mb-4'>
                  {getPitchIcon()}
                  <span className='text-lg font-semibold text-gray-900 dark:text-white min-w-[200px]'>
                    {formatPitch(pitch)}
                  </span>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => setPitch(0)}
                    className='flex items-center gap-1'
                  >
                    <RotateCcw className='w-4 h-4' />
                    초기화
                  </Button>
                </div>

                {/* 피치 슬라이더 */}
                <div className='relative'>
                  <input
                    type='range'
                    min='-12'
                    max='12'
                    step='1'
                    value={pitch}
                    onChange={e => setPitch(Number(e.target.value))}
                    className='w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider'
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${
                        ((pitch + 12) / 24) * 100
                      }%, #e5e7eb ${((pitch + 12) / 24) * 100}%, #e5e7eb 100%)`,
                    }}
                  />
                  <div className='flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-2'>
                    <span>-12 semitones</span>
                    <span className='font-medium'>0 (원본)</span>
                    <span>+12 semitones</span>
                  </div>
                </div>

                {/* 빠른 선택 버튼 */}
                <div className='mt-4 flex flex-wrap gap-2 justify-center'>
                  {[-12, -6, -3, 0, 3, 6, 12].map(value => (
                    <Button
                      key={value}
                      variant={pitch === value ? 'default' : 'outline'}
                      size='sm'
                      onClick={() => setPitch(value)}
                    >
                      {formatPitch(value)}
                    </Button>
                  ))}
                </div>

                {/* 피치 설명 */}
                <div className='mt-4 text-sm text-gray-600 dark:text-gray-400'>
                  <p>
                    • -12 ~ 0 semitones: 피치 감소 (낮은 음)
                    <br />• 0: 원본 피치 유지
                    <br />• 0 ~ +12 semitones: 피치 증가 (높은 음)
                    <br />• 1 semitone = 반음 (예: C → C#)
                  </p>
                </div>
              </div>

              {/* 다운로드 버튼 */}
              <div className='flex justify-center'>
                <Button
                  onClick={handleChangePitch}
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
              <li>피치 슬라이더를 조절하여 원하는 음높이를 설정하세요</li>
              <li>변경된 파일 다운로드 버튼을 클릭하여 저장하세요</li>
            </ol>

            <div className='mt-4 pt-4 border-t border-gray-200 dark:border-gray-600'>
              <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                주요 기능
              </h3>
              <ul className='space-y-1 text-sm text-gray-600 dark:text-gray-400'>
                <li className='flex items-start gap-2'>
                  <span className='text-green-500 mt-1'>✓</span>
                  <span>-12 ~ +12 semitones 범위의 피치 조절</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-green-500 mt-1'>✓</span>
                  <span>템포는 유지하면서 음높이만 변경</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-green-500 mt-1'>✓</span>
                  <span>실시간 재생으로 피치 미리보기</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-green-500 mt-1'>✓</span>
                  <span>
                    빠른 선택 버튼 (-12, -6, -3, 0, +3, +6, +12 semitones)
                  </span>
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
