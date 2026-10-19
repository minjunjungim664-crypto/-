import React from 'react';
import { StudyPlace } from '../types';

interface MobileFocusProps {
  currentDb: number;
  activePlace: StudyPlace;
  timerMinutes: number;
  timerSeconds: number;
  isTimerRunning: boolean;
  currentSession: number;
  totalSessions: number;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onSkipTimer: () => void;
  currentSoundName: string;
  isSoundPlaying: boolean;
  soundVolume: number;
  onToggleWhiteNoise: () => void;
  noiseThreshold: number;
  onOpenNotifications: () => void;
  unreadCount: number;
  activeTab: string;
  onChangeTab: (tab: string) => void;
}

export const MobileFocus: React.FC<MobileFocusProps> = ({
  currentDb,
  activePlace,
  timerMinutes,
  timerSeconds,
  isTimerRunning,
  currentSession,
  totalSessions,
  onToggleTimer,
  onResetTimer,
  onSkipTimer,
  currentSoundName,
  isSoundPlaying,
  soundVolume,
  onToggleWhiteNoise,
  noiseThreshold,
  onOpenNotifications,
  unreadCount,
  onChangeTab,
}) => {
  const formattedMinutes = String(timerMinutes).padStart(2, '0');
  const formattedSeconds = String(timerSeconds).padStart(2, '0');

  // Total 25 minutes = 1500 seconds; circumference = 753.98 (radius = 120)
  const totalSeconds = 25 * 60;
  const currentLeftSeconds = timerMinutes * 60 + timerSeconds;
  const progressRatio = currentLeftSeconds / totalSeconds;
  const strokeDashoffset = Math.round(753.98 * (1 - progressRatio));

  return (
    <div className="w-full max-w-md min-h-screen mx-auto flex flex-col justify-between bg-[#051424] text-[#d4e4fa] pb-24 shadow-2xl relative select-none">
      {/* TopAppBar Component */}
      <header className="bg-[#051424] flex justify-between items-center w-full px-5 py-3 sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onChangeTab('home')}
            aria-label="Acoustic status"
            className="text-[#7bd0ff] hover:text-[#7bd0ff] transition-colors active:scale-95 duration-150 flex items-center justify-center p-1 rounded-full cursor-pointer"
          >
            <span className="material-symbols-outlined material-symbols-fill">graphic_eq</span>
          </button>
          <span className="text-lg font-bold text-[#d4e4fa] tracking-tight">집중 &amp; 소음 데시벨</span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Target Environment Pill */}
          <span className="px-2.5 py-1 rounded-full bg-[#1c2b3c] text-[#7bd0ff] text-xs border border-[#273647]/50 flex items-center gap-1 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-pulse"></span>
            {activePlace.name}
          </span>
          <button
            onClick={onOpenNotifications}
            aria-label="Notifications"
            className="text-[#7bd0ff] hover:text-[#7bd0ff] transition-colors active:scale-95 duration-150 flex items-center justify-center p-1 rounded-full relative cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {unreadCount > 0 && (
              <span className="w-2 h-2 bg-[#7bd0ff] rounded-full absolute top-1 right-1"></span>
            )}
          </button>
        </div>
      </header>

      {/* Main Active Focus Content Canvas */}
      <main className="flex-1 flex flex-col items-center justify-between px-5 pt-2 pb-4 space-y-4">
        {/* Session Milestone Header Card */}
        <section className="w-full flex items-center justify-between bg-[#122131] rounded-2xl px-4 py-3 border border-[#273647]/50 shadow-md">
          <div className="flex flex-col">
            <span className="text-xs text-[#c6c6cd]">뽀모도로 집중 모드</span>
            <span className="text-base font-bold text-[#d4e4fa] tracking-tight">25분 몰입 세션</span>
          </div>
          <div className="flex items-center gap-2">
            {/* Session Progress Pip Indicator */}
            <div className="flex gap-1.5 items-center mr-1">
              {Array.from({ length: totalSessions }).map((_, i) => (
                <span
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i < currentSession
                      ? 'bg-[#7bd0ff] shadow-sm'
                      : i === currentSession
                      ? 'bg-[#7bd0ff] shadow-sm animate-pulse'
                      : 'bg-[#273647]'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-[#7bd0ff] bg-[#1c2b3c] px-2.5 py-1 rounded-lg border border-[#7bd0ff]/20">
              {currentSession} / {totalSessions} 세션
            </span>
          </div>
        </section>

        {/* Center: Radial Countdown Timer with Ambient Acoustic Readout */}
        <section className="relative my-4 flex flex-col items-center justify-center">
          {/* Soft Ambient Acoustic Halo */}
          <div className="absolute w-64 h-64 rounded-full bg-[#4edea3]/10 blur-3xl pointer-events-none"></div>

          {/* SVG Circular Progress Indicator */}
          <div className="relative w-72 h-72 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 280 280">
              {/* Background Inactive Track */}
              <circle
                cx="140"
                cy="140"
                r="120"
                fill="transparent"
                stroke="#1E2945"
                strokeWidth="10"
              />
              {/* Foreground Dynamic Glowing Arc */}
              <circle
                cx="140"
                cy="140"
                r="120"
                fill="transparent"
                stroke="#7bd0ff"
                strokeWidth="10"
                strokeDasharray="753.98"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-linear"
                style={{ filter: 'drop-shadow(0 0 8px rgba(123, 208, 255, 0.45))' }}
              />
            </svg>

            {/* Metric Center Cluster */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
              <span className="text-xs text-[#7bd0ff] tracking-wide uppercase flex items-center gap-1.5 mb-1 bg-[#1c2b3c]/80 px-3 py-1 rounded-full border border-[#7bd0ff]/20 font-semibold">
                <span className="material-symbols-outlined text-xs">timer</span>
                집중 시간 (25분 중)
              </span>

              {/* Primary Digits */}
              <span className="text-5xl font-extrabold text-[#d4e4fa] tracking-tight my-1 tabular-nums">
                {formattedMinutes}:{formattedSeconds}
              </span>

              {/* Mini Real-time Decibel Monitor Capsule */}
              <div className="mt-2 flex items-center gap-2 bg-[#0d1c2d] px-3.5 py-1.5 rounded-full border border-[#273647]/50 shadow-inner">
                <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-ping"></span>
                <span className="text-sm font-bold text-[#4edea3] tracking-tight tabular-nums">
                  {currentDb} dB
                </span>
                <span className="text-[#45464d] text-xs">•</span>
                <span className="text-xs text-[#d4e4fa] font-medium">
                  {currentDb <= 42 ? '독서실수준 조용함' : currentDb <= 55 ? '집중 안정권' : '소음 주의'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Primary Action Controllers */}
        <section className="w-full flex items-center justify-center gap-5 my-2">
          {/* Reset Action Button */}
          <button
            onClick={onResetTimer}
            aria-label="세션 리셋"
            className="w-13 h-13 p-3.5 rounded-full bg-[#122131] text-[#c6c6cd] hover:text-[#d4e4fa] border border-[#273647]/50 active:scale-95 transition-transform flex items-center justify-center cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-2xl">replay</span>
          </button>

          {/* Primary Start / Pause Toggle Button */}
          <button
            onClick={onToggleTimer}
            aria-label="타이머 일시정지 또는 시작"
            className="px-8 py-4 rounded-full bg-[#7bd0ff] text-[#00354a] font-bold text-base flex items-center gap-3 shadow-lg shadow-[#7bd0ff]/25 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-2xl material-symbols-fill">
              {isTimerRunning ? 'pause' : 'play_arrow'}
            </span>
            <span>{isTimerRunning ? '일시정지' : '세션 시작'}</span>
          </button>

          {/* Skip Action Button */}
          <button
            onClick={onSkipTimer}
            aria-label="다음 세션으로 건너뛰기"
            className="w-13 h-13 p-3.5 rounded-full bg-[#122131] text-[#c6c6cd] hover:text-[#d4e4fa] border border-[#273647]/50 active:scale-95 transition-transform flex items-center justify-center cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-2xl">skip_next</span>
          </button>
        </section>

        {/* Smart White-Noise Automation Module */}
        <section className="w-full bg-[#122131] rounded-2xl p-3.5 border border-[#273647]/50 flex flex-col gap-2.5 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1c2b3c] flex items-center justify-center text-[#7bd0ff] border border-[#7bd0ff]/20">
                <span className="material-symbols-outlined text-xl">rainy</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-[#d4e4fa]">자동 백색소음 차단</span>
                <span className="text-[11px] text-[#c6c6cd]">
                  소음 {noiseThreshold}dB 초과 시 자동 증폭
                </span>
              </div>
            </div>

            {/* Styled Active Toggle Switch */}
            <button
              onClick={onToggleWhiteNoise}
              aria-label="소음 차단 토글"
              className={`w-12 h-6 rounded-full p-0.5 flex items-center transition-colors duration-200 cursor-pointer ${
                isSoundPlaying ? 'bg-[#7bd0ff] justify-end' : 'bg-[#273647] justify-start'
              }`}
            >
              <span className={`w-5 h-5 rounded-full shadow-sm ${isSoundPlaying ? 'bg-[#00354a]' : 'bg-[#c6c6cd]'}`}></span>
            </button>
          </div>

          {/* Ambient Playback Status Pill */}
          <div className="flex items-center justify-between pt-2 border-t border-[#273647]/30">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7bd0ff] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7bd0ff]"></span>
              </span>
              <span className="text-xs text-[#c6c6cd]">
                현재 백그라운드 재생 중:{' '}
                <strong className="text-[#7bd0ff] font-semibold">{currentSoundName}</strong>
              </span>
            </div>
            <span className="text-[11px] text-[#c6c6cd] bg-[#1c2b3c] px-2 py-0.5 rounded font-mono">
              볼륨 {soundVolume}%
            </span>
          </div>
        </section>
      </main>

      {/* Bottom Navigation Bar */}
      <nav
        className="bg-[#122131] fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 border-t border-[#273647]/40"
        style={{ boxShadow: '0 -4px 16px -2px rgba(2, 6, 23, 0.4)' }}
      >
        <button
          onClick={() => onChangeTab('home')}
          className="flex flex-col items-center justify-center text-[#c6c6cd] text-xs hover:text-[#7bd0ff] py-1 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-xl">home</span>
          <span className="mt-0.5">홈</span>
        </button>

        <button
          onClick={() => onChangeTab('focus')}
          className="flex flex-col items-center justify-center text-[#7bd0ff] text-xs font-bold py-1 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-xl material-symbols-fill">timer</span>
          <span className="mt-0.5">집중 모드</span>
        </button>

        <button
          onClick={() => onChangeTab('analytics')}
          className="flex flex-col items-center justify-center text-[#c6c6cd] text-xs hover:text-[#7bd0ff] py-1 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-xl">bar_chart</span>
          <span className="mt-0.5">통계 및 기록</span>
        </button>

        <button
          onClick={() => onChangeTab('settings')}
          className="flex flex-col items-center justify-center text-[#c6c6cd] text-xs hover:text-[#7bd0ff] py-1 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-xl">settings</span>
          <span className="mt-0.5">설정</span>
        </button>
      </nav>
    </div>
  );
};
