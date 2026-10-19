import { useState, useEffect, useRef } from 'react';
import { StudyPlace, SessionRecord, DailyFocusLog } from './types';
import { audioEngine, SOUND_PRESETS, SoundType } from './audioEngine';
import { DesktopDashboard } from './components/DesktopDashboard';
import { MobileHome } from './components/MobileHome';
import { MobileFocus } from './components/MobileFocus';
import { MobileStats } from './components/MobileStats';
import { MobileSettings } from './components/MobileSettings';
import { AddPlaceModal } from './components/AddPlaceModal';
import { NotificationModal } from './components/NotificationModal';
import { HelpDocsModal } from './components/HelpDocsModal';
import { CafeCaseStudyModal } from './components/CafeCaseStudyModal';

const INITIAL_PLACES: StudyPlace[] = [
  { id: 'place-1', name: '독서실', targetDb: 38, statusText: '아주 조용함' },
  { id: 'place-2', name: '스터디카페', targetDb: 48, statusText: '보통 수준' },
  { id: 'place-3', name: '내 방', targetDb: 42, statusText: '조용함' },
];

const INITIAL_SESSIONS: SessionRecord[] = [
  {
    id: 'sess-1',
    sessionNumber: 1,
    timeRange: '09:30 ~ 10:20',
    placeName: '독서실',
    avgDb: 37,
    durationMinutes: 50,
    dateStr: '2026-10-19',
  },
  {
    id: 'sess-2',
    sessionNumber: 2,
    timeRange: '10:30 ~ 11:15',
    placeName: '독서실',
    avgDb: 39,
    durationMinutes: 45,
    dateStr: '2026-10-19',
  },
  {
    id: 'sess-3',
    sessionNumber: 3,
    timeRange: '13:00 ~ 13:50',
    placeName: '스터디카페',
    avgDb: 46,
    durationMinutes: 50,
    dateStr: '2026-10-19',
  },
];

const INITIAL_DAILY_LOGS: DailyFocusLog[] = [
  {
    id: 'log-1',
    label: '오늘',
    dateFormatted: '10월 24일 (목)',
    pomodoroCount: 8,
    avgDb: 39,
    totalTimeStr: '4시간 15분',
    targetPercentage: 106,
  },
  {
    id: 'log-2',
    label: '어제',
    dateFormatted: '10월 23일 (수)',
    pomodoroCount: 7,
    avgDb: 44,
    totalTimeStr: '3시간 30분',
    targetPercentage: 87,
  },
  {
    id: 'log-3',
    label: '화',
    dateFormatted: '10월 22일 (화)',
    pomodoroCount: 10,
    avgDb: 37,
    totalTimeStr: '5시간 00분',
    targetPercentage: 125,
  },
];

