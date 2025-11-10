'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Upload,
  Play,
  Pause,
  Download,
  Music,
  X,
  GripVertical,
  Trash2,
} from 'lucide-react';

// 트랙 정보 타입
type Track = {
  id: string;
  file: File;
  buffer: AudioBuffer;
  url: string;
  startTime: number; // 시작 시간 (초)
  endTime: number; // 끝 시간 (초)
  duration: number; // 전체 길이 (초)
};

export default function AudioJoiner() {
  // 상태 관리
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [fadeInFirst, setFadeInFirst] = useState(false);
  const [fadeOutLast, setFadeOutLast] = useState(false);
  const [crossfade, setCrossfade] = useState(false);
  const [crossfadeDuration, setCrossfadeDuration] = useState(2); // 크로스페이드 시간 (초)
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mergedUrl, setMergedUrl] = useState<string | null>(null);

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

  // 총 길이 계산
  const totalDuration = tracks.reduce((sum, track) => {
    const trackDuration = track.endTime - track.startTime;
    return sum + trackDuration;
  }, 0);

  // 파일 선택 핸들러
  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setError(null);
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    audioContextRef.current = audioContext;

    const newTracks: Track[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('audio/')) {
        setError(`${file.name}은(는) 오디오 파일이 아닙니다.`);
        continue;
      }

      try {
        const url = URL.createObjectURL(file);
        const arrayBuffer = await file.arrayBuffer();
        const buffer = await audioContext.decodeAudioData(arrayBuffer);

        const duration = buffer.duration;

        newTracks.push({
          id: `${Date.now()}-${i}`,
          file,
          buffer,
          url,
          startTime: 0,
          endTime: duration,
          duration,
        });
      } catch (err) {
        setError(`${file.name}을(를) 로드할 수 없습니다.`);
        console.error('Audio loading error:', err);
      }
    }

    setTracks(prev => [...prev, ...newTracks]);
  };

  // 드래그 앤 드롭 핸들러
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // 트랙 제거
  const removeTrack = (id: string) => {
    setTracks(prev => {
      const track = prev.find(t => t.id === id);
      if (track) {
        URL.revokeObjectURL(track.url);
      }
      return prev.filter(t => t.id !== id);
    });
  };

  // 트랙 시작/끝 시간 업데이트
  const updateTrackTime = (
    id: string,
    type: 'start' | 'end',
    value: number
  ) => {
    setTracks(prev =>
      prev.map(track => {
        if (track.id === id) {
          if (type === 'start') {
            return {
              ...track,
              startTime: Math.max(0, Math.min(value, track.endTime - 0.1)),
            };
          } else {
            return {
              ...track,
              endTime: Math.min(
                track.duration,
                Math.max(value, track.startTime + 0.1)
              ),
            };
          }
        }
        return track;
      })
    );
  };

  // 트랙 순서 변경
  const moveTrack = (fromIndex: number, toIndex: number) => {
    setTracks(prev => {
      const newTracks = [...prev];
      const [moved] = newTracks.splice(fromIndex, 1);
      newTracks.splice(toIndex, 0, moved);
      return newTracks;
    });
  };

  // 병합된 오디오 재생
  const togglePlay = async () => {
    if (tracks.length === 0) return;

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
      // 병합된 오디오가 없으면 생성
      if (!mergedUrl) {
        await createMergedAudio();
      }

      if (mergedUrl) {
        if (!audioRef.current) {
          const audio = new Audio(mergedUrl);
          audioRef.current = audio;

          audio.onended = () => {
            setIsPlaying(false);
            setCurrentTime(totalDuration);
            if (progressIntervalRef.current) {
              clearInterval(progressIntervalRef.current);
              progressIntervalRef.current = null;
            }
          };
        }

        const audio = audioRef.current;
        audio.currentTime = currentTime;
        audio.play();

        // 재생 위치 추적
        progressIntervalRef.current = setInterval(() => {
          if (audio) {
            setCurrentTime(audio.currentTime);
            if (audio.currentTime >= totalDuration) {
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
    }
  };

  // Fade 효과 적용
  const applyFade = (
    data: Float32Array,
    fadeLength: number,
    fadeType: 'in' | 'out',
    sampleRate: number
  ) => {
    const fadeSamples = Math.floor(fadeLength * sampleRate);
    const fadeEnd = fadeType === 'in' ? fadeSamples : data.length;

    for (let i = 0; i < fadeSamples && i < data.length; i++) {
      const index = fadeType === 'in' ? i : data.length - 1 - i;
      const fadeValue = i / fadeSamples;
      data[index] *= fadeValue;
    }
  };

  // Crossfade 적용
  const applyCrossfade = (
    data1: Float32Array,
    data2: Float32Array,
    fadeSamples: number
  ): Float32Array => {
    const result = new Float32Array(data1.length + data2.length - fadeSamples);

    // 첫 번째 트랙 (크로스페이드 부분 제외)
    for (let i = 0; i < data1.length - fadeSamples; i++) {
      result[i] = data1[i];
    }

    // 크로스페이드 부분
    for (let i = 0; i < fadeSamples; i++) {
      const fadeValue = i / fadeSamples;
      const index1 = data1.length - fadeSamples + i;
      const index2 = i;
      result[data1.length - fadeSamples + i] =
        data1[index1] * (1 - fadeValue) + data2[index2] * fadeValue;
    }

    // 두 번째 트랙 (크로스페이드 부분 제외)
    for (let i = fadeSamples; i < data2.length; i++) {
      result[data1.length - fadeSamples + i] = data2[i];
    }

    return result;
  };

  // 병합된 오디오 생성
  const createMergedAudio = async () => {
    if (tracks.length === 0) return;

    setIsProcessing(true);
    setError(null);

    try {
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      // 샘플레이트는 첫 번째 트랙의 것을 사용
      const sampleRate = tracks[0].buffer.sampleRate;
      const numberOfChannels = tracks[0].buffer.numberOfChannels;

      // 각 트랙의 길이 계산
      const trackLengths: number[] = [];
      let totalLength = 0;

      tracks.forEach((track, index) => {
        const startSample = Math.floor(track.startTime * sampleRate);
        const endSample = Math.floor(track.endTime * sampleRate);
        const length = endSample - startSample;
        trackLengths.push(length);
        totalLength += length;

        // 크로스페이드가 활성화되고 마지막 트랙이 아니면 크로스페이드 길이만큼 빼기
        if (crossfade && index < tracks.length - 1) {
          const fadeSamples = Math.floor(crossfadeDuration * sampleRate);
          totalLength -= fadeSamples;
        }
      });

      // 새로운 AudioBuffer 생성
      const mergedBuffer = audioContext.createBuffer(
        numberOfChannels,
        totalLength,
        sampleRate
      );

      // 각 채널에 대해 병합
      for (let channel = 0; channel < numberOfChannels; channel++) {
        const mergedData = mergedBuffer.getChannelData(channel);
        let offset = 0;

        tracks.forEach((track, trackIndex) => {
          const trackData = track.buffer.getChannelData(channel);
          const channelData = new Float32Array(trackData);
          const startSample = Math.floor(track.startTime * sampleRate);
          const endSample = Math.floor(track.endTime * sampleRate);
          const trackLength = endSample - startSample;
          const trimmedData = channelData.subarray(startSample, endSample);

          // Fade-in (첫 번째 트랙)
          if (fadeInFirst && trackIndex === 0) {
            applyFade(trimmedData, 0.5, 'in', sampleRate);
          }

          // Fade-out (마지막 트랙)
          if (fadeOutLast && trackIndex === tracks.length - 1) {
            applyFade(trimmedData, 0.5, 'out', sampleRate);
          }

          // 크로스페이드 처리
          if (crossfade && trackIndex < tracks.length - 1) {
            const fadeSamples = Math.floor(crossfadeDuration * sampleRate);
            const nextTrack = tracks[trackIndex + 1];
            const nextTrackData = nextTrack.buffer.getChannelData(channel);
            const nextChannelData = new Float32Array(nextTrackData);
            const nextStartSample = Math.floor(
              nextTrack.startTime * sampleRate
            );
            const nextEndSample = Math.floor(nextTrack.endTime * sampleRate);
            const nextTrimmedData = nextChannelData.subarray(
              nextStartSample,
              nextEndSample
            );

            // 크로스페이드 적용
            const crossfadedData = applyCrossfade(
              trimmedData,
              nextTrimmedData,
              fadeSamples
            );

            // 병합된 데이터에 복사
            for (let i = 0; i < crossfadedData.length; i++) {
              mergedData[offset + i] = crossfadedData[i];
            }

            offset += crossfadedData.length;
          } else {
            // 크로스페이드 없이 그냥 복사
            for (let i = 0; i < trimmedData.length; i++) {
              mergedData[offset + i] = trimmedData[i];
            }
            offset += trimmedData.length;
          }
        });
      }

      // WAV로 변환
      const wavBlob = audioBufferToWav(mergedBuffer);
      const url = URL.createObjectURL(wavBlob);
      setMergedUrl(url);

      // 기존 오디오 정리
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    } catch (err) {
      setError('오디오 병합 중 오류가 발생했습니다.');
      console.error('Merge error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // 다운로드
  const handleDownload = async () => {
    if (tracks.length === 0) return;

    if (!mergedUrl) {
      await createMergedAudio();
    }

    if (mergedUrl) {
      const a = document.createElement('a');
      a.href = mergedUrl;
      a.download = `merged-${new Date().getTime()}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
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

  // 설정 변경 시 병합된 오디오 재생성
  useEffect(() => {
    if (mergedUrl && tracks.length > 0) {
      URL.revokeObjectURL(mergedUrl);
      setMergedUrl(null);
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [tracks, fadeInFirst, fadeOutLast, crossfade, crossfadeDuration]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (mergedUrl) {
        URL.revokeObjectURL(mergedUrl);
      }
      tracks.forEach(track => {
        URL.revokeObjectURL(track.url);
      });
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
  }, []);

  return (
    <div className='flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4'>
      <div className='w-full max-w-6xl'>
        <div className='bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12'>
          {/* 제목 */}
          <div className='text-center mb-8'>
            <h1 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2'>
              오디오 조인
            </h1>
            <p className='text-gray-600 dark:text-gray-400'>
              여러 오디오 파일을 하나로 병합하세요
            </p>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className='mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
              <p className='text-red-800 dark:text-red-200 text-sm'>{error}</p>
            </div>
          )}

          {/* 파일 업로드 영역 */}
          {tracks.length === 0 && (
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
                여러 파일을 한 번에 선택할 수 있습니다
              </p>
              <input
                ref={fileInputRef}
                type='file'
                accept='audio/*'
                multiple
                className='hidden'
                onChange={e => handleFileSelect(e.target.files)}
              />
            </div>
          )}

          {/* 트랙 목록 */}
          {tracks.length > 0 && (
            <>
              {/* 추가 파일 업로드 */}
              <div className='mb-6'>
                <Button
                  variant='outline'
                  onClick={() => fileInputRef.current?.click()}
                  className='flex items-center gap-2'
                >
                  <Upload className='w-4 h-4' />
                  파일 추가
                </Button>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='audio/*'
                  multiple
                  className='hidden'
                  onChange={e => handleFileSelect(e.target.files)}
                />
              </div>

              {/* 트랙 목록 */}
              <div className='mb-6 space-y-4'>
                {tracks.map((track, index) => (
                  <div
                    key={track.id}
                    className='p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg'
                  >
                    <div className='flex items-center justify-between mb-4'>
                      <div className='flex items-center gap-3 flex-1'>
                        <GripVertical className='w-5 h-5 text-gray-400 cursor-move' />
                        <Music className='w-5 h-5 text-blue-500' />
                        <div className='flex-1 min-w-0'>
                          <p className='font-medium text-gray-900 dark:text-white truncate'>
                            {track.file.name}
                          </p>
                          <p className='text-sm text-gray-500 dark:text-gray-400'>
                            전체: {formatTime(track.duration)} | 선택:{' '}
                            {formatTime(track.endTime - track.startTime)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => removeTrack(track.id)}
                        className='text-red-600 hover:text-red-700'
                      >
                        <Trash2 className='w-4 h-4' />
                      </Button>
                    </div>

                    {/* 시작/끝 시간 조절 */}
                    <div className='space-y-2'>
                      <div>
                        <label className='text-xs text-gray-600 dark:text-gray-400 mb-1 block'>
                          시작: {formatTime(track.startTime)}
                        </label>
                        <input
                          type='range'
                          min='0'
                          max={track.duration}
                          step='0.1'
                          value={track.startTime}
                          onChange={e =>
                            updateTrackTime(
                              track.id,
                              'start',
                              Number(e.target.value)
                            )
                          }
                          className='w-full'
                        />
                      </div>
                      <div>
                        <label className='text-xs text-gray-600 dark:text-gray-400 mb-1 block'>
                          끝: {formatTime(track.endTime)}
                        </label>
                        <input
                          type='range'
                          min='0'
                          max={track.duration}
                          step='0.1'
                          value={track.endTime}
                          onChange={e =>
                            updateTrackTime(
                              track.id,
                              'end',
                              Number(e.target.value)
                            )
                          }
                          className='w-full'
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 옵션 설정 */}
              <div className='mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-4'>
                <h3 className='font-semibold text-gray-900 dark:text-white mb-3'>
                  옵션
                </h3>

                <label className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={fadeInFirst}
                    onChange={e => setFadeInFirst(e.target.checked)}
                    className='w-4 h-4'
                  />
                  <span className='text-sm text-gray-700 dark:text-gray-300'>
                    첫 번째 트랙 Fade-in
                  </span>
                </label>

                <label className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={crossfade}
                    onChange={e => setCrossfade(e.target.checked)}
                    className='w-4 h-4'
                  />
                  <span className='text-sm text-gray-700 dark:text-gray-300'>
                    모든 트랙 간 Crossfade
                  </span>
                </label>

                {crossfade && (
                  <div className='ml-6'>
                    <label className='text-xs text-gray-600 dark:text-gray-400 mb-1 block'>
                      Crossfade 시간: {crossfadeDuration}초
                    </label>
                    <input
                      type='range'
                      min='0.5'
                      max='5'
                      step='0.5'
                      value={crossfadeDuration}
                      onChange={e =>
                        setCrossfadeDuration(Number(e.target.value))
                      }
                      className='w-full'
                    />
                  </div>
                )}

                <label className='flex items-center gap-2 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={fadeOutLast}
                    onChange={e => setFadeOutLast(e.target.checked)}
                    className='w-4 h-4'
                  />
                  <span className='text-sm text-gray-700 dark:text-gray-300'>
                    마지막 트랙 Fade-out
                  </span>
                </label>
              </div>

              {/* 재생 컨트롤 */}
              <div className='mb-6'>
                <div className='flex items-center justify-center gap-4 mb-4'>
                  <Button
                    onClick={togglePlay}
                    variant='default'
                    size='lg'
                    className='flex items-center gap-2'
                    disabled={tracks.length === 0}
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
                <div className='mb-4'>
                  <div className='flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2'>
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(totalDuration)}</span>
                  </div>
                  <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                    <div
                      className='bg-blue-500 h-2 rounded-full transition-all duration-100'
                      style={{
                        width: `${
                          totalDuration > 0
                            ? (currentTime / totalDuration) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* 다운로드 버튼 */}
              <div className='flex justify-center'>
                <Button
                  onClick={handleDownload}
                  variant='default'
                  size='lg'
                  className='flex items-center gap-2'
                  disabled={isProcessing || tracks.length === 0}
                >
                  {isProcessing ? (
                    <>
                      <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                      처리 중...
                    </>
                  ) : (
                    <>
                      <Download className='w-5 h-5' />
                      병합 및 다운로드
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
              <li>여러 오디오 파일을 드래그 앤 드롭하거나 선택하세요</li>
              <li>각 트랙의 시작/끝 지점을 슬라이더로 조절하세요</li>
              <li>필요시 Fade-in, Crossfade, Fade-out 옵션을 선택하세요</li>
              <li>재생 버튼을 눌러 병합된 오디오를 미리 들어보세요</li>
              <li>병합 및 다운로드 버튼을 클릭하여 저장하세요</li>
            </ol>

            <div className='mt-4 pt-4 border-t border-gray-200 dark:border-gray-600'>
              <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                주요 기능
              </h3>
              <ul className='space-y-1 text-sm text-gray-600 dark:text-gray-400'>
                <li className='flex items-start gap-2'>
                  <span className='text-green-500 mt-1'>✓</span>
                  <span>무제한 트랙 병합</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-green-500 mt-1'>✓</span>
                  <span>각 트랙의 시작/끝 지점 개별 조절</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-green-500 mt-1'>✓</span>
                  <span>Crossfade로 트랙 간 자연스러운 전환</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-green-500 mt-1'>✓</span>
                  <span>Fade-in/out 옵션</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-green-500 mt-1'>✓</span>
                  <span>실시간 재생으로 미리보기</span>
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
