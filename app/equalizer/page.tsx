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
  Settings,
} from 'lucide-react';

// 이퀄라이저 밴드 정의 (주파수와 라벨)
const EQ_BANDS = [
  { freq: 60, label: '60Hz' },
  { freq: 170, label: '170Hz' },
  { freq: 310, label: '310Hz' },
  { freq: 600, label: '600Hz' },
  { freq: 1000, label: '1kHz' },
  { freq: 3000, label: '3kHz' },
  { freq: 6000, label: '6kHz' },
  { freq: 12000, label: '12kHz' },
  { freq: 14000, label: '14kHz' },
  { freq: 16000, label: '16kHz' },
];

// 프리셋 정의
const PRESETS = {
  flat: { name: 'Flat', values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
  bass: { name: 'Bass Boost', values: [6, 4, 2, 0, 0, 0, 0, 0, 0, 0] },
  treble: { name: 'Treble Boost', values: [0, 0, 0, 0, 0, 0, 2, 4, 6, 6] },
  vocal: { name: 'Vocal', values: [-2, -1, 0, 2, 4, 4, 2, 0, -1, -2] },
  rock: { name: 'Rock', values: [4, 2, -1, -2, 0, 2, 3, 4, 4, 4] },
  pop: { name: 'Pop', values: [-1, 0, 2, 3, 3, 2, 0, -1, -1, -1] },
  jazz: { name: 'Jazz', values: [2, 1, 0, 1, 2, 2, 1, 0, 1, 2] },
  classical: { name: 'Classical', values: [0, 0, 0, 0, 0, 0, -1, -2, -2, -2] },
};

type PresetKey = keyof typeof PRESETS;

export default function Equalizer() {
  // 상태 관리
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [eqValues, setEqValues] = useState<number[]>(
    new Array(EQ_BANDS.length).fill(0)
  ); // 각 밴드의 gain 값 (-12 ~ +12 dB)
  const [selectedPreset, setSelectedPreset] = useState<PresetKey | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const filterNodesRef = useRef<BiquadFilterNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

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
      setEqValues(new Array(EQ_BANDS.length).fill(0));
      setSelectedPreset(null);
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

  // 이퀄라이저 필터 노드 생성
  const createEQFilters = (audioContext: AudioContext): BiquadFilterNode[] => {
    const filters: BiquadFilterNode[] = [];

    EQ_BANDS.forEach((band, index) => {
      const filter = audioContext.createBiquadFilter();
      filter.type = 'peaking';
      filter.frequency.value = band.freq;
      filter.Q.value = 1;
      filter.gain.value = eqValues[index] || 0;

      // 체인 연결
      if (filters.length > 0) {
        filters[filters.length - 1].connect(filter);
      }

      filters.push(filter);
    });

    return filters;
  };

  // 재생/일시정지
  const togglePlay = async () => {
    if (!audioBuffer || !audioContextRef.current) return;

    if (isPlaying) {
      // 일시정지
      if (sourceRef.current) {
        sourceRef.current.stop();
        sourceRef.current = null;
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      filterNodesRef.current = [];
      gainNodeRef.current = null;
      setIsPlaying(false);
    } else {
      // 재생
      const audioContext = audioContextRef.current;

      // 기존 소스 정리
      if (sourceRef.current) {
        sourceRef.current.stop();
        sourceRef.current = null;
      }

      // AudioBufferSourceNode 생성
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;

      // 이퀄라이저 필터 생성 및 연결
      const filters = createEQFilters(audioContext);
      filterNodesRef.current = filters;

      // GainNode 생성
      const gainNode = audioContext.createGain();
      gainNodeRef.current = gainNode;

      // 연결: source -> filters -> gain -> destination
      source.connect(filters[0]);
      filters[filters.length - 1].connect(gainNode);
      gainNode.connect(audioContext.destination);

      // 재생 시작
      const offset = currentTime;
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
        filterNodesRef.current = [];
        gainNodeRef.current = null;
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

  // 이퀄라이저 값 변경 시 필터 업데이트
  useEffect(() => {
    if (filterNodesRef.current.length > 0) {
      filterNodesRef.current.forEach((filter, index) => {
        if (filter && eqValues[index] !== undefined) {
          filter.gain.value = eqValues[index];
        }
      });
    }
  }, [eqValues]);

  // 밴드 값 변경 핸들러
  const handleBandChange = (index: number, value: number) => {
    const newValues = [...eqValues];
    newValues[index] = value;
    setEqValues(newValues);
    setSelectedPreset(null); // 프리셋 해제
  };

  // 프리셋 적용
  const applyPreset = (presetKey: PresetKey) => {
    const preset = PRESETS[presetKey];
    setEqValues([...preset.values]);
    setSelectedPreset(presetKey);
  };

  // 이퀄라이저 리셋
  const resetEQ = () => {
    setEqValues(new Array(EQ_BANDS.length).fill(0));
    setSelectedPreset(null);
  };

  // 이퀄라이저 적용 및 다운로드
  const handleApplyEQ = async () => {
    if (!audioBuffer || !audioFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      // 오프라인 컨텍스트 생성 (오프라인 렌더링)
      const offlineContext = new OfflineAudioContext(
        audioBuffer.numberOfChannels,
        audioBuffer.length,
        audioBuffer.sampleRate
      );

      // 소스 생성
      const source = offlineContext.createBufferSource();
      source.buffer = audioBuffer;

      // 이퀄라이저 필터 생성
      const filters: BiquadFilterNode[] = [];
      EQ_BANDS.forEach((band, index) => {
        const filter = offlineContext.createBiquadFilter();
        filter.type = 'peaking';
        filter.frequency.value = band.freq;
        filter.Q.value = 1;
        filter.gain.value = eqValues[index] || 0;

        if (filters.length > 0) {
          filters[filters.length - 1].connect(filter);
        }
        filters.push(filter);
      });

      // GainNode
      const gainNode = offlineContext.createGain();

      // 연결
      source.connect(filters[0]);
      filters[filters.length - 1].connect(gainNode);
      gainNode.connect(offlineContext.destination);

      // 렌더링 시작
      source.start(0);

      // 오프라인 렌더링 완료 대기
      const renderedBuffer = await offlineContext.startRendering();

      // WAV로 변환
      const wavBlob = audioBufferToWav(renderedBuffer);

      // 다운로드
      const url = URL.createObjectURL(wavBlob);
      const a = document.createElement('a');
      a.href = url;
      const originalName = audioFile.name.replace(/\.[^/.]+$/, '');
      a.download = `${originalName}_eq.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('이퀄라이저 적용 중 오류가 발생했습니다.');
      console.error('EQ apply error:', err);
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

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
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
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4'>
      <div className='w-full max-w-6xl'>
        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12'>
          {/* 제목 */}
          <div className='text-center mb-8'>
            <h1 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2'>
              오디오 이퀄라이저
            </h1>
            <p className='text-gray-600 dark:text-gray-400'>
              주파수 밴드를 조절하여 오디오를 세밀하게 조정하세요
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
                      setCurrentTime(0);
                      resetEQ();
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

              {/* 프리셋 선택 */}
              <div className='mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg'>
                <div className='flex items-center gap-2 mb-3'>
                  <Settings className='w-5 h-5 text-gray-600 dark:text-gray-400' />
                  <h3 className='font-semibold text-gray-900 dark:text-white'>
                    프리셋
                  </h3>
                </div>
                <div className='flex flex-wrap gap-2'>
                  {Object.keys(PRESETS).map(key => (
                    <Button
                      key={key}
                      variant={selectedPreset === key ? 'default' : 'outline'}
                      size='sm'
                      onClick={() => applyPreset(key as PresetKey)}
                    >
                      {PRESETS[key as PresetKey].name}
                    </Button>
                  ))}
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={resetEQ}
                    className='flex items-center gap-1'
                  >
                    <RotateCcw className='w-4 h-4' />
                    리셋
                  </Button>
                </div>
              </div>

              {/* 이퀄라이저 밴드 */}
              <div className='mb-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-lg'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-6 text-center'>
                  주파수 밴드 조절 (-12dB ~ +12dB)
                </h3>
                <div className='grid grid-cols-5 md:grid-cols-10 gap-4'>
                  {EQ_BANDS.map((band, index) => (
                    <div
                      key={index}
                      className='flex flex-col items-center gap-2'
                    >
                      <label className='text-xs font-medium text-gray-600 dark:text-gray-400 text-center'>
                        {band.label}
                      </label>
                      <div className='relative w-full h-48 flex flex-col items-center'>
                        <input
                          type='range'
                          min='-12'
                          max='12'
                          step='0.5'
                          value={eqValues[index] || 0}
                          onChange={e =>
                            handleBandChange(index, Number(e.target.value))
                          }
                          className='w-8 h-full writing-vertical-rl appearance-none bg-transparent cursor-pointer slider-vertical'
                          style={{
                            writingMode: 'vertical-rl',
                            transform: 'rotate(180deg)',
                          }}
                        />
                        <div className='absolute bottom-0 text-xs font-medium text-gray-700 dark:text-gray-300 min-h-[20px]'>
                          {eqValues[index] > 0
                            ? `+${eqValues[index].toFixed(1)}`
                            : eqValues[index] === 0
                            ? '0'
                            : eqValues[index].toFixed(1)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 다운로드 버튼 */}
              <div className='flex justify-center'>
                <Button
                  onClick={handleApplyEQ}
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
                      이퀄라이저 적용 및 다운로드
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
              <li>
                프리셋을 선택하거나 각 주파수 밴드를 개별적으로 조절하세요
              </li>
              <li>실시간으로 변경 사항을 확인할 수 있습니다</li>
              <li>이퀄라이저 적용 및 다운로드 버튼을 클릭하여 저장하세요</li>
            </ol>

            <div className='mt-4 pt-4 border-t border-gray-200 dark:border-gray-600'>
              <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                주요 기능
              </h3>
              <ul className='space-y-1 text-sm text-gray-600 dark:text-gray-400'>
                <li className='flex items-start gap-2'>
                  <span className='text-green-500 mt-1'>✓</span>
                  <span>10개 주파수 밴드 개별 조절 (60Hz ~ 16kHz)</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-green-500 mt-1'>✓</span>
                  <span>
                    8가지 프리셋 제공 (Flat, Bass, Treble, Vocal, Rock, Pop,
                    Jazz, Classical)
                  </span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-green-500 mt-1'>✓</span>
                  <span>실시간 재생으로 변경 사항 즉시 확인</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-green-500 mt-1'>✓</span>
                  <span>-12dB ~ +12dB 범위의 세밀한 조절</span>
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
