import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { TimerState, SessionType } from '@core/models/timer.models';

const INITIAL_STATE: TimerState = {
  isRunning: false,
  timeRemaining: 1500,
  sessionType: 'focus',
  sessionCount: 0,
  startTime: null,
  history: [],
};

@Injectable({
  providedIn: 'root',
})
export class TimerStateService {
  private readonly state$ = new BehaviorSubject<TimerState>(INITIAL_STATE);

  public getState(): Observable<TimerState> {
    return this.state$.asObservable();
  }

  public getCurrentState(): TimerState {
    return this.state$.value;
  }

  public setState(state: TimerState): void {
    this.state$.next(state);
  }

  public updateState(partial: Partial<TimerState>): void {
    this.state$.next({ ...this.state$.value, ...partial });
  }

  public resetState(): void {
    this.state$.next(INITIAL_STATE);
  }

  public get isRunning(): boolean {
    return this.state$.value.isRunning;
  }

  public get timeRemaining(): number {
    return this.state$.value.timeRemaining;
  }

  public get sessionType(): SessionType {
    return this.state$.value.sessionType;
  }

  public get sessionCount(): number {
    return this.state$.value.sessionCount;
  }
}
