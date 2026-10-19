import React from 'react';
import { StudyPlace, SessionRecord } from '../types';

interface DesktopDashboardProps {
  currentDb: number;
  minDb: number;
  maxDb: number;
  places: StudyPlace[];
  activePlace: StudyPlace;
  onSelectPlace: (place: StudyPlace) => void;
  onOpenAddPlace: () => void;
  onOpenNotifications: () => void;
  onOpenHelpDocs: () => void;
  unreadCount: number;
  // Timer state
  timerMinutes: number;
  timerSeconds: number;
  isTimerRunning: boolean;
  timerMode: 'focus' | 'break';
  currentSession: number;
  totalSessions: number;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onSkipTimer: () => void;
  // Ambient Sound
  currentSoundName: string;
  isSoundPlaying: boolean;
  soundVolume: number;
  onToggleSound: () => void;
  onChangeVolume: (v: number) => void;
  // Calibration & Mic
  micCalibration: number;
  isRealMic: boolean;
  onToggleRealMic: () => void;
  // Navigation
  activeTab: string;
  onChangeTab: (tab: string) => void;
  // Export
  sessionRecords: SessionRecord[];
  onExportLogs: () => void;
  // Noise threshold
  noiseThreshold: number;
  // View mode switcher
  isMobilePreview: boolean;
  onToggleViewMode: () => void;
  // Cafe Story Modal
  onOpenCafeStory?: () => void;
}

