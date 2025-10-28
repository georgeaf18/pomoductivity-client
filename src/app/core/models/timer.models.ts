export type SessionType = 'focus' | 'short_break' | 'long_break';

export type SessionStatus = 'completed' | 'cancelled';

export interface TimerState {
  isRunning: boolean;
  timeRemaining: number;
  sessionType: SessionType;
  sessionCount: number;
  startTime: string | null;
  history: SessionHistoryEntry[];
}

export interface SessionHistoryEntry {
  type: SessionType;
  startTime: string;
  endTime: string;
  duration: number;
  status: SessionStatus;
}

export interface TimerSettings {
  focusDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
}

export interface TimerResponse {
  success: boolean;
  state: TimerState;
}

export interface SettingsResponse {
  success: boolean;
  settings: TimerSettings;
}
