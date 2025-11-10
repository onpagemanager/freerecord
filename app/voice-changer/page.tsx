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
  Mic,
  Square,
} from 'lucide-react';

// 음성 효과 타입 정의
type VoiceEffect =
  | 'none'
  | 'deep'
  | 'high'
  | 'robot'
  | 'echo'
  | 'reverse'
  | 'telephone'
  | 'alien'
  | 'monster'
  | 'reverb';

// 효과 정보
const VOICE_EFFECTS: {
  id: VoiceEffect;
  name: string;
  description: string;
}[] = [
  { id: 'none', name: '원본', description: '효과 없음' },
  { id: 'deep', name: '깊은 음성', description: '음성을 깊게 만듭니다' },
  { id: 'high', name: '높은 음성', description: '음성을 높게 만듭니다' },
  { id: 'robot', name: '로봇 음성', description: '로봇처럼 메탈릭한 음성' },
  { id: 'echo', name: '에코', description: '에코 효과를 추가합니다' },
  { id: 'reverse', name: '역방향', description: '오디오를 역방향으로 재생' },
  { id: 'telephone', name: '전화기', description: '전화기 음성 효과' },
  { id: 'alien', name: '외계인', description: '워블링 외계인 음성' },
  { id: 'monster', name: '몬스터', description: '깊고 왜곡된 몬스터 음성' },
  { id: 'reverb', name: '리버브', description: '공간감을 주는 리버브 효과' },
];

// 녹음 상태 타입
type RecordingState = 'idle' | 'recording' | 'recorded';

