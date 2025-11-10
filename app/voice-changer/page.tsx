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
  Settings,
} from 'lucide-react';

// 음성 효과 타입 정의
type VoiceEffect =
  | 'none'
  | 'deep'
  | 'high'
  | 'robot'
  | 'echo'
  | 'alien'
  | 'monster'
  | 'reverb'
  | 'chipmunk'
  | 'helium'
  | 'radio'
  | 'walkie'
  | 'megaphone'
  | 'underwater'
  | 'chorus';

// 효과 정보
const VOICE_EFFECTS: {
  id: VoiceEffect;
  name: string;
  description: string;
}[] = [
  { id: 'none', name: '원본', description: '효과 없음' },
  { id: 'deep', name: '깊은 음성', description: '음성을 깊게 만듭니다' },
  { id: 'high', name: '높은 음성', description: '음성을 높게 만듭니다' },
  {
    id: 'chipmunk',
    name: '다람쥐',
    description: '다람쥐처럼 귀여운 높은 음성',
  },
  {
    id: 'helium',
    name: '헬륨',
    description: '헬륨을 마신 것처럼 매우 높은 음성',
  },
  { id: 'robot', name: '로봇 음성', description: '로봇처럼 메탈릭한 음성' },
  { id: 'echo', name: '에코', description: '에코 효과를 추가합니다' },
  { id: 'reverb', name: '리버브', description: '공간감을 주는 리버브 효과' },
  { id: 'chorus', name: '코러스', description: '여러 목소리가 합쳐진 효과' },
  { id: 'radio', name: '라디오', description: 'AM 라디오 음성 효과' },
  { id: 'walkie', name: '무전기', description: '무전기 통신 음성 효과' },
  { id: 'megaphone', name: '확성기', description: '확성기로 말하는 효과' },
  { id: 'underwater', name: '수중', description: '물속에서 말하는 효과' },
  { id: 'alien', name: '외계인', description: '워블링 외계인 음성' },
  { id: 'monster', name: '몬스터', description: '깊고 왜곡된 몬스터 음성' },
];

