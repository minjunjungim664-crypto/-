import React, { useState, useEffect } from 'react';

interface CafeCaseStudyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCafeMode: () => void;
  onEnableMasking: () => void;
}

export const CafeCaseStudyModal: React.FC<CafeCaseStudyModalProps> = ({
  isOpen,
  onClose,
  onApplyCafeMode,
  onEnableMasking,
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentFrame, setCurrentFrame] = useState<number>(0);
  const [soundMode, setSoundMode] = useState<'cafe_noise' | 'masked'>('cafe_noise');

  const storyFrames = [
    {
      time: '00:01',
      title: '혼잡한 카페에서의 공부',
      subtitle: '"주변 말소리와 웅성거림... 소음 68 dB"',
      quote: '"I can\'t focus anymore."',
      koreanQuote: '더 이상 집중할 수가 없어...',
      icon: 'local_cafe',
      ambientDb: 68,
      status: '소음 방해 심각',
      statusColor: 'text-[#ffb4ab]',
      badgeBg: 'bg-[#93000a]/40',
      description: '주변 대화 소리와 커피 머신 소음으로 인해 읽었던 문장을 계속 다시 읽게 됩니다.',
    },
    {
      time: '00:03',
      title: '극심한 집중력 분산',
      subtitle: '"커피 한 모금으로 버텨보지만 피로 누적"',
      quote: '"Mind wanders with every conversation."',
      koreanQuote: '옆자리 대화가 귀에 꽂혀 머리가 지끈거려...',
      icon: 'coffee',
      ambientDb: 65,
      status: '도파민 피로 상태',
      statusColor: 'text-[#ffb4ab]',
      badgeBg: 'bg-[#93000a]/40',
      description: '무의식적인 소음 필터링으로 뇌의 전두엽 에너지가 빠르게 고갈됩니다.',
    },
    {
      time: '00:06',
      title: '쌓여있는 수험서와 압박감',
      subtitle: '"아직 읽어야 할 분량이 산더미인데..."',
      quote: '"Still have so much to read."',
      koreanQuote: '오늘 목표 분량이 아직 절반도 안 끝났는데...',
      icon: 'menu_book',
      ambientDb: 70,
      status: '집중 붕괴 위험',
      statusColor: 'text-[#ffb4ab]',
      badgeBg: 'bg-[#93000a]/40',
      description: '계획했던 뽀모도로 세션이 소음으로 인해 중단되고 스트레스 수치가 급상승합니다.',
    },
    {
      time: '00:08',
      title: '결국 책상에 엎드림 (Burnout)',
      subtitle: '"두통과 무력감으로 인한 학습 중단"',
      quote: '"Overwhelmed by acoustic fatigue."',
      koreanQuote: '소음 스트레스로 결국 엎드려 포기하고 맙니다...',
      icon: 'sentiment_dissatisfied',
      ambientDb: 68,
      status: '세션 포기',
      statusColor: 'text-[#ffb4ab]',
      badgeBg: 'bg-[#93000a]/40',
      description: '방해 소음 60dB 이상의 환경에서 지속된 학습은 집중 시간을 70% 이상 단축시킵니다.',
    },
    {
      time: '00:10',
      title: 'Serene Study 솔루션 가동',
      subtitle: '"실시간 68dB 감지 → 백색소음 자동 증폭 마스킹"',
      quote: '"Peace restored with Acoustic Shield."',
      koreanQuote: '빗소리 백색소음이 외부 잡음을 차단해 독서실 수준으로 회복!',
      icon: 'headphones',
      ambientDb: 40,
      status: '체감 소음 38dB (안전)',
      statusColor: 'text-[#4edea3]',
      badgeBg: 'bg-[#001c10]',
      description: 'Serene Study의 자동 백색소음 마스킹으로 외부 잡음을 상쇄하여 즉각 몰입 상태를 되찾습니다.',
    },
  ];

  // Auto-play story frame timer
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const timer = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % storyFrames.length);
    }, 3200);

    return () => clearInterval(timer);
  }, [isOpen, isPlaying, storyFrames.length]);

  if (!isOpen) return null;

  const current = storyFrames[currentFrame];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#0d1c2d] border border-[#273647] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="px-6 py-4 bg-[#010f1f] border-b border-[#273647]/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-xl bg-[#93000a]/30 text-[#ffb4ab]">
              <span className="material-symbols-outlined text-xl">smart_display</span>
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#d4e4fa]">
                  수험생 실제 사례 영상 스토리
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#ffb4ab]/20 text-[#ffb4ab] text-[10px] font-bold">
                  카페 소음 68dB 극복기
                </span>
              </div>
              <p className="text-[11px] text-[#c6c6cd]">
                "I can't focus anymore..." — 수험생이 겪는 소음 피로와 해결책
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#c6c6cd] hover:text-[#d4e4fa] hover:bg-[#1c2b3c] transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Video Reel Simulator Body */}
        <div className="p-6 space-y-5 overflow-y-auto no-scrollbar">
          {/* Cinematic Frame Canvas */}
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#1c2b3c] to-[#051424] border border-[#273647] p-5 shadow-inner">
            {/* Ambient Background Glow matching noise intensity */}
            <div
              className={`absolute -top-10 -right-10 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
                current.ambientDb >= 60 ? 'bg-[#ffb4ab]/15' : 'bg-[#4edea3]/15'
              }`}
            ></div>

            {/* Top Frame Bar: Timestamp & Live Sensor */}
            <div className="flex items-center justify-between text-xs mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
                <span className="font-mono text-[11px] text-[#c6c6cd] font-semibold">
                  REC • {current.time} / 00:10
                </span>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-bold border transition-colors ${
                  current.ambientDb >= 60
                    ? 'bg-[#93000a]/40 border-[#ffb4ab]/40 text-[#ffb4ab]'
                    : 'bg-[#001c10] border-[#4edea3]/40 text-[#4edea3]'
                }`}
              >
                {current.ambientDb} dB ({current.status})
              </span>
            </div>

            {/* Center Visual Mockup & Subtitles */}
            <div className="py-6 flex flex-col items-center text-center space-y-3">
              {/* Animated Icon Avatar */}
              <div
                className={`w-20 h-20 rounded-3xl flex items-center justify-center text-4xl shadow-xl transition-all duration-500 ${
                  current.ambientDb >= 60
                    ? 'bg-[#273647] text-[#ffb4ab] border-2 border-[#ffb4ab]/30'
                    : 'bg-[#001c10] text-[#4edea3] border-2 border-[#4edea3]/40'
                }`}
              >
                <span className="material-symbols-outlined text-4xl">{current.icon}</span>
              </div>

              {/* Title & Korean Meaning */}
              <div>
                <h4 className="text-lg font-bold text-[#d4e4fa] tracking-tight">
                  {current.title}
                </h4>
                <p className="text-xs text-[#c6c6cd] mt-0.5">{current.subtitle}</p>
              </div>

              {/* Actual English Subtitle Quote Box from the Video */}
              <div className="px-5 py-3 rounded-2xl bg-[#051424]/90 border border-[#273647]/60 shadow-lg max-w-md w-full">
                <div className="text-sm font-extrabold text-[#7bd0ff] font-sans tracking-wide">
                  {current.quote}
                </div>
                <div className="text-xs text-[#d4e4fa] font-medium mt-1">
                  "{current.koreanQuote}"
                </div>
              </div>

              <p className="text-xs text-[#c6c6cd]/90 max-w-sm leading-relaxed pt-1">
                {current.description}
              </p>
            </div>

            {/* Frame Scrubber Dots */}
            <div className="flex items-center justify-center gap-2 pt-2">
              {storyFrames.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentFrame(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentFrame === idx
                      ? 'w-8 bg-[#7bd0ff]'
                      : 'w-2 bg-[#273647] hover:bg-[#c6c6cd]/40'
                  }`}
                />
              ))}
            </div>

            {/* Player Controls Bar */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#273647]/40 text-xs text-[#c6c6cd]">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 hover:text-[#7bd0ff] transition-colors"
              >
                <span className="material-symbols-outlined text-lg">
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
                <span>{isPlaying ? '일시정지' : '재생'}</span>
              </button>

              <button
                onClick={() => setCurrentFrame((f) => (f + 1) % storyFrames.length)}
                className="flex items-center gap-1 hover:text-[#7bd0ff] transition-colors"
              >
                <span>다음 장면</span>
                <span className="material-symbols-outlined text-lg">skip_next</span>
              </button>
            </div>
          </div>

          {/* Before & After Comparison Strip */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#122131] border border-[#ffb4ab]/30 text-left space-y-1">
              <span className="text-[10px] font-bold text-[#ffb4ab] uppercase tracking-wider">
                Before (일반 카페 소음 68dB)
              </span>
              <div className="text-sm font-extrabold text-[#d4e4fa]">집중 12분 만에 중단</div>
              <p className="text-[11px] text-[#c6c6cd]">
                • 소음 스트레스로 두통 및 엎드림<br />
                • 뽀모도로 세션 달성률 25% 미만
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#122131] border border-[#4edea3]/30 text-left space-y-1">
              <span className="text-[10px] font-bold text-[#4edea3] uppercase tracking-wider">
                After (Serene Study 마스킹)
              </span>
              <div className="text-sm font-extrabold text-[#4edea3]">뽀모도로 50분 연속 몰입</div>
              <p className="text-[11px] text-[#c6c6cd]">
                • 빗소리 마스킹으로 외부 말소리 차단<br />
                • 안정 독서실 수준(38dB) 체감 효과
              </p>
            </div>
          </div>

          {/* Interactive Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
            <button
              onClick={() => {
                onApplyCafeMode();
                onClose();
              }}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#1c2b3c] hover:bg-[#273647] text-[#d4e4fa] font-bold text-xs flex items-center justify-center gap-2 border border-[#273647] transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">local_cafe</span>
              <span>카페 소음 68dB 시뮬레이션 적용</span>
            </button>

            <button
              onClick={() => {
                onEnableMasking();
                onClose();
              }}
              className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-[#7bd0ff] hover:bg-[#7bd0ff]/90 text-[#00354a] font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#7bd0ff]/20 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base material-symbols-fill">headphones</span>
              <span>소음 마스킹 백색소음 켜기</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
