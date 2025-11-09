'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Square, Play, Pause, Download, Trash2 } from 'lucide-react';
// lamejs는 동적 import로 로드 (브라우저 호환성)

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
  const [isConverting, setIsConverting] = useState(false); // MP3 변환 중 여부

  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const sourceRef = useRef<
    | MediaStreamAudioSourceNode
    | AudioBufferSourceNode
    | MediaElementAudioSourceNode
    | null
  >(null);

  // 녹음 시간 포맷팅 (MM:SS)
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  // 웨이브 그리기 함수
  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas || !analyserRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);

      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)'; // 어두운 파란색 배경
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 기준선 그리기 (중앙)
      ctx.strokeStyle = 'rgba(34, 211, 238, 0.5)'; // 청록색 기준선
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      // 웨이브 그리기
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#22d3ee'; // 청록색 웨이브
      ctx.beginPath();

      const sliceWidth = canvas.width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

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

  // WAV를 MP3로 변환
  const convertToMp3 = async (audioBlob: Blob): Promise<Blob> => {
    return new Promise(async (resolve, reject) => {
      try {
        // lamejstmp 동적 import (lamejs의 버그 수정 버전)
        // @ts-ignore
        const lamejstmpModule = await import('lamejstmp');

        // lamejstmp는 다양한 방식으로 export될 수 있음 - 모든 가능한 경로 시도
        let Mp3Encoder: any = null;

        // 경로 1: 직접 export
        if (lamejstmpModule.Mp3Encoder) {
          Mp3Encoder = lamejstmpModule.Mp3Encoder;
        }
        // 경로 2: default export
        else if (lamejstmpModule.default?.Mp3Encoder) {
          Mp3Encoder = lamejstmpModule.default.Mp3Encoder;
        }
        // 경로 3: default가 객체인 경우
        else if (
          lamejstmpModule.default &&
          typeof lamejstmpModule.default === 'object'
        ) {
          const defaultObj = lamejstmpModule.default as any;
          if (defaultObj.Mp3Encoder) {
            Mp3Encoder = defaultObj.Mp3Encoder;
          } else if (defaultObj.lamejs?.Mp3Encoder) {
            Mp3Encoder = defaultObj.lamejs.Mp3Encoder;
          }
        }
        // 경로 4: lamejs 속성
        else if ((lamejstmpModule as any).lamejs?.Mp3Encoder) {
          Mp3Encoder = (lamejstmpModule as any).lamejs.Mp3Encoder;
        }

        if (!Mp3Encoder) {
          console.error('lamejstmp 모듈 구조:', lamejstmpModule);
          throw new Error(
            'Mp3Encoder를 찾을 수 없습니다. 모듈 구조를 확인해주세요.'
          );
        }

        const reader = new FileReader();
        reader.onload = async e => {
          try {
            const arrayBuffer = e.target?.result as ArrayBuffer;
            const audioContext = new (window.AudioContext ||
              (window as any).webkitAudioContext)();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

            // 오디오 데이터를 16비트 PCM으로 변환
            // getChannelData가 반환하는 Float32Array를 새로운 배열로 복사하여 타입 호환성 확보
            const channelData = audioBuffer.getChannelData(0);
            const samples = new Float32Array(channelData);
            const originalSampleRate = audioBuffer.sampleRate;
            const targetSampleRate = 44100;

            // 리샘플링 (필요한 경우)
            let resampledSamples: Float32Array = samples;
            if (originalSampleRate !== targetSampleRate) {
              const resampled = resample(
                samples,
                originalSampleRate,
                targetSampleRate
              );
              // 타입 호환성을 위해 새로운 Float32Array로 복사
              resampledSamples = new Float32Array(resampled);
            }

            // 16비트 PCM으로 변환
            const pcm16 = new Int16Array(resampledSamples.length);
            for (let i = 0; i < resampledSamples.length; i++) {
              const s = Math.max(-1, Math.min(1, resampledSamples[i]));
              pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
            }

            // MP3 인코딩 - 올바른 생성자 사용
            const mp3encoder = new Mp3Encoder(1, targetSampleRate, 128); // 모노, 128kbps
            const sampleBlockSize = 1152;
            const mp3Data = [];

            for (let i = 0; i < pcm16.length; i += sampleBlockSize) {
              const sampleChunk = pcm16.subarray(i, i + sampleBlockSize);
              const mp3buf = mp3encoder.encodeBuffer(sampleChunk);
              if (mp3buf.length > 0) {
                mp3Data.push(mp3buf);
              }
            }

            // 마지막 버퍼 플러시
            const mp3buf = mp3encoder.flush();
            if (mp3buf.length > 0) {
              mp3Data.push(mp3buf);
            }

            // Blob 생성
            const mp3Blob = new Blob(mp3Data, { type: 'audio/mp3' });
            resolve(mp3Blob);
          } catch (err) {
            reject(err);
          }
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(audioBlob);
      } catch (err) {
        reject(err);
      }
    });
  };

  // 리샘플링 함수
  const resample = (
    samples: Float32Array | ArrayLike<number>,
    fromRate: number,
    toRate: number
  ): Float32Array => {
    // 입력을 배열로 변환 (타입 호환성을 위해)
    const inputValues: number[] = [];
    for (let i = 0; i < samples.length; i++) {
      inputValues.push(samples[i]);
    }

    if (fromRate === toRate) {
      // 새로운 ArrayBuffer를 사용하여 Float32Array 생성
      return new Float32Array(inputValues);
    }

    const ratio = fromRate / toRate;
    const newLength = Math.round(inputValues.length / ratio);
    // 새로운 ArrayBuffer를 사용하여 Float32Array 생성
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
      // AudioContext 및 AnalyserNode 설정 (웨이브용)
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyserRef.current = analyser;

      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;
      source.connect(analyser);

      // 웨이브 그리기 시작
      drawWaveform();

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
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setRecordingState('recorded');
        setRecordingTime(0);

        // 웨이브 중지
        stopWaveform();

        // 스트림 정리
        stream.getTracks().forEach(track => track.stop());
        streamRef.current = null;

        // AudioContext 정리
        if (sourceRef.current) {
          sourceRef.current.disconnect();
          sourceRef.current = null;
        }
        if (audioContextRef.current) {
          await audioContextRef.current.close();
          audioContextRef.current = null;
        }
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
  const playRecording = async () => {
    if (!audioUrl) return;

    if (!audioRef.current) {
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
        stopWaveform();
      };
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      stopWaveform();
    } else {
      // 재생 중 웨이브 표시를 위한 AudioContext 설정
      try {
        const audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        audioContextRef.current = audioContext;

        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        analyserRef.current = analyser;

        const source = audioContext.createMediaElementSource(audioRef.current);
        sourceRef.current = source;
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        // 웨이브 그리기 시작
        drawWaveform();
      } catch (err) {
        console.error('Audio context error:', err);
      }

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

    // 웨이브 중지
    stopWaveform();

    // AudioContext 정리
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }

    // 상태 초기화
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingState('idle');
    setRecordingTime(0);
    setIsPlaying(false);
    setError(null);
  };

  // 오디오 다운로드 (MP3로 변환)
  const downloadRecording = async () => {
    if (!audioBlob) return;

    setIsConverting(true);
    try {
      // 먼저 WAV로 변환
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      // WAV Blob 생성
      const wavBlob = audioBufferToWav(audioBuffer);

      // MP3로 변환
      const mp3Blob = await convertToMp3(wavBlob);

      // 다운로드
      const url = URL.createObjectURL(mp3Blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `recording-${new Date().getTime()}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('MP3 conversion error:', err);
      setError('MP3 변환 중 오류가 발생했습니다. 원본 파일을 다운로드합니다.');

      // 변환 실패 시 원본 파일 다운로드
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
    } finally {
      setIsConverting(false);
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
    // 채널 데이터를 미리 가져와서 타입 호환성 확보
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
      // 타이머 정리
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      // 웨이브 애니메이션 정리
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // 스트림 정리
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      // AudioContext 정리
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }

      // 오디오 URL 정리
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
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

          {/* 웨이브 시각화 영역 */}
          <div className='mb-8 rounded-lg overflow-hidden bg-slate-900'>
            <canvas
              ref={canvasRef}
              className='w-full h-[200px] block'
              style={{ background: 'rgba(15, 23, 42, 0.9)' }}
            />
          </div>

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
                disabled={isConverting}
              >
                {isConverting ? (
                  <>
                    <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                    변환 중...
                  </>
                ) : (
                  <>
                    <Download className='w-5 h-5' />
                    MP3 다운로드
                  </>
                )}
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
              <span>실시간 오디오 웨이브 시각화</span>
            </li>
            <li className='flex items-start gap-2'>
              <span className='text-green-500 mt-1'>✓</span>
              <span>MP3 형식으로 다운로드 (128kbps)</span>
            </li>
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