export default function App() {
  // Navigation
  const [activeTab, setActiveTab] = useState<'dashboard' | 'home' | 'focus' | 'analytics' | 'library' | 'settings'>('dashboard');
  const [isMobilePreview, setIsMobilePreview] = useState<boolean>(false);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);

  // Places
  const [places, setPlaces] = useState<StudyPlace[]>(INITIAL_PLACES);
  const [activePlace, setActivePlace] = useState<StudyPlace>(INITIAL_PLACES[0]);

  // Audio & Noise
  const [currentDb, setCurrentDb] = useState<number>(42);
  const [minDb, setMinDb] = useState<number>(35);
  const [maxDb, setMaxDb] = useState<number>(58);
  const [micCalibration, setMicCalibration] = useState<number>(2.0);
  const [noiseThreshold, setNoiseThreshold] = useState<number>(50);
  const [isRealMic, setIsRealMic] = useState<boolean>(false);

  // Timer
  const [timerMinutes, setTimerMinutes] = useState<number>(21);
  const [timerSeconds, setTimerSeconds] = useState<number>(45);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerMode, setTimerMode] = useState<'focus' | 'break'>('focus');
  const [currentSession, setCurrentSession] = useState<number>(2);
  const totalSessions = 4;

  // Ambient sound
  const [selectedSound, setSelectedSound] = useState<SoundType>('rain');
  const [isSoundPlaying, setIsSoundPlaying] = useState<boolean>(false);
  const [soundVolume, setSoundVolume] = useState<number>(40);
  const [vibrateAlert, setVibrateAlert] = useState<boolean>(true);
  const [autoWhiteNoise, setAutoWhiteNoise] = useState<boolean>(true);

  // Sessions and History
  const [sessionRecords, setSessionRecords] = useState<SessionRecord[]>(INITIAL_SESSIONS);
  const [dailyLogs, setDailyLogs] = useState<DailyFocusLog[]>(INITIAL_DAILY_LOGS);

  // Modals
  const [isAddPlaceOpen, setIsAddPlaceOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [isHelpDocsOpen, setIsHelpDocsOpen] = useState<boolean>(false);
  const [isCafeModalOpen, setIsCafeModalOpen] = useState<boolean>(false);

  // Notifications
  const [notifications, setNotifications] = useState<
    { id: string; title: string; desc: string; time: string; type: 'safe' | 'alert' | 'session' }[]
  >([
    {
      id: 'notif-1',
      title: '뽀모도로 2회차 시작',
      desc: '25분 몰입 세션이 시작되었습니다. 휴대폰을 뒤집어 두세요.',
      time: '10분 전',
      type: 'session',
    },
    {
      id: 'notif-2',
      title: '독서실 최적 환경 유지',
      desc: '현재 평균 38dB로 매우 차분한 학습 분위기입니다.',
      time: '25분 전',
      type: 'safe',
    },
    {
      id: 'notif-3',
      title: '일시적 소음 감지 안내',
      desc: '52dB 소음이 2초간 감지되어 백색소음 자동 마스킹이 동작했습니다.',
      time: '1시간 전',
      type: 'alert',
    },
  ]);

  // Window resize listener to set initial screen type
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;
      setIsSmallScreen(isMobile);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Timer Tick Hook
  useEffect(() => {
    if (!isTimerRunning) return;

    const interval = setInterval(() => {
      setTimerSeconds((prevSec) => {
        if (prevSec > 0) {
          return prevSec - 1;
        } else {
          // Seconds hit 0
          setTimerMinutes((prevMin) => {
            if (prevMin > 0) {
              return prevMin - 1;
            } else {
              // Timer finished!
              audioEngine.playSessionEndChime();
              if (timerMode === 'focus') {
                // Completed focus session
                setTimerMode('break');
                setCurrentSession((cs) => (cs < totalSessions ? cs + 1 : 1));
                setNotifications((prev) => [
                  {
                    id: `notif-${Date.now()}`,
                    title: '25분 몰입 세션 완료! 🎉',
                    desc: '축하합니다! 5분간 가벼운 스트레칭과 눈 휴식을 취하세요.',
                    time: '방금 전',
                    type: 'session',
                  },
                  ...prev,
                ]);
                return 5; // 5 min break
              } else {
                // Break ended
                setTimerMode('focus');
                setNotifications((prev) => [
                  {
                    id: `notif-${Date.now()}`,
                    title: '휴식 종료',
                    desc: '새로운 25분 집중 세션을 시작할 준비를 하세요.',
                    time: '방금 전',
                    type: 'session',
                  },
                  ...prev,
                ]);
                return 25; // 25 min focus
              }
            }
          });
          return 59;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, timerMode, totalSessions]);

  // Decibel simulation loop (when not using real mic)
  const calibrationRef = useRef(micCalibration);
  calibrationRef.current = micCalibration;

  useEffect(() => {
    if (isRealMic) return;

    const interval = setInterval(() => {
      const baseline = activePlace.targetDb || 40;
      const jitter = (Math.random() * 4 - 2); // -2 to +2
      const computed = Math.round(baseline + jitter + calibrationRef.current);
      const clamped = Math.max(30, Math.min(75, computed));

      setCurrentDb(clamped);
      setMinDb((m) => Math.min(m, clamped));
      setMaxDb((m) => Math.max(m, clamped));

      // Threshold alert check
      if (clamped > noiseThreshold) {
        if (vibrateAlert && navigator.vibrate) {
          try {
            navigator.vibrate(100);
          } catch {
            // ignore
          }
        }
      }
    }, 2400);

    return () => clearInterval(interval);
  }, [isRealMic, activePlace.targetDb, noiseThreshold, vibrateAlert]);

  // Real microphone toggle
  const handleToggleRealMic = async () => {
    if (isRealMic) {
      audioEngine.stopMicrophone();
      setIsRealMic(false);
    } else {
      const ok = await audioEngine.startMicrophone((liveDb) => {
        const calibrated = Math.round(liveDb + calibrationRef.current);
        setCurrentDb(calibrated);
        setMinDb((m) => Math.min(m, calibrated));
        setMaxDb((m) => Math.max(m, calibrated));
      });
      if (ok) {
        setIsRealMic(true);
      } else {
        alert('마이크 접근 권한이 거부되었거나 지원되지 않습니다. 자연스러운 가상 소음 모니터링 모드로 동작합니다.');
      }
    }
  };

  // Sound control
  const handleToggleSound = (sound?: SoundType) => {
    const nextPlaying = audioEngine.togglePlay(sound || selectedSound);
    setIsSoundPlaying(nextPlaying);
  };

  const handleSelectSound = (sound: SoundType) => {
    setSelectedSound(sound);
    audioEngine.playAmbient(sound);
    setIsSoundPlaying(true);
  };

  const handleChangeVolume = (vol: number) => {
    setSoundVolume(vol);
    audioEngine.setVolume(vol);
  };

  // Stepper calibration
  const handleAdjustCalibration = (delta: number) => {
    setMicCalibration((prev) => {
      const next = Math.round((prev + delta) * 10) / 10;
      return Math.max(-10, Math.min(10, next));
    });
  };

  // Reset Timer
  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerMode('focus');
    setTimerMinutes(25);
    setTimerSeconds(0);
  };

  // Skip Timer
  const handleSkipTimer = () => {
    setIsTimerRunning(false);
    if (timerMode === 'focus') {
      setTimerMode('break');
      setTimerMinutes(5);
      setTimerSeconds(0);
      setCurrentSession((cs) => (cs < totalSessions ? cs + 1 : 1));
    } else {
      setTimerMode('focus');
      setTimerMinutes(25);
      setTimerSeconds(0);
    }
  };

  // Export Study Logs (CSV Download)
  const handleExportLogs = () => {
    const csvHeader = 'Session ID,Session Number,Time Range,Place,Average dB,Duration (min),Date\n';
    const csvRows = sessionRecords
      .map(
        (s) =>
          `"${s.id}",${s.sessionNumber},"${s.timeRange}","${s.placeName}",${s.avgDb},${s.durationMinutes},"${s.dateStr}"`
      )
      .join('\n');
    const blob = new Blob([csvHeader + csvRows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `serene_study_sessions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Active Sound Name
  const currentSoundPreset = SOUND_PRESETS.find((p) => p.id === selectedSound) || SOUND_PRESETS[0];

  // Apply Cafe Mode (from student case study video)
  const handleApplyCafeMode = () => {
    const cafePlace: StudyPlace = {
      id: 'place-cafe',
      name: '일반 카페',
      targetDb: 68,
      statusText: '시끄러움 주의',
      isCustom: true,
    };
    if (!places.some((p) => p.name === '일반 카페')) {
      setPlaces((prev) => [...prev, cafePlace]);
    }
    setActivePlace(cafePlace);
    setCurrentDb(68);
    setMaxDb((m) => Math.max(m, 68));
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: '⚠️ 일반 카페 소음 68dB 감지',
        desc: '"I can\'t focus anymore..." 주변 소음이 높아 집중력이 급격히 저하됩니다. 백색소음 마스킹을 켜보세요!',
        time: '방금 전',
        type: 'alert',
      },
      ...prev,
    ]);
  };

  // Enable White Noise Masking
  const handleEnableMasking = () => {
    setSelectedSound('rain');
    setSoundVolume(75);
    audioEngine.setVolume(75);
    audioEngine.playAmbient('rain');
    setIsSoundPlaying(true);
    setCurrentDb(40); // Sound masking effectively brings perceived noise to 40dB!
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: '🛡️ 백색소음 사운드 쉴드 활성화',
        desc: '차분한 빗소리(75%)로 외부 68dB 카페 소음을 마스킹하여 체감 소음을 40dB로 안정화했습니다.',
        time: '방금 전',
        type: 'safe',
      },
      ...prev,
    ]);
  };

  // Determine which layout to show:
  // If small screen (<1024px) or if user explicitly toggled mobile preview:
  const showMobileView = isSmallScreen || isMobilePreview;

  return (
    <div className="min-h-screen bg-[#051424] text-[#d4e4fa] font-sans antialiased">
      {/* Floating Device Viewport Switcher (Convenient for previewing both Mobile & Desktop on wide monitors) */}
      {!isSmallScreen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#0d1c2d] border border-[#273647] p-1.5 rounded-full shadow-2xl backdrop-blur-md">
          <button
            onClick={() => setIsMobilePreview(false)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              !isMobilePreview
                ? 'bg-[#7bd0ff] text-[#00354a] shadow-sm'
                : 'text-[#c6c6cd] hover:text-[#d4e4fa]'
            }`}
          >
            <span className="material-symbols-outlined text-base">desktop_windows</span>
            <span>데스크톱 뷰 (Image 1)</span>
          </button>
          <button
            onClick={() => {
              setIsMobilePreview(true);
              if (activeTab === 'dashboard') setActiveTab('home');
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              isMobilePreview
                ? 'bg-[#7bd0ff] text-[#00354a] shadow-sm'
                : 'text-[#c6c6cd] hover:text-[#d4e4fa]'
            }`}
          >
            <span className="material-symbols-outlined text-base">smartphone</span>
            <span>모바일 뷰 (Images 3, 5, 7, 9)</span>
          </button>
        </div>
      )}

      {/* Render Desktop Dashboard View */}
      {!showMobileView && (
        <DesktopDashboard
          currentDb={currentDb}
          minDb={minDb}
          maxDb={maxDb}
          places={places}
          activePlace={activePlace}
          onSelectPlace={setActivePlace}
          onOpenAddPlace={() => setIsAddPlaceOpen(true)}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onOpenHelpDocs={() => setIsHelpDocsOpen(true)}
          unreadCount={notifications.length}
          timerMinutes={timerMinutes}
          timerSeconds={timerSeconds}
          isTimerRunning={isTimerRunning}
          timerMode={timerMode}
          currentSession={currentSession}
          totalSessions={totalSessions}
          onToggleTimer={() => setIsTimerRunning(!isTimerRunning)}
          onResetTimer={handleResetTimer}
          onSkipTimer={handleSkipTimer}
          currentSoundName={currentSoundPreset.name}
          isSoundPlaying={isSoundPlaying}
          soundVolume={soundVolume}
          onToggleSound={() => handleToggleSound()}
          onChangeVolume={handleChangeVolume}
          micCalibration={micCalibration}
          isRealMic={isRealMic}
          onToggleRealMic={handleToggleRealMic}
          activeTab={activeTab}
          onChangeTab={(tab) => {
            if (tab === 'library') {
              setActiveTab('settings');
            } else {
              setActiveTab(tab as unknown as 'dashboard');
            }
          }}
          sessionRecords={sessionRecords}
          onExportLogs={handleExportLogs}
          noiseThreshold={noiseThreshold}
          isMobilePreview={isMobilePreview}
          onToggleViewMode={() => {
            setIsMobilePreview(true);
            setActiveTab('home');
          }}
          onOpenCafeStory={() => setIsCafeModalOpen(true)}
        />
      )}

      {/* Render Mobile Phone Layout */}
      {showMobileView && (
        <div className="py-4 md:py-8 flex justify-center bg-[#010f1f]/60 min-h-screen">
          {activeTab === 'home' || activeTab === 'dashboard' ? (
            <MobileHome
              currentDb={currentDb}
              places={places}
              activePlace={activePlace}
              onSelectPlace={setActivePlace}
              onOpenAddPlace={() => setIsAddPlaceOpen(true)}
              onOpenNotifications={() => setIsNotificationsOpen(true)}
              unreadCount={notifications.length}
              isRealMic={isRealMic}
              onToggleRealMic={handleToggleRealMic}
              onStartFocus={() => {
                setActiveTab('focus');
                setIsTimerRunning(true);
              }}
              isWhiteNoiseEnabled={isSoundPlaying}
              onToggleWhiteNoise={() => handleToggleSound()}
              activeTab={activeTab}
              onChangeTab={(tab) => setActiveTab(tab as unknown as 'home')}
              onOpenCafeStory={() => setIsCafeModalOpen(true)}
            />
          ) : activeTab === 'focus' ? (
            <MobileFocus
              currentDb={currentDb}
              activePlace={activePlace}
              timerMinutes={timerMinutes}
              timerSeconds={timerSeconds}
              isTimerRunning={isTimerRunning}
              currentSession={currentSession}
              totalSessions={totalSessions}
              onToggleTimer={() => setIsTimerRunning(!isTimerRunning)}
              onResetTimer={handleResetTimer}
              onSkipTimer={handleSkipTimer}
              currentSoundName={currentSoundPreset.name}
              isSoundPlaying={isSoundPlaying}
              soundVolume={soundVolume}
              onToggleWhiteNoise={() => handleToggleSound()}
              noiseThreshold={noiseThreshold}
              onOpenNotifications={() => setIsNotificationsOpen(true)}
              unreadCount={notifications.length}
              activeTab={activeTab}
              onChangeTab={(tab) => setActiveTab(tab as unknown as 'focus')}
            />
          ) : activeTab === 'analytics' ? (
            <MobileStats
              onOpenNotifications={() => setIsNotificationsOpen(true)}
              unreadCount={notifications.length}
              activeTab={activeTab}
              onChangeTab={(tab) => setActiveTab(tab as unknown as 'analytics')}
              dailyLogs={dailyLogs}
              onExportLogs={handleExportLogs}
              onOpenCafeStory={() => setIsCafeModalOpen(true)}
            />
          ) : (
            <MobileSettings
              noiseThreshold={noiseThreshold}
              onChangeNoiseThreshold={setNoiseThreshold}
              vibrateAlert={vibrateAlert}
              onToggleVibrate={() => setVibrateAlert(!vibrateAlert)}
              autoWhiteNoise={autoWhiteNoise}
              onToggleAutoWhiteNoise={() => setAutoWhiteNoise(!autoWhiteNoise)}
              selectedSound={selectedSound}
              onSelectSound={handleSelectSound}
              soundVolume={soundVolume}
              onChangeVolume={handleChangeVolume}
              micCalibration={micCalibration}
              onAdjustCalibration={handleAdjustCalibration}
              onOpenNotifications={() => setIsNotificationsOpen(true)}
              unreadCount={notifications.length}
              activeTab={activeTab}
              onChangeTab={(tab) => setActiveTab(tab as unknown as 'settings')}
            />
          )}
        </div>
      )}

      {/* Modals */}
      <AddPlaceModal
        isOpen={isAddPlaceOpen}
        onClose={() => setIsAddPlaceOpen(false)}
        onAddPlace={(newPlace) => {
          setPlaces((prev) => [...prev, newPlace]);
          setActivePlace(newPlace);
        }}
      />

      <NotificationModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onClear={() => setNotifications([])}
      />

      <HelpDocsModal
        isOpen={isHelpDocsOpen}
        onClose={() => setIsHelpDocsOpen(false)}
      />

      {/* Student Cafe Story Modal (I can't focus anymore) */}
      <CafeCaseStudyModal
        isOpen={isCafeModalOpen}
        onClose={() => setIsCafeModalOpen(false)}
        onApplyCafeMode={handleApplyCafeMode}
        onEnableMasking={handleEnableMasking}
      />
    </div>
  );
}