// 녹음 상태 타입
type RecordingState = 'idle' | 'recording' | 'recorded';

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

  // 이퀄라이저 관련 상태
  const [eqValues, setEqValues] = useState<number[]>(
    new Array(EQ_BANDS.length).fill(0)
  ); // 각 밴드의 gain 값 (-12 ~ +12 dB)
  const [selectedPreset, setSelectedPreset] = useState<PresetKey | null>(null);

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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const filterNodesRef = useRef<BiquadFilterNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);

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
      setSelectedEffect('none');
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
  const createEQFilters = (
    audioContext: AudioContext | OfflineAudioContext
  ): BiquadFilterNode[] => {
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
          setEqValues(new Array(EQ_BANDS.length).fill(0));
          setSelectedPreset(null);
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

      case 'chipmunk':
        // 다람쥐 음성: 매우 높은 피치
        source.detune.value = 2400; // +24 semitones (2옥타브)
        output = source;
        break;

      case 'helium':
        // 헬륨 음성: 극도로 높은 피치 (원본 길이 유지)
        // detune은 피치만 변경하고 속도는 변경하지 않으므로 playbackRate는 1.0 유지
        source.detune.value = 2400; // +24 semitones (2옥타브) - 더 자연스러운 헬륨 효과
        source.playbackRate.value = 1.0; // 원본 속도 유지
        output = source;
        break;

      case 'radio':
        // 라디오 음성: AM 라디오 효과 (밴드패스 필터 + 약간의 왜곡)
        const radioBandpass = audioContext.createBiquadFilter();
        radioBandpass.type = 'bandpass';
        radioBandpass.frequency.value = 1000;
        radioBandpass.Q.value = 2;

        const radioGain = audioContext.createGain();
        radioGain.gain.value = 1.2;

        source.connect(radioBandpass);
        radioBandpass.connect(radioGain);
        output = radioGain;
        break;

      case 'walkie':
        // 무전기 음성: 좁은 대역폭 + 노이즈
        const walkieHighPass = audioContext.createBiquadFilter();
        walkieHighPass.type = 'highpass';
        walkieHighPass.frequency.value = 400;

        const walkieLowPass = audioContext.createBiquadFilter();
        walkieLowPass.type = 'lowpass';
        walkieLowPass.frequency.value = 2500;

        const walkieGain = audioContext.createGain();
        walkieGain.gain.value = 1.1;

        source.connect(walkieHighPass);
        walkieHighPass.connect(walkieLowPass);
        walkieLowPass.connect(walkieGain);
        output = walkieGain;
        break;

      case 'megaphone':
        // 확성기 음성: 중간 주파수 강조 + 약간의 왜곡
        const megaphoneBandpass = audioContext.createBiquadFilter();
        megaphoneBandpass.type = 'bandpass';
        megaphoneBandpass.frequency.value = 2000;
        megaphoneBandpass.Q.value = 3;

        const megaphoneGain = audioContext.createGain();
        megaphoneGain.gain.value = 1.4;

        source.connect(megaphoneBandpass);
        megaphoneBandpass.connect(megaphoneGain);
        output = megaphoneGain;
        break;

      case 'underwater':
        // 수중 음성: 저주파 강조 + 리버브
        const underwaterLowPass = audioContext.createBiquadFilter();
        underwaterLowPass.type = 'lowpass';
        underwaterLowPass.frequency.value = 2000;
        underwaterLowPass.Q.value = 1;

        const underwaterDelay = audioContext.createDelay(1.0);
        underwaterDelay.delayTime.value = 0.1;

        const underwaterGain = audioContext.createGain();
        underwaterGain.gain.value = 0.3;

        const underwaterOutput = audioContext.createGain();
        underwaterOutput.gain.value = 0.8;

        source.connect(underwaterLowPass);
        underwaterLowPass.connect(underwaterOutput);
        underwaterLowPass.connect(underwaterDelay);
        underwaterDelay.connect(underwaterGain);
        underwaterGain.connect(underwaterOutput);
        output = underwaterOutput;
        break;

      case 'chorus':
        // 코러스 효과: 약간의 딜레이와 피치 변조
        const chorusDelay1 = audioContext.createDelay(0.05);
        chorusDelay1.delayTime.value = 0.015;

        const chorusDelay2 = audioContext.createDelay(0.05);
        chorusDelay2.delayTime.value = 0.025;

        const chorusLFO1 = audioContext.createOscillator();
        chorusLFO1.type = 'sine';
        chorusLFO1.frequency.value = 1.5;

        const chorusLFO2 = audioContext.createOscillator();
        chorusLFO2.type = 'sine';
        chorusLFO2.frequency.value = 2.0;

        const chorusGain1 = audioContext.createGain();
        chorusGain1.gain.value = 0.003;

        const chorusGain2 = audioContext.createGain();
        chorusGain2.gain.value = 0.003;

        const chorusMix = audioContext.createGain();
        chorusMix.gain.value = 0.5;

        const chorusOutput = audioContext.createGain();
        chorusOutput.gain.value = 0.7;

        chorusLFO1.connect(chorusGain1);
        chorusGain1.connect(chorusDelay1.delayTime);
        chorusLFO1.start();

        chorusLFO2.connect(chorusGain2);
        chorusGain2.connect(chorusDelay2.delayTime);
        chorusLFO2.start();

        source.connect(chorusOutput);
        source.connect(chorusDelay1);
        source.connect(chorusDelay2);
        chorusDelay1.connect(chorusMix);
        chorusDelay2.connect(chorusMix);
        chorusMix.connect(chorusOutput);
        output = chorusOutput;
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
        // 현재 재생 시간을 정확히 계산하여 저장
        if (audioContextRef.current && startTimeRef.current !== null) {
          const elapsed =
            audioContextRef.current.currentTime - startTimeRef.current;
          setCurrentTime(Math.min(elapsed, duration));
        }

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
      filterNodesRef.current = [];
      gainNodeRef.current = null;
      // 웨이브 중지
      stopWaveform();
      setIsPlaying(false);
    } else {
      // 재생
      try {
        // 재생 완료 후 재시작: currentTime이 duration과 같거나 거의 같으면 처음부터 재생
        let startTime = currentTime;
        if (Math.abs(currentTime - duration) < 0.1) {
          startTime = 0;
          setCurrentTime(0);
        }

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

        // AudioBufferSourceNode 생성
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;

        // 음성 효과 적용
        let output: AudioNode = applyVoiceEffect(
          audioContext,
          source,
          selectedEffect
        );

        // 이퀄라이저 필터 생성 및 연결
        const filters = createEQFilters(audioContext);
        filterNodesRef.current = filters;

        // GainNode 생성
        const gainNode = audioContext.createGain();
        gainNodeRef.current = gainNode;

        // 연결: source -> voice effect -> filters -> gain -> analyser -> destination
        if (filters.length > 0) {
          output.connect(filters[0]);
          filters[filters.length - 1].connect(gainNode);
        } else {
          output.connect(gainNode);
        }

        // AnalyserNode 생성 및 연결 (웨이브폼용)
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 2048;
        analyserRef.current = analyser;
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
          filterNodesRef.current = [];
          gainNodeRef.current = null;
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

  // 음성 효과 및 이퀄라이저 적용 및 다운로드
  const handleApplyEffect = async () => {
    if (!audioBuffer || (!audioFile && !audioBlob)) return;

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

      // 음성 효과 적용
      let output: AudioNode = applyVoiceEffect(
        offlineContext,
        source,
        selectedEffect
      );

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

      // 연결: source -> voice effect -> filters -> gain -> destination
      if (filters.length > 0) {
        output.connect(filters[0]);
        filters[filters.length - 1].connect(gainNode);
        gainNode.connect(offlineContext.destination);
      } else {
        output.connect(gainNode);
        gainNode.connect(offlineContext.destination);
      }

      source.start(0);
      const processedBuffer = await offlineContext.startRendering();

      // WAV로 변환
      const wavBlob = audioBufferToWav(processedBuffer);

      // 다운로드
      const url = URL.createObjectURL(wavBlob);
      const a = document.createElement('a');
      a.href = url;
      const originalName =
        audioFile?.name.replace(/\.[^/.]+$/, '') || 'recorded';
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

          {/* 웨이브 시각화 영역 */}
          {(audioFile || audioBlob) && (
            <div className='mb-8 rounded-lg overflow-hidden bg-slate-900'>
              <canvas
                ref={canvasRef}
                className='w-full h-[200px] block'
                style={{ background: 'rgba(15, 23, 42, 0.9)' }}
              />
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
                      setEqValues(new Array(EQ_BANDS.length).fill(0));
                      setSelectedPreset(null);
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

              {/* 프리셋 선택 */}
              <div className='mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg'>
                <div className='flex items-center gap-2 mb-3'>
                  <Settings className='w-5 h-5 text-gray-600 dark:text-gray-400' />
                  <h3 className='font-semibold text-gray-900 dark:text-white'>
                    이퀄라이저 프리셋
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
                <li className='flex items-start gap-2'>
                  <span className='text-green-500 mt-1'>✓</span>
                  <span>10개 주파수 밴드 이퀄라이저 (60Hz ~ 16kHz)</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-green-500 mt-1'>✓</span>
                  <span>8가지 이퀄라이저 프리셋 제공</span>
                </li>
                <li className='flex items-start gap-2'>
                  <span className='text-green-500 mt-1'>✓</span>
                  <span>음성 효과와 이퀄라이저 동시 적용 가능</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
