import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { TimerSettings } from '@core/models/timer.models';

const DEFAULT_SETTINGS: TimerSettings = {
  focusDuration: 1500,
  shortBreakDuration: 300,
  longBreakDuration: 900,
};

@Injectable({
  providedIn: 'root',
})
export class SettingsStateService {
  private readonly state$ = new BehaviorSubject<TimerSettings>(DEFAULT_SETTINGS);

  public getState(): Observable<TimerSettings> {
    return this.state$.asObservable();
  }

  public getCurrentState(): TimerSettings {
    return this.state$.value;
  }

  public setState(settings: TimerSettings): void {
    this.state$.next(settings);
  }

  public updateState(partial: Partial<TimerSettings>): void {
    this.state$.next({ ...this.state$.value, ...partial });
  }

  public resetState(): void {
    this.state$.next(DEFAULT_SETTINGS);
  }
}
