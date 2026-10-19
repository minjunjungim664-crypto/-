import React from 'react';
import { SOUND_PRESETS, SoundType } from '../audioEngine';

interface MobileSettingsProps {
  noiseThreshold: number;
  onChangeNoiseThreshold: (val: number) => void;
  vibrateAlert: boolean;
  onToggleVibrate: () => void;
  autoWhiteNoise: boolean;
  onToggleAutoWhiteNoise: () => void;
  selectedSound: SoundType;
  onSelectSound: (sound: SoundType) => void;
  soundVolume: number;
  onChangeVolume: (vol: number) => void;
  micCalibration: number;
  onAdjustCalibration: (delta: number) => void;
  onOpenNotifications: () => void;
  unreadCount: number;
  activeTab: string;
  onChangeTab: (tab: string) => void;
}

export const MobileSettings: React.FC<MobileSettingsProps> = ({
  noiseThreshold,
  onChangeNoiseThreshold,
  vibrateAlert,
  onToggleVibrate,
  autoWhiteNoise,
  onToggleAutoWhiteNoise,
  selectedSound,
  onSelectSound,
  soundVolume,
  onChangeVolume,
  micCalibration,
  onAdjustCalibration,
  onOpenNotifications,
  unreadCount,
  onChangeTab,
}) => {
  const sign = micCalibration >= 0 ? '+' : '';

  return (
    <div className="w-full max-w-md min-h-screen mx-auto flex flex-col justify-between bg-[#051424] text-[#d4e4fa] pb-24 shadow-2xl relative">
      {/* Top Navigation Shell */}
      <header className="sticky top-0 z-40 bg-[#051424] border-b border-[#273647]/30">
        <div className="flex justify-between items-center w-full px-5 py-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onChangeTab('home')}
              className="text-[#7bd0ff] active:scale-95 transition-transform duration-150 flex items-center justify-center p-1 rounded-lg hover:text-[#7bd0ff]/80 cursor-pointer"
            >
              <span className="material-symbols-outlined material-symbols-fill">graphic_eq</span>
            </button>
            <h1 className="text-lg font-bold text-[#d4e4fa] tracking-tight">설정</h1>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={onOpenNotifications}
              aria-label="알림"
              className="text-[#7bd0ff] active:scale-95 transition-transform duration-150 p-1.5 rounded-full hover:bg-[#122131] transition-colors relative cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">notifications</span>
              {unreadCount > 0 && (
                <span className="w-2 h-2 bg-[#7bd0ff] rounded-full absolute top-1.5 right-1.5"></span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="px-5 py-5 space-y-6">
        {/* Section 1: Real-time Noise Alert Threshold Setting */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-[#d4e4fa] flex items-center space-x-2">
              <span className="material-symbols-outlined text-[#7bd0ff] text-lg">volume_up</span>
              <span>실시간 소음 알림 기준값 설정</span>
            </h2>
            <span className="text-[11px] text-[#c6c6cd] bg-[#1c2b3c] px-2 py-0.5 rounded-full">
              환경 감지
            </span>
          </div>

          <div className="bg-[#122131] rounded-2xl p-5 border border-[#273647]/40 space-y-5 shadow-md">
            {/* Slider & Value Display */}
            <div>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-xs font-semibold text-[#d4e4fa]">경고 기준</span>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl text-[#7bd0ff] font-extrabold tabular-nums">
                    {noiseThreshold}
                  </span>
                  <span className="text-xs text-[#c6c6cd]">dB</span>
                </div>
              </div>
              <div className="relative py-1">
                <input
                  type="range"
                  min="40"
                  max="90"
                  value={noiseThreshold}
                  onChange={(e) => onChangeNoiseThreshold(Number(e.target.value))}
                  className="w-full h-2 cursor-pointer"
                />
              </div>
              <div className="flex justify-between text-[11px] text-[#c6c6cd]/70 mt-1.5 px-0.5">
                <span>40 dB (도서관)</span>
                <span>65 dB (스터디카페)</span>
                <span>90 dB (경고)</span>
              </div>
            </div>

            <div className="h-px bg-[#273647]/40 w-full"></div>

            {/* Toggles Stack */}
            <div className="space-y-4">
              {/* Toggle 1: Vibration */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 pr-2 text-left">
                  <div className="text-xs font-semibold text-[#d4e4fa]">기준 초과 시 진동 알림</div>
                  <p className="text-[11px] text-[#c6c6cd]">
                    소음이 설정치를 넘으면 부드러운 햅틱으로 안내합니다.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={vibrateAlert}
                    onChange={onToggleVibrate}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#273647] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[#051424] peer-checked:bg-[#7bd0ff] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#00354a] after:border-[#051424] after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>

              {/* Toggle 2: Auto White Noise */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5 pr-2 text-left">
                  <div className="text-xs font-semibold text-[#d4e4fa]">
                    기준 초과 시 자동 백색소음 재생
                  </div>
                  <p className="text-[11px] text-[#c6c6cd]">
                    주변이 산만해질 때 선택된 사운드를 서서히 켭니다.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={autoWhiteNoise}
                    onChange={onToggleAutoWhiteNoise}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#273647] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-[#051424] peer-checked:bg-[#7bd0ff] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#00354a] after:border-[#051424] after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: White Noise Library */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-[#d4e4fa] flex items-center space-x-2">
              <span className="material-symbols-outlined text-[#7bd0ff] text-lg">headphones</span>
              <span>백색소음 선택 라이브러리</span>
            </h2>
            <span className="text-[11px] text-[#7bd0ff] font-semibold">5개 사운드</span>
          </div>

          <div className="bg-[#122131] rounded-2xl border border-[#273647]/40 divide-y divide-[#273647]/30 overflow-hidden shadow-md">
            {SOUND_PRESETS.map((preset) => {
              const isSelected = selectedSound === preset.id;

              return (
                <div
                  key={preset.id}
                  onClick={() => onSelectSound(preset.id)}
                  className={`p-4 transition-colors cursor-pointer text-left ${
                    isSelected ? 'bg-[#1c2b3c]/80' : 'hover:bg-[#1c2b3c]/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          isSelected
                            ? 'bg-[#00a6e0]/20 text-[#7bd0ff]'
                            : 'bg-[#273647]/40 text-[#c6c6cd]'
                        }`}
                      >
                        <span className="material-symbols-outlined">{preset.icon}</span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs font-bold ${isSelected ? 'text-[#d4e4fa]' : 'text-[#c6c6cd]'}`}>
                            {preset.name}
                          </span>
                          {isSelected && (
                            <span className="bg-[#00a6e0]/20 text-[#7bd0ff] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                              선택됨
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#c6c6cd]/80 mt-0.5">{preset.subtitle}</p>
                      </div>
                    </div>

                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-[#7bd0ff] text-[#00354a] shadow-sm'
                          : 'border border-[#273647] hover:border-[#7bd0ff]'
                      }`}
                    >
                      {isSelected && (
                        <span className="material-symbols-outlined text-sm font-bold">check</span>
                      )}
                    </div>
                  </div>

                  {/* Volume Sub-Slider for Active Sound */}
                  {isSelected && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="mt-4 pt-3 border-t border-[#273647]/40 flex items-center space-x-3"
                    >
                      <span className="material-symbols-outlined text-[#c6c6cd] text-base">
                        volume_down
                      </span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={soundVolume}
                        onChange={(e) => onChangeVolume(Number(e.target.value))}
                        className="w-full h-1.5 cursor-pointer"
                      />
                      <span className="material-symbols-outlined text-[#c6c6cd] text-base">
                        volume_up
                      </span>
                      <span className="text-xs text-[#7bd0ff] font-medium w-8 text-right font-mono">
                        {soundVolume}%
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 3: Microphone Calibration & Sensitivity */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-bold text-[#d4e4fa] flex items-center space-x-2">
              <span className="material-symbols-outlined text-[#7bd0ff] text-lg">tune</span>
              <span>마이크 보정 및 감도 설정</span>
            </h2>
            <span className="text-[11px] text-[#c6c6cd]">하드웨어 매핑</span>
          </div>

          <div className="bg-[#122131] rounded-2xl p-5 border border-[#273647]/40 space-y-4 shadow-md">
            <div className="flex justify-between items-start text-left">
              <div>
                <div className="text-xs font-semibold text-[#d4e4fa]">마이크 감도 보정</div>
                <p className="text-[11px] text-[#c6c6cd] mt-0.5">
                  스마트폰 마이크 특성에 맞춰 데시벨 오차를 보정합니다.
                </p>
              </div>
              <div className="text-right shrink-0 ml-3">
                <span className="text-lg text-[#7bd0ff] font-bold tabular-nums">
                  {sign}{micCalibration.toFixed(1)}
                </span>
                <span className="text-xs text-[#c6c6cd] ml-1">dB</span>
              </div>
            </div>

            {/* Increment / Decrement Stepper Controls */}
            <div className="flex items-center space-x-3 pt-1">
              <button
                onClick={() => onAdjustCalibration(-0.5)}
                className="flex-1 py-2.5 rounded-xl bg-[#1c2b3c] border border-[#273647]/50 text-[#d4e4fa] text-xs font-semibold flex items-center justify-center space-x-1.5 active:scale-95 transition-transform hover:bg-[#2c3a4c] cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">remove</span>
                <span>0.5 dB 낮춤</span>
              </button>
              <button
                onClick={() => onAdjustCalibration(0.5)}
                className="flex-1 py-2.5 rounded-xl bg-[#1c2b3c] border border-[#273647]/50 text-[#d4e4fa] text-xs font-semibold flex items-center justify-center space-x-1.5 active:scale-95 transition-transform hover:bg-[#2c3a4c] cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">add</span>
                <span>0.5 dB 높임</span>
              </button>
            </div>

            {/* Environment Info Pill */}
            <div className="bg-[#010f1f] p-3 rounded-xl border border-[#273647]/30 flex items-center space-x-2.5 text-left">
              <span className="material-symbols-outlined text-[#7bd0ff] text-base shrink-0">info</span>
              <span className="text-xs text-[#c6c6cd]">
                현재 추천 설정값:{' '}
                <strong className="text-[#d4e4fa] font-semibold">스터디카페 모드 (+2.0 dB)</strong>
              </span>
            </div>
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
          className="flex flex-col items-center justify-center text-[#7bd0ff] text-xs font-bold py-1 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-xl material-symbols-fill">settings</span>
          <span className="mt-0.5">설정</span>
        </button>
      </nav>
    </div>
  );
};