export default function VoiceChanger() {
  // 상태 관리
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [selectedEffect, setSelectedEffect] = useState<VoiceEffect>('none');
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 녹음 관련 상태
  const [recordingState, setRecordingState] = useState<RecordingState>('idle');
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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
      setSelectedEffect('none');
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
      // MediaRecorder 생성
      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : MediaRecorder.isTypeSupported('audio/mp4')
        ? 'audio/mp4'
        : 'audio/webm';

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      // 녹음 데이터 수집
      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // 녹음 완료 처리
      mediaRecorder.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(blob);

        // 스트림 정리
        stream.getTracks().forEach(track => track.stop());
        streamRef.current = null;

        // AudioBuffer로 변환
        try {
          const audioContext = new (window.AudioContext ||
            (window as any).webkitAudioContext)();
          audioContextRef.current = audioContext;

          const arrayBuffer = await blob.arrayBuffer();
          const buffer = await audioContext.decodeAudioData(arrayBuffer);
          setAudioBuffer(buffer);

          const url = URL.createObjectURL(blob);
          setAudioUrl(url);

          const length = buffer.duration;
          setDuration(length);
          setCurrentTime(0);
          setSelectedEffect('none');
          setRecordingState('recorded');
          setRecordingTime(0);
        } catch (err) {
          setError('녹음 파일을 처리할 수 없습니다.');
          console.error('Recording process error:', err);
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

  // 음성 효과 적용 함수
  const applyVoiceEffect = (
    audioContext: AudioContext | OfflineAudioContext,
    source: AudioBufferSourceNode,
    effect: VoiceEffect
  ): AudioNode => {
    let output: AudioNode = source;

    switch (effect) {
      case 'deep':
        // 깊은 음성: 피치 낮춤
        source.detune.value = -1200; // -12 semitones
        output = source;
        break;

      case 'high':
        // 높은 음성: 피치 높임
        source.detune.value = 1200; // +12 semitones
        output = source;
        break;

      case 'robot':
        // 로봇 음성: 필터링 + 왜곡
        const robotFilter = audioContext.createBiquadFilter();
        robotFilter.type = 'bandpass';
        robotFilter.frequency.value = 2000;
        robotFilter.Q.value = 5;
        source.connect(robotFilter);

        const robotGain = audioContext.createGain();
        robotGain.gain.value = 1.5;
        robotFilter.connect(robotGain);
        output = robotGain;
        break;

      case 'echo':
        // 에코 효과: DelayNode 사용
        const delay = audioContext.createDelay(1.0);
        delay.delayTime.value = 0.3;

        const feedback = audioContext.createGain();
        feedback.gain.value = 0.3;

        const echoGain = audioContext.createGain();
        echoGain.gain.value = 0.7;

        source.connect(echoGain);
        source.connect(delay);
        delay.connect(feedback);
        feedback.connect(delay);
        delay.connect(echoGain);
        output = echoGain;
        break;

      case 'telephone':
        // 전화기 음성: 고주파/저주파 제거
        const lowPass = audioContext.createBiquadFilter();
        lowPass.type = 'lowpass';
        lowPass.frequency.value = 3000;

        const highPass = audioContext.createBiquadFilter();
        highPass.type = 'highpass';
        highPass.frequency.value = 300;

        source.connect(highPass);
        highPass.connect(lowPass);
        output = lowPass;
        break;

      case 'alien':
        // 외계인 음성: 워블링 효과 (OscillatorNode로 피치 변조)
        const oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.value = 5; // 5Hz 워블링

        const gainModulator = audioContext.createGain();
        gainModulator.gain.value = 200; // ±200 cents 변조

        oscillator.connect(gainModulator);
        gainModulator.connect(source.detune);

        oscillator.start();

        // OscillatorNode는 재생 중 유지되어야 하므로 ref에 저장
        (source as any).modulator = oscillator;
        output = source;
        break;

      case 'monster':
        // 몬스터 음성: 깊은 음성 + 왜곡
        source.detune.value = -1500; // -15 semitones

        const monsterFilter = audioContext.createBiquadFilter();
        monsterFilter.type = 'lowpass';
        monsterFilter.frequency.value = 1000;
        source.connect(monsterFilter);

        const monsterGain = audioContext.createGain();
        monsterGain.gain.value = 1.3;
        monsterFilter.connect(monsterGain);
        output = monsterGain;
        break;

      case 'reverb':
        // 리버브 효과: 여러 DelayNode 조합
        const reverbDelay1 = audioContext.createDelay(2.0);
        reverbDelay1.delayTime.value = 0.1;

        const reverbDelay2 = audioContext.createDelay(2.0);
        reverbDelay2.delayTime.value = 0.2;

        const reverbGain1 = audioContext.createGain();
        reverbGain1.gain.value = 0.3;

        const reverbGain2 = audioContext.createGain();
        reverbGain2.gain.value = 0.2;

        const reverbOutput = audioContext.createGain();
        reverbOutput.gain.value = 0.7;

        source.connect(reverbOutput);
        source.connect(reverbDelay1);
        source.connect(reverbDelay2);
        reverbDelay1.connect(reverbGain1);
        reverbDelay2.connect(reverbGain2);
        reverbGain1.connect(reverbOutput);
        reverbGain2.connect(reverbOutput);
        output = reverbOutput;
        break;

      case 'reverse':
        // 역방향은 재생 시 처리하지 않고 다운로드 시에만 처리
        output = source;
        break;

      default:
        output = source;
    }

    return output;
  };

  // 재생/일시정지
  const togglePlay = async () => {
    if (!audioBuffer) {
      setError('오디오 파일이 없습니다.');
      return;
    }

    if (isPlaying) {
      // 일시정지
      if (sourceRef.current) {
        try {
          sourceRef.current.stop();
        } catch (err) {
          // 이미 정지된 경우 무시
        }
        sourceRef.current = null;
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      setIsPlaying(false);
    } else {
      // 재생
      try {
        // AudioContext가 없거나 닫혔으면 새로 생성
        let audioContext = audioContextRef.current;
        if (!audioContext || audioContext.state === 'closed') {
          audioContext = new (window.AudioContext ||
            (window as any).webkitAudioContext)();
          audioContextRef.current = audioContext;
        }

        // AudioContext가 suspended 상태면 resume
        if (audioContext.state === 'suspended') {
          await audioContext.resume();
        }

        // 기존 소스 정리
        if (sourceRef.current) {
          try {
            sourceRef.current.stop();
          } catch (err) {
            // 이미 정지된 경우 무시
          }
          sourceRef.current = null;
        }

        // 역방향 효과는 재생 시 처리하지 않음
        if (selectedEffect === 'reverse') {
          setError('역방향 효과는 다운로드 시에만 적용됩니다.');
          return;
        }

        // AudioBufferSourceNode 생성
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;

        // 음성 효과 적용
        const output = applyVoiceEffect(audioContext, source, selectedEffect);

        // 최종 출력 연결
        output.connect(audioContext.destination);

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
          // OscillatorNode 정리
          if ((source as any).modulator) {
            try {
              (source as any).modulator.stop();
            } catch (err) {
              // 이미 정지된 경우 무시
            }
          }
        };

        sourceRef.current = source;

        // 재생 위치 추적
        progressIntervalRef.current = setInterval(() => {
          if (audioContext && startTimeRef.current !== null) {
            const elapsed = audioContext.currentTime - startTimeRef.current;
            setCurrentTime(Math.min(elapsed, duration));
          }
        }, 100);

        setIsPlaying(true);
        setError(null);
      } catch (err) {
        setError(
          '오디오 재생 중 오류가 발생했습니다: ' + (err as Error).message
        );
        console.error('Play error:', err);
        setIsPlaying(false);
      }
    }
  };

  // 음성 효과 적용 및 다운로드
  const handleApplyEffect = async () => {
    if (!audioBuffer || !audioFile) return;

    setIsProcessing(true);
    setError(null);

    try {
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();

      // 오프라인 컨텍스트 생성
      const offlineContext = new OfflineAudioContext(
        audioBuffer.numberOfChannels,
        audioBuffer.length,
        audioBuffer.sampleRate
      );

      // 소스 생성
      const source = offlineContext.createBufferSource();
      source.buffer = audioBuffer;

      let processedBuffer: AudioBuffer;

      if (selectedEffect === 'reverse') {
        // 역방향: AudioBuffer 직접 처리
        const numberOfChannels = audioBuffer.numberOfChannels;
        const length = audioBuffer.length;
        const sampleRate = audioBuffer.sampleRate;
        const reversedBuffer = audioContext.createBuffer(
          numberOfChannels,
          length,
          sampleRate
        );

        for (let channel = 0; channel < numberOfChannels; channel++) {
          const originalData = audioBuffer.getChannelData(channel);
          const channelData = new Float32Array(originalData);
          const reversedData = reversedBuffer.getChannelData(channel);

          for (let i = 0; i < length; i++) {
            reversedData[i] = channelData[length - 1 - i];
          }
        }

        processedBuffer = reversedBuffer;
      } else {
        // 다른 효과: 오프라인 렌더링
        const output = applyVoiceEffect(offlineContext, source, selectedEffect);
        output.connect(offlineContext.destination);

        source.start(0);
        processedBuffer = await offlineContext.startRendering();
      }

      // WAV로 변환
      const wavBlob = audioBufferToWav(processedBuffer);

      // 다운로드
      const url = URL.createObjectURL(wavBlob);
      const a = document.createElement('a');
      a.href = url;
      const originalName = audioFile.name.replace(/\.[^/.]+$/, '');
      const effectName =
        VOICE_EFFECTS.find(e => e.id === selectedEffect)?.name || 'effect';
      a.download = `${originalName}_${effectName}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError('음성 효과 적용 중 오류가 발생했습니다.');
      console.error('Effect apply error:', err);
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
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (
        audioContextRef.current &&
        audioContextRef.current.state !== 'closed'
      ) {
        audioContextRef.current.close().catch(err => {
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
              음성 변조기
            </h1>
            <p className='text-gray-600 dark:text-gray-400'>
              다양한 음성 효과를 적용하여 음성을 변조하세요
            </p>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className='mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg'>
              <p className='text-red-800 dark:text-red-200 text-sm'>{error}</p>
            </div>
          )}

          {/* 파일 업로드 영역 */}
          {!audioFile && !audioBlob && (
            <div className='mb-8'>
              {/* 파일 업로드 */}
              <div
                className='mb-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer'
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

              {/* 또는 구분선 */}
              <div className='flex items-center gap-4 mb-4'>
                <div className='flex-1 h-px bg-gray-300 dark:bg-gray-600'></div>
                <span className='text-sm text-gray-500 dark:text-gray-400'>
                  또는
                </span>
                <div className='flex-1 h-px bg-gray-300 dark:bg-gray-600'></div>
              </div>

              {/* 마이크 녹음 */}
              <div className='text-center'>
                <p className='text-sm text-gray-600 dark:text-gray-400 mb-4'>
                  마이크로 직접 녹음하기
                </p>
                {recordingState === 'idle' && (
                  <Button
                    onClick={startRecording}
                    variant='default'
                    size='lg'
                    className='flex items-center gap-2 mx-auto'
                  >
                    <Mic className='w-5 h-5' />
                    녹음 시작
                  </Button>
                )}
                {recordingState === 'recording' && (
                  <div className='flex flex-col items-center gap-4'>
                    <div className='text-2xl font-mono font-bold text-red-600 dark:text-red-400'>
                      {formatTime(recordingTime)}
                    </div>
                    <Button
                      onClick={stopRecording}
                      variant='destructive'
                      size='lg'
                      className='flex items-center gap-2'
                    >
                      <Square className='w-5 h-5' />
                      녹음 중지
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 오디오 편집 영역 */}
          {audioBuffer && (
            <>
              {/* 파일 정보 */}
              <div className='mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    <Music className='w-5 h-5 text-blue-500' />
                    <div>
                      <p className='font-medium text-gray-900 dark:text-white'>
                        {audioFile?.name || '녹음 파일'}
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
                      setAudioBlob(null);
                      setAudioBuffer(null);
                      setAudioUrl(null);
                      setCurrentTime(0);
                      setSelectedEffect('none');
                      setIsPlaying(false);
                      setRecordingState('idle');
                      setRecordingTime(0);
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

              {/* 음성 효과 선택 */}
              <div className='mb-8'>
                <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
                  음성 효과 선택
                </h2>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3'>
                  {VOICE_EFFECTS.map(effect => (
                    <button
                      key={effect.id}
                      onClick={() => setSelectedEffect(effect.id)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedEffect === effect.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className='text-sm font-medium text-gray-900 dark:text-white mb-1'>
                        {effect.name}
                      </div>
                      <div className='text-xs text-gray-500 dark:text-gray-400'>
                        {effect.description}
                      </div>
                    </button>
                  ))}
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
                    disabled={!audioBuffer || selectedEffect === 'reverse'}
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
              <div className='flex justify-center'>
                <Button
                  onClick={handleApplyEffect}
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
                      효과 적용 및 다운로드
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
              <li>오디오 파일을 업로드하거나 마이크로 녹음하세요</li>
              <li>원하는 음성 효과를 선택하세요</li>
              <li>재생 버튼을 눌러 효과를 미리 들어보세요</li>
              <li>효과 적용 및 다운로드 버튼을 클릭하여 저장하세요</li>
            </ol>

            <div className='mt-4 pt-4 border-t border-gray-200 dark:border-gray-600'>
              <h3 className='font-semibold text-gray-900 dark:text-white mb-2'>
                주요 기능
              </h3>
              <ul className='space-y-1 text-sm text-gray-600 dark:text-gray-400'>
                <li className='flex items-start gap-2'>
                  <span className='text-green-500 mt-1'>✓</span>
                  <span>10가지 이상의 다양한 음성 효과</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-green-500 mt-1'>✓</span>
                  <span>실시간 재생으로 효과 미리보기</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-green-500 mt-1'>✓</span>
                  <span>파일 업로드 또는 마이크 녹음 지원</span>
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
