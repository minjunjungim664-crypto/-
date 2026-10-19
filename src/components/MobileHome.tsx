import React from 'react';
import { StudyPlace } from '../types';

interface MobileHomeProps {
  currentDb: number;
  places: StudyPlace[];
  activePlace: StudyPlace;
  onSelectPlace: (place: StudyPlace) => void;
  onOpenAddPlace: () => void;
  onOpenNotifications: () => void;
  unreadCount: number;
  isRealMic: boolean;
  onToggleRealMic: () => void;
  onStartFocus: () => void;
  isWhiteNoiseEnabled: boolean;
  onToggleWhiteNoise: () => void;
  activeTab: string;
  onChangeTab: (tab: string) => void;
  onOpenCafeStory?: () => void;
}

export const MobileHome: React.FC<MobileHomeProps> = ({
  currentDb,
  places,
  activePlace,
  onSelectPlace,
  onOpenAddPlace,
  onOpenNotifications,
  unreadCount,
  onToggleRealMic,
  onStartFocus,
  isWhiteNoiseEnabled,
  onToggleWhiteNoise,
  activeTab,
  onChangeTab,
  onOpenCafeStory,
}) => {
  // SVG gauge progress calculation (max 100dB, stroke-dasharray 415)
  const gaugePercent = Math.min(1, Math.max(0, currentDb / 90));
  const dashoffset = Math.round(415 * (1 - gaugePercent * 0.75));

  const getStatusText = (db: number) => {
    if (db <= 42) return '조용함 · 독서실 최적 환경';
    if (db <= 55) return '보통 · 스터디카페 집중 환경';
    return '주의 · 주변 소음 높음';
  };

  return (
    <div className="w-full max-w-md min-h-screen mx-auto flex flex-col justify-between bg-[#051424] text-[#d4e4fa] pb-24 shadow-2xl relative">
      {/* TopAppBar Component */}
      <header className="bg-[#051424] flex justify-between items-center w-full px-5 py-3 border-b border-[#273647]/30 sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <span className="material-symbols-outlined text-[#7bd0ff] text-xl material-symbols-fill">
            graphic_eq
          </span>
          <h1 className="text-lg font-bold text-[#d4e4fa] tracking-tight">집중 &amp; 소음 데시벨</h1>
        </div>
        <div className="flex items-center space-x-3">
          {/* Live Mic State Badge */}
          <button
            onClick={onToggleRealMic}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#1c2b3c] border border-[#273647]/50 cursor-pointer active:scale-95 transition-transform"
          >
            <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
            <span className="text-[11px] text-[#4edea3] font-medium">마이크 감지 중</span>
          </button>
          <button
            onClick={onOpenNotifications}
            aria-label="알림"
            className="text-[#c6c6cd] hover:text-[#7bd0ff] transition-colors active:scale-95 duration-150 p-1 relative"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {unreadCount > 0 && (
              <span className="w-2 h-2 bg-[#7bd0ff] rounded-full absolute top-1 right-1"></span>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="px-5 pt-4 space-y-5">
        {/* Top Environment Selector Chips */}
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#c6c6cd]">현재 학습 장소</span>
            <span
              onClick={() => onChangeTab('settings')}
              className="text-[11px] text-[#7bd0ff] flex items-center cursor-pointer hover:underline"
            >
              <span className="material-symbols-outlined text-sm mr-1">tune</span>
              감도 자동 보정됨
            </span>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-0.5">
            {places.map((place) => {
              const isSelected = activePlace.id === place.id;
              let icon = 'local_library';
              if (place.name.includes('카페')) icon = 'coffee';
              else if (place.name.includes('방')) icon = 'bed';

              return (
                <button
                  key={place.id}
                  onClick={() => onSelectPlace(place)}
                  className={`px-3.5 py-1.5 rounded-full text-xs flex items-center space-x-1.5 shadow-sm active:scale-95 transition-transform shrink-0 ${
                    isSelected
                      ? 'bg-[#00a6e0]/20 text-[#7bd0ff] border border-[#7bd0ff]/50 font-bold'
                      : 'bg-[#1c2b3c] text-[#c6c6cd] border border-[#273647]/50 hover:text-[#7bd0ff]'
                  }`}
                >
                  <span className="material-symbols-outlined text-xs">{icon}</span>
                  <span>{place.name}</span>
                </button>
              );
            })}
            <button
              onClick={onOpenAddPlace}
              className="px-3 py-1.5 rounded-full bg-[#122131] text-[#c6c6cd] border border-dashed border-[#273647]/70 hover:text-[#7bd0ff] text-xs flex items-center shrink-0"
            >
              <span className="material-symbols-outlined text-xs">add</span>
            </button>
          </div>
        </section>

        {/* Main Live dB Radial Gauge Section */}
        <section className="relative bg-[#122131] rounded-2xl p-5 border border-[#273647]/30 overflow-hidden shadow-lg flex flex-col items-center text-center">
          {/* Ambient decorative gradient backdrop */}
          <div className="absolute -top-16 -right-16 w-44 h-44 bg-[#7bd0ff]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-16 -left-16 w-44 h-44 bg-[#4edea3]/10 rounded-full blur-3xl pointer-events-none"></div>

          {/* Header within Gauge Card */}
          <div className="w-full flex justify-between items-center mb-3">
            <div className="flex items-center space-x-1.5">
              <span className="material-symbols-outlined text-[#7bd0ff] text-base">volume_up</span>
              <span className="text-xs text-[#d4e4fa] font-semibold">실시간 주변 소음도</span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-[#273647] text-[#c6c6cd]">
              권장 &lt; 45 dB
            </span>
          </div>

          {/* Concentric Circular Gauge Visual */}
          <div className="relative w-56 h-56 my-2 flex items-center justify-center">
            {/* SVG Gauge Track */}
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
              {/* Background track */}
              <circle
                cx="80"
                cy="80"
                r="66"
                fill="transparent"
                stroke="#1c2b3c"
                strokeWidth="10"
                strokeDasharray="330"
                strokeDashoffset="60"
                strokeLinecap="round"
              />
              {/* Active level stroke */}
              <circle
                cx="80"
                cy="80"
                r="66"
                fill="transparent"
                stroke="#4edea3"
                strokeWidth="10"
                strokeDasharray="415"
                strokeDashoffset={dashoffset}
                strokeLinecap="round"
                className="transition-all duration-500 ease-out"
              />
              {/* Inner subtle guide circle */}
              <circle
                cx="80"
                cy="80"
                r="54"
                fill="transparent"
                stroke="#273647"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            </svg>

            {/* Center Numeric dB Display */}
            <div className="absolute flex flex-col items-center justify-center">
              <div className="flex items-baseline justify-center">
                <span className="text-5xl font-extrabold text-[#d4e4fa] tracking-tight tabular-nums">
                  {currentDb}
                </span>
                <span className="text-sm text-[#7bd0ff] ml-1 font-bold">dB</span>
              </div>
              <span className="text-[11px] text-[#c6c6cd] -mt-1 font-medium">실시간 측정값</span>
            </div>
          </div>

          {/* Sound Status Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#001c10]/80 border border-[#4edea3]/30 mb-4">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4edea3] shadow-[0_0_8px_#4edea3]"></span>
            <span className="text-xs text-[#4edea3] font-semibold tracking-wide">
              {getStatusText(currentDb)}
            </span>
          </div>

          {/* Realtime Audio Waveform Animation Bars */}
          <div className="w-full max-w-xs px-2.5 py-2 bg-[#010f1f]/80 rounded-lg border border-[#273647]/30 flex items-center justify-between space-x-1">
            <span className="text-[11px] text-[#c6c6cd] shrink-0 font-medium">파형</span>
            <div className="flex items-end justify-center space-x-1 h-7 flex-1 px-2">
              <span className="w-1 bg-[#4edea3] rounded-full wave-bar-1"></span>
              <span className="w-1 bg-[#4edea3] rounded-full wave-bar-2"></span>
              <span className="w-1 bg-[#7bd0ff] rounded-full wave-bar-3"></span>
              <span className="w-1 bg-[#4edea3] rounded-full wave-bar-4"></span>
              <span className="w-1 bg-[#4edea3] rounded-full wave-bar-5"></span>
              <span className="w-1 bg-[#7bd0ff] rounded-full wave-bar-6"></span>
              <span className="w-1 bg-[#4edea3] rounded-full wave-bar-7"></span>
              <span className="w-1 bg-[#4edea3] rounded-full wave-bar-2"></span>
              <span className="w-1 bg-[#7bd0ff] rounded-full wave-bar-4"></span>
              <span className="w-1 bg-[#4edea3] rounded-full wave-bar-1"></span>
            </div>
            <span className="material-symbols-outlined text-[#4edea3] text-sm">waves</span>
          </div>
        </section>

        {/* Student Case Study Story Banner (I can't focus anymore) */}
        {onOpenCafeStory && (
          <div
            onClick={onOpenCafeStory}
            className="p-3.5 rounded-2xl bg-gradient-to-r from-[#1c2b3c] to-[#122131] border border-[#273647] flex items-center justify-between shadow-md cursor-pointer active:scale-[0.98] transition-transform hover:border-[#7bd0ff]/40"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#93000a]/30 text-[#ffb4ab] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">smart_display</span>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#d4e4fa]">카페 68dB 소음 탈출기</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] bg-[#7bd0ff]/20 text-[#7bd0ff] font-bold">
                    사례 영상
                  </span>
                </div>
                <p className="text-[11px] text-[#c6c6cd] mt-0.5">
                  "I can't focus anymore..." 수험생 극복 스토리
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#7bd0ff] text-lg">chevron_right</span>
          </div>
        )}

        {/* Quick Pomodoro CTA Action Card */}
        <section className="bg-[#122131] rounded-2xl p-4 border border-[#273647]/30 shadow-md flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-[#00a6e0]/15 flex items-center justify-center text-[#7bd0ff]">
                <span className="material-symbols-outlined text-lg">timer</span>
              </div>
              <div>
                <h2 className="text-xs font-bold text-[#d4e4fa]">뽀모도로 집중 모드</h2>
                <p className="text-[11px] text-[#c6c6cd]">25분 집중 + 5분 휴식 루틴 프리셋</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-[#1c2b3c] text-[#7bd0ff] text-[10px] font-medium">
              1세트 목표
            </span>
          </div>

          {/* Big Prominent CTA Button */}
          <button
            onClick={onStartFocus}
            className="w-full py-3.5 px-4 rounded-xl bg-[#7bd0ff] hover:bg-[#7bd0ff]/90 text-[#00354a] font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-[#7bd0ff]/20 active:scale-[0.98] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl material-symbols-fill">play_arrow</span>
            <span>뽀모도로 집중 시작</span>
          </button>
        </section>

        {/* Bento Grid Style Info Cards */}
        <section className="grid grid-cols-2 gap-3">
          {/* Card 1: Today's Focus Duration */}
          <div className="bg-[#122131] rounded-xl p-3.5 border border-[#273647]/30 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#c6c6cd] mb-2">
              <span className="text-[11px]">오늘 누적 집중</span>
              <span className="material-symbols-outlined text-sm text-[#7bd0ff]">hourglass_top</span>
            </div>
            <div>
              <div className="text-xl font-bold text-[#d4e4fa] tracking-tight">3시간 40분</div>
              <div className="flex items-center space-x-1 mt-1 text-[#4edea3]">
                <span className="material-symbols-outlined text-xs">trending_up</span>
                <span className="text-[11px] font-medium">어제보다 +35분</span>
              </div>
            </div>
          </div>

          {/* Card 2: Current Location Average dB */}
          <div className="bg-[#122131] rounded-xl p-3.5 border border-[#273647]/30 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#c6c6cd] mb-2">
              <span className="text-[11px]">장소 평균 소음</span>
              <span className="material-symbols-outlined text-sm text-[#4edea3]">bar_chart</span>
            </div>
            <div>
              <div className="text-xl font-bold text-[#d4e4fa] tracking-tight">
                {activePlace.targetDb} <span className="text-xs text-[#c6c6cd] font-normal">dB</span>
              </div>
              <div className="flex items-center space-x-1 mt-1 text-[#c6c6cd]">
                <span className="material-symbols-outlined text-xs text-[#7bd0ff]">check_circle</span>
                <span className="text-[11px]">집중 유지 안정권</span>
              </div>
            </div>
          </div>

          {/* Card 3: White Noise Quick Toggle (Span 2 cols) */}
          <div className="col-span-2 bg-[#122131] rounded-xl p-3.5 border border-[#273647]/30 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-[#1c2b3c] border border-[#7bd0ff]/20 flex items-center justify-center text-[#7bd0ff]">
                <span className="material-symbols-outlined text-xl">rainy</span>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-[#d4e4fa]">추천 백색소음</span>
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#00a6e0]/20 text-[#7bd0ff] font-semibold">
                    소음 상쇄
                  </span>
                </div>
                <p className="text-[11px] text-[#c6c6cd] mt-0.5">차분한 빗소리 · 데시벨 마스킹 효과</p>
              </div>
            </div>

            {/* Custom Switch Toggle */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isWhiteNoiseEnabled}
                onChange={onToggleWhiteNoise}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#273647] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#00354a] after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7bd0ff]"></div>
            </label>
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
          className="flex flex-col items-center justify-center text-[#7bd0ff] text-xs font-bold py-1 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-xl material-symbols-fill">home</span>
          <span className="mt-0.5">홈</span>
        </button>

        <button
          onClick={() => onChangeTab('focus')}
          className="flex flex-col items-center justify-center text-[#c6c6cd] text-xs hover:text-[#7bd0ff] py-1 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-xl">timer</span>
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
