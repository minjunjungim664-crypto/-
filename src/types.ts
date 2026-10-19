export interface StudyPlace {
  id: string;
  name: string;
  targetDb: number;
  statusText: string;
  isCustom?: boolean;
}

export interface SessionRecord {
  id: string;
  sessionNumber: number;
  timeRange: string;
  placeName: string;
  avgDb: number;
  durationMinutes: number;
  dateStr: string;
}

export interface DailyFocusLog {
  id: string;
  label: string; // e.g. "오늘", "어제", "화"
  dateFormatted: string; // e.g. "10월 24일 (목)"
  pomodoroCount: number;
  avgDb: number;
  totalTimeStr: string; // "4시간 15분"
  targetPercentage: number; // 106
}

export interface AppSettings {
  noiseThreshold: number; // default 50 or 65
  vibrateAlert: boolean;
  autoWhiteNoise: boolean;
  selectedSound: 'rain' | 'cafe' | 'waves' | 'library' | 'campfire';
  soundVolume: number; // 0..100
  micCalibration: number; // e.g. +2.0 dB
  activePlaceId: string;
}
