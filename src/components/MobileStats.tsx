import React, { useState } from 'react';
import { DailyFocusLog } from '../types';

interface MobileStatsProps {
  onOpenNotifications: () => void;
  unreadCount: number;
  activeTab: string;
  onChangeTab: (tab: string) => void;
  dailyLogs: DailyFocusLog[];
  onExportLogs: () => void;
  onOpenCafeStory?: () => void;
}

export const MobileStats: React.FC<MobileStatsProps> = ({
  onOpenNotifications,
  unreadCount,
  onChangeTab,
  dailyLogs,
  onExportLogs,
  onOpenCafeStory,
}) => {
  const [period, setPeriod] = useState<'week' | 'month'>('week');

  return (
    <div className="w-full max-w-md min-h-screen mx-auto flex flex-col justify-between bg-[#051424] text-[#d4e4fa] pb-28 shadow-2xl relative">
      {/* Top App Bar */}
      <header className="bg-[#051424] sticky top-0 z-40 flex justify-between items-center w-full px-5 py-3 border-b border-[#273647]/30 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#7bd0ff] material-symbols-fill">
            graphic_eq
          </span>
          <h1 className="text-lg font-bold text-[#d4e4fa] tracking-tight">집중 &amp; 소음 데시벨</h1>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onOpenNotifications}
            aria-label="알림"
            className="p-2 rounded-full text-[#c6c6cd] hover:text-[#7bd0ff] transition-colors active:scale-95 duration-150 relative cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-xl text-[#7bd0ff]">notifications</span>
            {unreadCount > 0 && (
              <span className="w-2 h-2 bg-[#7bd0ff] rounded-full absolute top-2 right-2"></span>
            )}
          </button>
        </div>
      </header>

      {/* Main Canvas */}
      <main className="px-5 pt-4 space-y-6">
        {/* Title & Segmented Period Filter */}
        <section className="flex items-center justify-between gap-2">
          <div>
            <p className="text-[11px] font-bold text-[#7bd0ff] uppercase tracking-wider">
              ACOUSTIC INSIGHTS
            </p>
            <h2 className="text-xl font-bold text-[#d4e4fa]">통계 &amp; 기록</h2>
          </div>

          {/* Segmented Control Pill */}
          <div className="inline-flex p-1 rounded-full bg-[#122131] border border-[#273647]/50">
            <button
              onClick={() => setPeriod('week')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-150 cursor-pointer ${
                period === 'week'
                  ? 'bg-[#7bd0ff] text-[#00354a] shadow-sm'
                  : 'text-[#c6c6cd] hover:text-[#d4e4fa]'
              }`}
              type="button"
            >
              이번 주
            </button>
            <button
              onClick={() => setPeriod('month')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-150 cursor-pointer ${
                period === 'month'
                  ? 'bg-[#7bd0ff] text-[#00354a] shadow-sm font-bold'
                  : 'text-[#c6c6cd] hover:text-[#d4e4fa]'
              }`}
              type="button"
            >
              이번 달
            </button>
          </div>
        </section>

        {/* Bento Grid Section: Sound Environment Stats */}
        <section className="p-5 rounded-2xl bg-[#122131] border border-[#273647]/40 space-y-4 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#7bd0ff] text-lg">volume_up</span>
              <h3 className="text-sm font-bold text-[#d4e4fa]">장소별 평균 소음 비교</h3>
            </div>
            <span className="text-[11px] text-[#c6c6cd]">데시벨(dB)</span>
          </div>

          <p className="text-xs text-[#c6c6cd] leading-relaxed">
            최근 일주일 동안 기록된 학습 공간의 실시간 평균 소음도입니다.
          </p>

          {/* Bar Graph Module */}
          <div className="space-y-3.5 pt-1">
            {/* 독서실 (36dB - Very Quiet) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#d4e4fa] font-medium flex items-center gap-1.5">
                  독서실
                  <span className="px-1.5 py-0.5 rounded text-[10px] text-[#003824] bg-[#4edea3] font-semibold">
                    아주 조용함
                  </span>
                </span>
                <span className="font-bold text-[#4edea3]">36 dB</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#1c2b3c] overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-[#4edea3] transition-all duration-500"
                  style={{ width: '36%' }}
                ></div>
              </div>
            </div>

            {/* 내 방 (42dB - Quiet) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#d4e4fa] font-medium">내 방</span>
                <span className="font-bold text-[#4edea3]">42 dB</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#1c2b3c] overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-[#4edea3] transition-all duration-500"
                  style={{ width: '42%' }}
                ></div>
              </div>
            </div>

            {/* 스터디카페 (48dB - Moderate) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#d4e4fa] font-medium flex items-center gap-1.5">
                  스터디카페
                  <span className="px-1.5 py-0.5 rounded text-[10px] text-[#001e2c] bg-[#c4e7ff] font-semibold">
                    보통
                  </span>
                </span>
                <span className="font-bold text-[#7bd0ff]">48 dB</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#1c2b3c] overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-[#7bd0ff] transition-all duration-500"
                  style={{ width: '48%' }}
                ></div>
              </div>
            </div>

            {/* 일반 카페 (68dB - Loud Warning) */}
            <div
              onClick={onOpenCafeStory}
              className="space-y-1.5 p-1 -mx-1 rounded-lg hover:bg-[#1c2b3c]/50 transition-colors cursor-pointer group"
              title="클릭하여 수험생 카페 소음 사례 영상 보기"
            >
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#d4e4fa] font-medium flex items-center gap-1.5 group-hover:text-[#7bd0ff] transition-colors">
                  일반 카페
                  <span className="px-1.5 py-0.5 rounded text-[10px] text-[#ffb4ab] bg-[#93000a]/50 font-semibold">
                    시끄러움 주의
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] text-[#7bd0ff] bg-[#7bd0ff]/20 font-bold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-xs">play_circle</span>
                    사례 영상
                  </span>
                </span>
                <span className="font-bold text-[#ffb4ab]">68 dB</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#1c2b3c] overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-[#ffb4ab] transition-all duration-500"
                  style={{ width: '68%' }}
                ></div>
              </div>
            </div>
          </div>

          {/* Quick Context Legend */}
          <div className="pt-2 border-t border-[#273647]/30 flex items-center justify-between text-[11px] text-[#c6c6cd]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#4edea3] inline-block"></span> 0~45dB 최적
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#7bd0ff] inline-block"></span> 46~60dB 집중가능
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#ffb4ab] inline-block"></span> 60dB+ 주의
            </span>
          </div>
        </section>

        {/* Insight Banner Card */}
        <div className="p-4 rounded-2xl bg-[#1c2b3c] border border-[#273647]/50 flex flex-col gap-2.5 relative overflow-hidden shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[#7bd0ff]/15 text-[#7bd0ff] shrink-0">
              <span className="material-symbols-outlined text-lg">lightbulb</span>
            </div>
            <div className="space-y-1 pr-1 text-left">
              <p className="text-xs text-[#7bd0ff] font-bold">맞춤형 집중 인사이트</p>
              <p className="text-xs text-[#d4e4fa] font-medium leading-relaxed">
                독서실에서 공부할 때 평균 집중 시간이{' '}
                <span className="text-[#4edea3] font-bold underline decoration-[#4edea3] underline-offset-4">
                  45분 더
                </span>{' '}
                길었어요! 🎯
              </p>
            </div>
          </div>

          {onOpenCafeStory && (
            <div className="pt-2 border-t border-[#273647]/40 flex items-center justify-between">
              <span className="text-[11px] text-[#c6c6cd]">
                "I can't focus anymore..." 극복기
              </span>
              <button
                onClick={onOpenCafeStory}
                className="px-2.5 py-1 rounded-lg bg-[#7bd0ff]/20 text-[#7bd0ff] text-[11px] font-bold flex items-center gap-1 cursor-pointer active:scale-95 transition-transform"
              >
                <span className="material-symbols-outlined text-sm">smart_display</span>
                <span>사례 영상 보기</span>
              </button>
            </div>
          )}
        </div>

        {/* Daily Focus Logs Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#7bd0ff] text-lg">event_note</span>
              <h3 className="text-sm font-bold text-[#d4e4fa]">날짜별 집중 시간 기록</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#7bd0ff] font-semibold">총 12시간 45분</span>
              <button
                onClick={onExportLogs}
                className="text-[11px] text-[#c6c6cd] hover:text-[#7bd0ff] underline"
                title="데이터 내보내기"
              >
                내보내기
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            {dailyLogs.map((log) => (
              <article
                key={log.id}
                className="p-4 rounded-xl bg-[#122131] border border-[#273647]/40 hover:border-[#7bd0ff]/30 transition-all flex items-center justify-between"
              >
                <div className="space-y-1 text-left">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.label === '오늘'
                          ? 'bg-[#7bd0ff]/20 text-[#7bd0ff]'
                          : 'bg-[#273647] text-[#c6c6cd]'
                      }`}
                    >
                      {log.label}
                    </span>
                    <p className="text-xs text-[#d4e4fa] font-semibold">{log.dateFormatted}</p>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#c6c6cd]">
                    <span>뽀모도로 {log.pomodoroCount}회차 완료</span>
                    <span>•</span>
                    <span className="text-[#4edea3] font-medium">평균 {log.avgDb}dB</span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm text-[#7bd0ff] font-bold">{log.totalTimeStr}</p>
                  <p
                    className={`text-[10px] font-semibold ${
                      log.targetPercentage >= 100 ? 'text-[#4edea3]' : 'text-[#c6c6cd]'
                    }`}
                  >
                    목표 {log.targetPercentage}% 달성
                  </p>
                </div>
              </article>
            ))}
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
          className="flex flex-col items-center justify-center text-[#7bd0ff] text-xs font-bold py-1 active:scale-95 transition-transform"
        >
          <span className="material-symbols-outlined text-xl material-symbols-fill">bar_chart</span>
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