export const DesktopDashboard: React.FC<DesktopDashboardProps> = ({
  currentDb,
  minDb,
  maxDb,
  places,
  activePlace,
  onSelectPlace,
  onOpenAddPlace,
  onOpenNotifications,
  onOpenHelpDocs,
  unreadCount,
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
  onToggleSound,
  onChangeVolume,
  micCalibration,
  isRealMic,
  onToggleRealMic,
  activeTab,
  onChangeTab,
  sessionRecords,
  onExportLogs,
  noiseThreshold,
  onToggleViewMode,
  onOpenCafeStory,
}) => {
  const formattedMinutes = String(timerMinutes).padStart(2, '0');
  const formattedSeconds = String(timerSeconds).padStart(2, '0');

  // Compute ring offset for 25 min timer (circumference 628)
  const totalSeconds = 25 * 60;
  const currentLeftSeconds = timerMinutes * 60 + timerSeconds;
  const progressRatio = currentLeftSeconds / totalSeconds;
  const strokeDashoffset = Math.round(628 * (1 - progressRatio));

  const sign = micCalibration >= 0 ? '+' : '';

  return (
    <div className="min-h-screen bg-[#051424] text-[#d4e4fa] flex overflow-x-hidden selection:bg-[#00a6e0]/30 selection:text-[#7bd0ff]">
      {/* ============================================================ */}
      {/* 1. SideNavBar Component (Exact Match with Image 1) */}
      {/* ============================================================ */}
      <aside className="h-screen fixed left-0 top-0 z-40 flex flex-col justify-between w-64 bg-[#0d1c2d] border-r border-[#273647]/30 p-4 transition-all duration-300">
        <div className="flex flex-col gap-6">
          {/* Brand Section */}
          <div className="flex items-center gap-3 px-2 pt-2">
            <div className="w-10 h-10 rounded-xl bg-[#1c2b3c] border border-[#273647]/50 flex items-center justify-center text-[#7bd0ff] shadow-inner">
              <span className="material-symbols-outlined text-[#7bd0ff] material-symbols-fill">graphic_eq</span>
            </div>
            <div>
              <div className="text-lg font-bold text-[#d4e4fa] tracking-tight leading-none">Serene Study</div>
              <div className="text-[11px] text-[#c6c6cd] mt-1 font-medium">집중 &amp; 데시벨 모니터링</div>
            </div>
          </div>

          {/* Quick Action CTA */}
          <button
            onClick={() => {
              onChangeTab('focus');
              if (!isTimerRunning) onToggleTimer();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#7bd0ff] text-[#00354a] font-bold text-xs hover:bg-[#7bd0ff]/90 transition-all active:scale-[0.98] shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-base material-symbols-fill">bolt</span>
            <span>Quick Focus</span>
          </button>

          {/* Main Navigation Menu */}
          <nav aria-label="메인 네비게이션" className="flex flex-col gap-1.5">
            <button
              onClick={() => onChangeTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors text-left ${
                activeTab === 'dashboard'
                  ? 'bg-[#122131] text-[#7bd0ff] border-l-2 border-[#7bd0ff]'
                  : 'text-[#c6c6cd] hover:text-[#d4e4fa] hover:bg-[#122131]/50'
              }`}
            >
              <span className={`material-symbols-outlined text-xl ${activeTab === 'dashboard' ? 'material-symbols-fill' : ''}`}>
                dashboard
              </span>
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => onChangeTab('focus')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors text-left ${
                activeTab === 'focus'
                  ? 'bg-[#122131] text-[#7bd0ff] border-l-2 border-[#7bd0ff]'
                  : 'text-[#c6c6cd] hover:text-[#d4e4fa] hover:bg-[#122131]/50'
              }`}
            >
              <span className={`material-symbols-outlined text-xl ${activeTab === 'focus' ? 'material-symbols-fill' : ''}`}>
                timer
              </span>
              <span>Focus Mode</span>
            </button>

            <button
              onClick={() => onChangeTab('analytics')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors text-left ${
                activeTab === 'analytics'
                  ? 'bg-[#122131] text-[#7bd0ff] border-l-2 border-[#7bd0ff]'
                  : 'text-[#c6c6cd] hover:text-[#d4e4fa] hover:bg-[#122131]/50'
              }`}
            >
              <span className={`material-symbols-outlined text-xl ${activeTab === 'analytics' ? 'material-symbols-fill' : ''}`}>
                insights
              </span>
              <span>Analytics &amp; History</span>
            </button>

            <button
              onClick={() => onChangeTab('library')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors text-left ${
                activeTab === 'library'
                  ? 'bg-[#122131] text-[#7bd0ff] border-l-2 border-[#7bd0ff]'
                  : 'text-[#c6c6cd] hover:text-[#d4e4fa] hover:bg-[#122131]/50'
              }`}
            >
              <span className={`material-symbols-outlined text-xl ${activeTab === 'library' ? 'material-symbols-fill' : ''}`}>
                graphic_eq
              </span>
              <span>Ambient Noise Library</span>
            </button>

            <button
              onClick={() => onChangeTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors text-left ${
                activeTab === 'settings'
                  ? 'bg-[#122131] text-[#7bd0ff] border-l-2 border-[#7bd0ff]'
                  : 'text-[#c6c6cd] hover:text-[#d4e4fa] hover:bg-[#122131]/50'
              }`}
            >
              <span className={`material-symbols-outlined text-xl ${activeTab === 'settings' ? 'material-symbols-fill' : ''}`}>
                tune
              </span>
              <span>Device &amp; Alert Settings</span>
            </button>
          </nav>
        </div>

        {/* Live Acoustic Indicator Widget in Sidebar */}
        <div className="my-auto px-3 py-3 rounded-xl bg-[#122131]/70 border border-[#273647]/30 flex flex-col gap-2">
          <div className="flex items-center justify-between text-[11px] text-[#c6c6cd]">
            <span>현재 데시벨 임계치</span>
            <span className="text-[#4edea3] font-bold">{noiseThreshold} dB</span>
          </div>
          <div className="w-full bg-[#273647] rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#4edea3] h-1.5 rounded-full transition-all duration-300" style={{ width: `${Math.min(100, Math.round((currentDb / noiseThreshold) * 100))}%` }}></div>
          </div>
          <div className="text-[10px] text-[#c6c6cd]/80 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4edea3] animate-ping"></span>
            <span>실시간 배경음 자동 필터링 활성</span>
          </div>
        </div>

        {/* SideNavBar Footer */}
        <div className="flex flex-col gap-1 border-t border-[#273647]/30 pt-3">
          {/* Switch to mobile phone simulator button */}
          <button
            onClick={onToggleViewMode}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#7bd0ff] hover:bg-[#1c2b3c]/60 transition-colors text-xs font-semibold text-left mb-1"
          >
            <span className="material-symbols-outlined text-base">smartphone</span>
            <span>모바일 뷰 보기</span>
          </button>
          <button
            onClick={onOpenHelpDocs}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#c6c6cd] hover:text-[#d4e4fa] hover:bg-[#1c2b3c]/60 transition-colors text-xs text-left"
          >
            <span className="material-symbols-outlined text-base">help</span>
            <span>Help &amp; Docs</span>
          </button>
          <button
            onClick={onOpenHelpDocs}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-[#c6c6cd] hover:text-[#d4e4fa] hover:bg-[#1c2b3c]/60 transition-colors text-xs text-left"
          >
            <span className="material-symbols-outlined text-base">headset_mic</span>
            <span>Support</span>
          </button>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* 2. Main Layout Container (Offset by SideNav w-64) */}
      {/* ============================================================ */}
      <div className="ml-64 w-[calc(100%-16rem)] min-h-screen flex flex-col bg-[#051424]">
        {/* TopNavBar Component */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 h-16 bg-[#010f1f]/80 backdrop-blur-md border-b border-[#273647]/30">
          {/* Left: Study Place Pill Tabs */}
          <div className="flex items-center gap-2">
            <nav aria-label="학습 장소 선택" className="flex items-center gap-1.5 p-1 bg-[#0d1c2d] rounded-xl border border-[#273647]/30">
              {places.map((place) => (
                <button
                  key={place.id}
                  onClick={() => onSelectPlace(place)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activePlace.id === place.id
                      ? 'bg-[#7bd0ff] text-[#00354a] font-bold shadow-sm'
                      : 'text-[#c6c6cd] hover:text-[#d4e4fa] hover:bg-[#1c2b3c]/50'
                  }`}
                >
                  {place.name}
                </button>
              ))}
              <button
                onClick={onOpenAddPlace}
                className="px-2 py-1.5 rounded-lg text-xs text-[#c6c6cd]/70 hover:text-[#7bd0ff] hover:bg-[#1c2b3c]/50 transition-colors flex items-center gap-1"
                title="장소 추가"
              >
                <span className="material-symbols-outlined text-sm">add</span>
                <span>장소 추가</span>
              </button>
            </nav>
          </div>

          {/* Right: Real-time Audio Badges & User Profile */}
          <div className="flex items-center gap-3.5">
            {/* Live Microphone Sensor Badge */}
            <button
              onClick={onToggleRealMic}
              title={isRealMic ? "실제 마이크 감지 중 (클릭 시 시뮬레이션 전환)" : "클릭하여 실제 마이크 권한 활성화"}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#122131] border border-[#273647]/30 text-xs text-[#d4e4fa] shadow-sm hover:border-[#7bd0ff]/40 transition-colors cursor-pointer"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4edea3] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4edea3]"></span>
              </span>
              <span className="text-xs text-[#c6c6cd] font-medium">
                {isRealMic ? '마이크 실시간 감지 중' : '마이크 실시간 감지 중'}
              </span>
            </button>

            {/* Calibration Status Pill */}
            <div
              onClick={() => onChangeTab('settings')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1c2b3c]/60 border border-[#273647]/30 text-[11px] text-[#7bd0ff] cursor-pointer hover:bg-[#1c2b3c]"
              title="감도 보정 설정"
            >
              <span className="material-symbols-outlined text-sm">tune</span>
              <span>보정 {sign}{micCalibration.toFixed(1)} dB</span>
            </div>

            {/* Quick Top Icon Actions */}
            <div className="flex items-center gap-1 text-[#c6c6cd]">
              <button
                onClick={() => onChangeTab('library')}
                className="p-2 rounded-lg hover:bg-[#1c2b3c]/60 hover:text-[#d4e4fa] transition-colors"
                title="소음 스펙트럼 및 라이브러리"
              >
                <span className="material-symbols-outlined text-xl">graphic_eq</span>
              </button>
              <button
                onClick={onOpenNotifications}
                className="p-2 rounded-lg hover:bg-[#1c2b3c]/60 hover:text-[#d4e4fa] transition-colors relative"
                title="알림"
              >
                <span className="material-symbols-outlined text-xl">notifications</span>
                {unreadCount > 0 && (
                  <span className="w-2 h-2 bg-[#7bd0ff] rounded-full absolute top-2 right-2 animate-pulse"></span>
                )}
              </button>
              <button
                onClick={onOpenHelpDocs}
                className="p-2 rounded-lg hover:bg-[#1c2b3c]/60 hover:text-[#d4e4fa] transition-colors"
                title="안내"
              >
                <span className="material-symbols-outlined text-xl">dark_mode</span>
              </button>
            </div>

            <div className="h-5 w-[1px] bg-[#273647]/40"></div>

            {/* Primary Session Start Button */}
            <button
              onClick={onToggleTimer}
              className="px-3.5 py-1.5 rounded-lg bg-[#7bd0ff] text-[#00354a] text-xs font-bold hover:bg-[#7bd0ff]/90 transition-all active:scale-95 shadow-sm cursor-pointer"
            >
              {isTimerRunning ? '세션 일시정지' : '세션 시작'}
            </button>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2 pl-1 cursor-pointer group">
              <div className="w-8 h-8 rounded-full bg-[#273647] border border-[#7bd0ff]/40 flex items-center justify-center text-[#7bd0ff] text-xs font-bold">
                수험
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-bold text-[#d4e4fa] leading-tight group-hover:text-[#7bd0ff] transition-colors">
                  김지우 수험생
                </span>
                <span className="text-[10px] text-[#c6c6cd] leading-none">
                  목표 12시간 완주반
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Canvas */}
        <main className="flex-1 p-6 space-y-6 max-w-[1600px] w-full mx-auto">
          {/* ============================================================ */}
          {/* SECTION 1: Top Overview Metric Row (4 Cards) */}
          {/* ============================================================ */}
          <section aria-label="실시간 핵심 메트릭" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1: Real-time Ambient Sound (Prominent dB) */}
            <div className="p-4 rounded-xl bg-[#0d1c2d] border border-[#273647]/30 flex flex-col justify-between relative overflow-hidden transition-all hover:border-[#273647]/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#4edea3] text-lg">mic</span>
                  <span className="text-xs font-semibold text-[#c6c6cd]">실시간 주변 소음</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#001c10]/80 text-[#4edea3] text-[11px] font-semibold border border-[#4edea3]/20">
                  {currentDb <= 45 ? '독서실 최적 환경' : currentDb <= 60 ? '스터디카페 보통' : '소음 주의'}
                </span>
              </div>
              <div className="flex items-center justify-between mt-3 mb-2">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-[#d4e4fa] tracking-tight tabular-nums">
                      {currentDb}
                    </span>
                    <span className="text-sm font-medium text-[#c6c6cd]">dB</span>
                  </div>
                  <div className="text-[11px] text-[#4edea3] font-medium mt-0.5">
                    {currentDb <= 42 ? '안정적 독서실 수준 (조용함)' : currentDb <= 55 ? '적당한 집중 가능 환경' : '외부 소음 다소 높음'}
                  </div>
                </div>

                {/* Mini Live Animated Soundwave Bars */}
                <div className="flex items-end gap-1 h-8 px-2 py-1 bg-[#122131] rounded-lg border border-[#273647]/20">
                  <span className="w-1 bg-[#4edea3] rounded-full wave-bar-1"></span>
                  <span className="w-1 bg-[#4edea3] rounded-full wave-bar-2"></span>
                  <span className="w-1 bg-[#4edea3] rounded-full wave-bar-3"></span>
                  <span className="w-1 bg-[#4edea3] rounded-full wave-bar-4"></span>
                  <span className="w-1 bg-[#4edea3] rounded-full wave-bar-5"></span>
                  <span className="w-1 bg-[#4edea3] rounded-full wave-bar-6"></span>
                  <span className="w-1 bg-[#4edea3] rounded-full wave-bar-7"></span>
                </div>
              </div>
              {/* Min / Max Today Record */}
              <div className="pt-2 border-t border-[#273647]/30 flex items-center justify-between text-xs text-[#c6c6cd]">
                <span>오늘 최저 <strong className="text-[#d4e4fa] font-semibold">{minDb} dB</strong></span>
                <span className="text-[#45464d]">•</span>
                <span>오늘 최고 <strong className="text-[#d4e4fa] font-semibold">{maxDb} dB</strong></span>
              </div>
            </div>

            {/* Metric 2: Today Accumulated Focus Time */}
            <div className="p-4 rounded-xl bg-[#0d1c2d] border border-[#273647]/30 flex flex-col justify-between transition-all hover:border-[#273647]/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#7bd0ff] text-lg">timer</span>
                  <span className="text-xs font-semibold text-[#c6c6cd]">오늘 누적 집중 시간</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-[#00a6e0]/20 text-[#7bd0ff] text-[11px] font-semibold border border-[#7bd0ff]/20">
                  목표대비 106% 달성
                </span>
              </div>
              <div className="mt-3 mb-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold text-[#d4e4fa] tracking-tight">4시간 15분</span>
                  <span className="text-xs text-[#c6c6cd]">/ 4시간</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-[#273647] rounded-full h-1.5 mt-2.5 overflow-hidden">
                  <div className="bg-[#7bd0ff] h-1.5 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div className="pt-2 border-t border-[#273647]/30 flex items-center justify-between text-xs">
                <span className="text-[#c6c6cd]">뽀모도로 8회차 완료</span>
                <span className="text-[#4edea3] font-semibold flex items-center text-xs">
                  <span className="material-symbols-outlined text-sm">trending_up</span> 어제 대비 +45분
                </span>
              </div>
            </div>

            {/* Metric 3: Current Study Place Status */}
            <div className="p-4 rounded-xl bg-[#0d1c2d] border border-[#273647]/30 flex flex-col justify-between transition-all hover:border-[#273647]/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#4edea3] text-lg">location_on</span>
                  <span className="text-xs font-semibold text-[#c6c6cd]">현재 학습 장소 상태</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#4edea3]"></span>
                  <span className="text-[11px] text-[#4edea3] font-bold">안전</span>
                </div>
              </div>
              <div className="mt-3 mb-2">
                <div className="text-base font-bold text-[#d4e4fa] truncate">
                  {activePlace.name} C구역 (집중존)
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-[#c6c6cd]">평균 소음</span>
                  <span className="text-xs text-[#4edea3] font-bold">{activePlace.targetDb} dB</span>
                  <span className="text-[#45464d]">|</span>
                  <span className="text-[11px] text-[#c6c6cd]">
                    소음 초과 기준: <strong className="text-[#d4e4fa]">{noiseThreshold} dB</strong>
                  </span>
                </div>
              </div>
              <div className="pt-2 border-t border-[#273647]/30 flex items-center justify-between text-xs text-[#c6c6cd]">
                <span>방해 소음 감지</span>
                <span className="text-[#d4e4fa] font-semibold">0회 (완벽한 몰입 상태)</span>
              </div>
            </div>

            {/* Metric 4: Quick White Noise Mini Player */}
            <div className="p-4 rounded-xl bg-[#0d1c2d] border border-[#273647]/30 flex flex-col justify-between transition-all hover:border-[#273647]/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#7bd0ff] text-lg">headphones</span>
                  <span className="text-xs font-semibold text-[#c6c6cd]">빠른 백색소음 플레이어</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-[#1c2b3c] text-[10px] text-[#7bd0ff] font-mono">
                  Auto Boost ON
                </span>
              </div>
              <div className="mt-2.5 mb-1.5 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-[#d4e4fa]">{currentSoundName}</div>
                  <div className="text-[11px] text-[#c6c6cd]">차분한 집중력 강화 프리셋</div>
                </div>
                <button
                  onClick={onToggleSound}
                  className="w-9 h-9 rounded-full bg-[#7bd0ff] text-[#00354a] flex items-center justify-center hover:bg-[#7bd0ff]/90 transition-transform active:scale-95 shadow-sm cursor-pointer"
                  title={isSoundPlaying ? '일시정지' : '재생'}
                >
                  <span className="material-symbols-outlined text-lg material-symbols-fill">
                    {isSoundPlaying ? 'pause' : 'play_arrow'}
                  </span>
                </button>
              </div>
              {/* Volume Slider & Auto Boost Mode Pill */}
              <div className="pt-2 border-t border-[#273647]/30 flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#c6c6cd] text-sm">volume_down</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={soundVolume}
                    onChange={(e) => onChangeVolume(Number(e.target.value))}
                    className="w-full h-1 bg-[#273647] rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-[11px] font-mono text-[#c6c6cd] w-8 text-right">{soundVolume}%</span>
                </div>
                <div className="text-[10px] text-[#7bd0ff]/80 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">auto_awesome</span>
                  <span>소음 {noiseThreshold}dB 초과 시 자동 증폭 모드 활성화</span>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================================ */}
          {/* SECTION 2: Central Major Content Area (60% / 40% Split) */}
          {/* ============================================================ */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* ========================================================== */}
            {/* LEFT COLUMN (7 of 12 cols): Pomodoro & dB Graph */}
            {/* ========================================================== */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {/* Interactive Pomodoro & Decibel Gauge Card */}
              <div className="p-6 rounded-2xl bg-[#0d1c2d] border border-[#273647]/30 shadow-lg relative overflow-hidden">
                {/* Header bar */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-[#d4e4fa] tracking-tight">
                        실시간 소음 &amp; 집중 뽀모도로 세션
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-[#1c2b3c] text-xs font-semibold text-[#7bd0ff] border border-[#273647]/50">
                        {currentSession} / {totalSessions} 세션
                      </span>
                    </div>
                    <p className="text-xs text-[#c6c6cd] mt-1">
                      25분 집중 후 5분 휴식 주기로 두뇌 피로도를 완화합니다.
                    </p>
                  </div>

                  {/* Session Mode Badges */}
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-lg bg-[#1c2b3c] text-xs text-[#d4e4fa] font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#7bd0ff]"></span>
                      집중 모드 중
                    </span>
                  </div>
                </div>

                {/* Central Circular Radial Timer & Gauge Display */}
                <div className="flex flex-col items-center justify-center my-4 relative">
                  {/* Subtle Acoustic Glow Halo */}
                  <div className="absolute w-64 h-64 rounded-full bg-[#7bd0ff]/5 blur-3xl pointer-events-none"></div>

                  {/* SVG Radial Gauge Ring */}
                  <div className="relative w-64 h-64 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 240 240">
                      {/* Background Track */}
                      <circle
                        cx="120"
                        cy="120"
                        r="100"
                        fill="transparent"
                        stroke="#1c2b3c"
                        strokeWidth="10"
                      />
                      {/* Decibel Warning Threshold Arc (50dB mark indicator) */}
                      <circle
                        cx="120"
                        cy="120"
                        r="100"
                        fill="transparent"
                        stroke="#f87171"
                        strokeWidth="10"
                        strokeDasharray="8 620"
                        strokeDashoffset="-450"
                        strokeLinecap="round"
                        opacity="0.6"
                      />
                      {/* Active Timer Progress Ring */}
                      <circle
                        cx="120"
                        cy="120"
                        r="100"
                        fill="transparent"
                        stroke="#7bd0ff"
                        strokeWidth="10"
                        strokeDasharray="628"
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-700 ease-out"
                      />
                    </svg>

                    {/* Center Content: Countdown & Live dB Capsule */}
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className="text-xs font-semibold text-[#c6c6cd] tracking-wider uppercase">Focus Time</span>
                      <span className="text-5xl font-extrabold text-[#d4e4fa] tracking-tight mt-1 leading-none tabular-nums">
                        {formattedMinutes}:{formattedSeconds}
                      </span>
                      <div className="mt-3 px-3 py-1 rounded-full bg-[#122131] border border-[#273647]/50 flex items-center gap-1.5 text-xs text-[#4edea3] font-semibold">
                        <span className="material-symbols-outlined text-sm material-symbols-fill">volume_up</span>
                        <span>실시간 {currentDb} dB 유지</span>
                      </div>
                    </div>
                  </div>

                  {/* Controls Toolbar */}
                  <div className="flex items-center gap-3 mt-6">
                    {/* Secondary Reset Button */}
                    <button
                      onClick={onResetTimer}
                      className="px-4 py-2.5 rounded-xl border border-[#273647]/50 text-[#c6c6cd] hover:text-[#d4e4fa] hover:bg-[#1c2b3c]/60 text-xs font-semibold flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">restart_alt</span>
                      <span>리셋</span>
                    </button>

                    {/* Primary Action Button (Sky Blue) */}
                    <button
                      onClick={onToggleTimer}
                      className="px-8 py-3 rounded-xl bg-[#7bd0ff] text-[#00354a] font-bold text-base shadow-md hover:bg-[#7bd0ff]/90 transition-all active:scale-[0.98] flex items-center gap-2 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-xl material-symbols-fill">
                        {isTimerRunning ? 'pause' : 'play_arrow'}
                      </span>
                      <span>{isTimerRunning ? '일시정지' : '시작하기'}</span>
                    </button>

                    {/* Secondary Skip Button */}
                    <button
                      onClick={onSkipTimer}
                      className="px-4 py-2.5 rounded-xl border border-[#273647]/50 text-[#c6c6cd] hover:text-[#d4e4fa] hover:bg-[#1c2b3c]/60 text-xs font-semibold flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-base">skip_next</span>
                      <span>다음 세션 건너뛰기</span>
                    </button>
                  </div>
                </div>

                {/* Real-time Decibel Audio Stream Timeline Graph (30-min window) */}
                <div className="mt-8 pt-6 border-t border-[#273647]/30">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#7bd0ff] text-base">show_chart</span>
                      <span className="text-xs font-bold text-[#d4e4fa]">실시간 데시벨 오디오 스트림 (최근 30분)</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[#c6c6cd]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-0.5 bg-[#7bd0ff]"></span>
                        <span>측정 소음치</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 border-t-2 border-dashed border-[#ffb4ab]"></span>
                        <span className="text-[#ffb4ab] font-medium">기준치 {noiseThreshold} dB</span>
                      </div>
                    </div>
                  </div>

                  {/* Stream Chart Visualization */}
                  <div className="w-full bg-[#122131] rounded-xl p-4 border border-[#273647]/30 relative overflow-hidden">
                    {/* 50dB Guidelines */}
                    <div className="absolute left-10 right-4 top-[32%] border-b border-dashed border-[#ffb4ab]/50 z-10 flex justify-end">
                      <span className="text-[10px] text-[#ffb4ab] font-mono bg-[#122131] px-1 -mt-2">
                        경고 기준 ({noiseThreshold} dB)
                      </span>
                    </div>
                    {/* 40dB Comfort Line */}
                    <div className="absolute left-10 right-4 top-[56%] border-b border-[#273647]/40 z-0 flex justify-end">
                      <span className="text-[10px] text-[#c6c6cd]/50 font-mono bg-[#122131] px-1 -mt-2">
                        독서실 표준 (40 dB)
                      </span>
                    </div>

                    {/* SVG Audio Wave Plot */}
                    <div className="h-32 w-full flex items-end">
                      <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 600 120">
                        <defs>
                          <linearGradient id="streamGrad" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#7bd0ff" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#7bd0ff" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Wave Area */}
                        <path
                          d={`M 0,90 Q 30,85 60,92 T 120,80 T 180,88 T 240,70 T 300,82 T 360,65 T 420,74 T 480,52 T 540,68 T 600,${Math.max(20, Math.min(100, 120 - currentDb * 1.5))} L 600,120 L 0,120 Z`}
                          fill="url(#streamGrad)"
                        />
                        {/* Wave Line */}
                        <path
                          d={`M 0,90 Q 30,85 60,92 T 120,80 T 180,88 T 240,70 T 300,82 T 360,65 T 420,74 T 480,52 T 540,68 T 600,${Math.max(20, Math.min(100, 120 - currentDb * 1.5))}`}
                          fill="none"
                          stroke="#7bd0ff"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        {/* Live Indicator Ping at Head */}
                        <circle cx="600" cy={Math.max(20, Math.min(100, 120 - currentDb * 1.5))} r="4" fill="#7bd0ff" />
                        <circle cx="600" cy={Math.max(20, Math.min(100, 120 - currentDb * 1.5))} r="8" fill="#7bd0ff" opacity="0.3" className="animate-ping" />
                      </svg>
                    </div>

                    {/* Chart Timeline Ticks */}
                    <div className="flex justify-between text-[11px] font-mono text-[#c6c6cd]/70 mt-2 px-1">
                      <span>30분 전 (36dB)</span>
                      <span>20분 전 (38dB)</span>
                      <span>10분 전 (45dB)</span>
                      <span>5분 전 (39dB)</span>
                      <span className="text-[#7bd0ff] font-bold">현재 ({currentDb}dB)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ========================================================== */}
            {/* RIGHT COLUMN (5 of 12 cols): Insights & Log */}
            {/* ========================================================== */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* 1. Acoustic Insights (장소별 소음 비교 & 주간 분석) */}
              <div className="p-6 rounded-2xl bg-[#0d1c2d] border border-[#273647]/30 shadow-md flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#7bd0ff] text-xl">analytics</span>
                    <span className="text-base font-bold text-[#d4e4fa]">
                      장소별 소음 비교 &amp; 주간 분석
                    </span>
                  </div>
                  <span className="text-xs text-[#c6c6cd]">최근 7일 집계</span>
                </div>

                {/* Horizontal Sound Comparison Bars */}
                <div className="space-y-4">
                  {/* Place 1: 독서실 */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#d4e4fa] font-semibold">독서실 (현재)</span>
                        <span className="text-[11px] px-1.5 py-0.2 rounded bg-[#001c10] text-[#4edea3] font-medium">아주 조용함</span>
                      </div>
                      <span className="text-[#4edea3] font-bold font-mono">36 dB</span>
                    </div>
                    <div className="w-full bg-[#273647] rounded-full h-2 overflow-hidden">
                      <div className="bg-[#4edea3] h-2 rounded-full transition-all duration-500" style={{ width: '36%' }}></div>
                    </div>
                  </div>

                  {/* Place 2: 내 방 */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#d4e4fa] font-semibold">내 방</span>
                        <span className="text-[11px] px-1.5 py-0.2 rounded bg-[#001c10] text-[#4edea3] font-medium">조용함</span>
                      </div>
                      <span className="text-[#4edea3] font-bold font-mono">42 dB</span>
                    </div>
                    <div className="w-full bg-[#273647] rounded-full h-2 overflow-hidden">
                      <div className="bg-[#4edea3] h-2 rounded-full transition-all duration-500" style={{ width: '42%' }}></div>
                    </div>
                  </div>

                  {/* Place 3: 스터디카페 */}
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#d4e4fa] font-semibold">스터디카페</span>
                        <span className="text-[11px] px-1.5 py-0.2 rounded bg-[#00a6e0]/20 text-[#7bd0ff] font-medium">보통 수준</span>
                      </div>
                      <span className="text-[#7bd0ff] font-bold font-mono">48 dB</span>
                    </div>
                    <div className="w-full bg-[#273647] rounded-full h-2 overflow-hidden">
                      <div className="bg-[#7bd0ff] h-2 rounded-full transition-all duration-500" style={{ width: '48%' }}></div>
                    </div>
                  </div>

                  {/* Place 4: 일반 카페 */}
                  <div
                    onClick={onOpenCafeStory}
                    className="p-1.5 -mx-1.5 rounded-lg hover:bg-[#1c2b3c]/50 transition-colors cursor-pointer group"
                    title="클릭하여 수험생 카페 소음 사례 영상 및 솔루션 보기"
                  >
                    <div className="flex justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[#d4e4fa] font-semibold group-hover:text-[#7bd0ff] transition-colors">일반 카페</span>
                        <span className="text-[11px] px-1.5 py-0.2 rounded bg-[#93000a]/30 text-[#ffb4ab] font-medium">시끄러움 주의</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#7bd0ff]/20 text-[#7bd0ff] font-bold flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-xs">play_circle</span>
                          사례 영상
                        </span>
                      </div>
                      <span className="text-[#ffb4ab] font-bold font-mono">68 dB</span>
                    </div>
                    <div className="w-full bg-[#273647] rounded-full h-2 overflow-hidden">
                      <div className="bg-[#ffb4ab] h-2 rounded-full transition-all duration-500" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                </div>

                {/* AI Personalized Acoustic Insight Box */}
                <div className="p-4 rounded-xl bg-[#122131] border border-[#273647]/50 flex flex-col gap-2.5 mt-1">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#7bd0ff]/10 text-[#7bd0ff] shrink-0 flex items-center justify-center mt-0.5">
                      <span className="material-symbols-outlined text-lg">psychology</span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#d4e4fa] flex items-center gap-1.5">
                        <span>AI 맞춤 학습 인사이트</span>
                        <span className="text-xs">🎯</span>
                      </div>
                      <p className="text-xs text-[#c6c6cd] mt-1 leading-relaxed">
                        "독서실에서 공부할 때 뽀모도로 집중 완료율이 <strong className="text-[#7bd0ff] font-semibold">35% 더 높았어요!</strong> 안정된 40dB 이하 환경이 암기 효율을 높여주고 있습니다."
                      </p>
                    </div>
                  </div>

                  {/* Student Case Study Button */}
                  <div className="pt-2 border-t border-[#273647]/40 flex items-center justify-between">
                    <span className="text-[11px] text-[#c6c6cd]">
                      "I can't focus anymore" 카페 소음 탈출기
                    </span>
                    <button
                      onClick={onOpenCafeStory}
                      className="px-2.5 py-1 rounded-lg bg-[#7bd0ff]/15 hover:bg-[#7bd0ff]/25 text-[#7bd0ff] text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">smart_display</span>
                      <span>사례 영상 보기</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. Today's Session Timeline Record */}
              <div className="p-6 rounded-2xl bg-[#0d1c2d] border border-[#273647]/30 shadow-md flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#7bd0ff] text-xl">cloud_upload</span>
                    <span className="text-base font-bold text-[#d4e4fa]">
                      오늘의 세션 타임라인 기록
                    </span>
                  </div>
                  <button
                    onClick={() => onChangeTab('analytics')}
                    className="text-xs text-[#7bd0ff] hover:underline cursor-pointer"
                  >
                    전체보기
                  </button>
                </div>

                <div className="space-y-3 mt-1">
                  {sessionRecords.map((session, idx) => (
                    <div
                      key={session.id}
                      className="p-3.5 rounded-xl bg-[#122131] border border-[#273647]/30 flex items-center justify-between hover:border-[#273647]/60 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg bg-[#273647] flex items-center justify-center font-bold text-xs ${
                            idx === 2 ? 'text-[#7bd0ff]' : 'text-[#4edea3]'
                          }`}
                        >
                          {String(session.sessionNumber).padStart(2, '0')}
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-[#d4e4fa]">
                            세션 {session.sessionNumber}: {session.timeRange}
                          </div>
                          <div className="text-[11px] text-[#c6c6cd] flex items-center gap-2 mt-0.5">
                            <span>{session.placeName}</span>
                            <span className="text-[#45464d]">•</span>
                            <span>평균 <strong className={idx === 2 ? 'text-[#7bd0ff]' : 'text-[#4edea3]'}>{session.avgDb} dB</strong></span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                            idx === 2
                              ? 'bg-[#7bd0ff]/10 text-[#7bd0ff]'
                              : 'bg-[#4edea3]/10 text-[#4edea3]'
                          }`}
                        >
                          {session.durationMinutes}분 완료
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Quick Calibration / Device Sync Tip */}
                <div className="pt-3 border-t border-[#273647]/30 flex items-center justify-between text-xs text-[#c6c6cd]/80">
                  <span className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm text-[#7bd0ff]">verified</span>
                    <span>모든 음향 데이터는 로컬에서 실시간 암호화 처리됩니다</span>
                  </span>
                  <button
                    onClick={onExportLogs}
                    className="text-[#7bd0ff] hover:underline text-xs font-medium cursor-pointer"
                  >
                    내보내기
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Atmospheric Footer status bar */}
        <footer className="mt-auto px-6 py-3 border-t border-[#273647]/30 text-xs text-[#c6c6cd] flex items-center justify-between bg-[#010f1f]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-xs">
              <span className="w-2 h-2 rounded-full bg-[#4edea3]"></span>
              <span>오디오 인터페이스: {isRealMic ? 'Built-in Mic (48kHz 24bit)' : 'MacBook Built-in Mic (48kHz 24bit)'}</span>
            </span>
            <span className="text-[#45464d]">|</span>
            <span className="text-xs">동기화 상태: 정상 (지연 시간 12ms)</span>
          </div>
          <div className="text-xs text-[#c6c6cd]/70 font-mono">
            Serene Study v2.4 Acoustic Edition
          </div>
        </footer>
      </div>
    </div>
  );
};
