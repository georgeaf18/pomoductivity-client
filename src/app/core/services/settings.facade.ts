import { Injectable, inject, OnDestroy } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { tap, takeUntil, catchError } from 'rxjs/operators';

import { TimerSettings } from '@core/models/timer.models';
import { SettingsApiService } from './settings-api.service';
import { SettingsStateService } from '@core/state/settings.state';

@Injectable({
  providedIn: 'root',
})
export class SettingsFacade implements OnDestroy {
  private readonly settingsApi = inject(SettingsApiService);
  private readonly settingsState = inject(SettingsStateService);
  private readonly destroy$ = new Subject<void>();

  public readonly settings$: Observable<TimerSettings> = this.settingsState.getState();

  constructor() {
    this.loadSettings();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadSettings(): void {
    this.settingsApi
      .getSettings()
      .pipe(
        tap((settings) => this.settingsState.setState(settings)),
        catchError((error) => {
          console.error('Failed to load settings:', error);
          return of(null);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  public updateSettings(settings: Partial<TimerSettings>): Observable<boolean> {
    return new Observable((observer) => {
      this.settingsApi
        .updateSettings(settings)
        .pipe(
          tap((response) => {
            if (response.success) {
              this.settingsState.setState(response.settings);
              observer.next(true);
            } else {
              observer.next(false);
            }
            observer.complete();
          }),
          catchError((error) => {
            console.error('Failed to update settings:', error);
            observer.next(false);
            observer.complete();
            return of(null);
          }),
          takeUntil(this.destroy$)
        )
        .subscribe();
    });
  }

  public resetSettings(): void {
    this.settingsApi
      .resetSettings()
      .pipe(
        tap((response) => {
          if (response.success) {
            this.settingsState.setState(response.settings);
          }
        }),
        catchError((error) => {
          console.error('Failed to reset settings:', error);
          return of(null);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  public get currentSettings(): TimerSettings {
    return this.settingsState.getCurrentState();
  }
}
