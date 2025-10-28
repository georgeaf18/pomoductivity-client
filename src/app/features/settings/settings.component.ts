import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SettingsFacade } from '@core/services/settings.facade';
import { TimerSettings } from '@core/models/timer.models';
import { ButtonComponent } from '@shared/components/button/button.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy {
  private readonly settingsFacade = inject(SettingsFacade);
  private readonly destroy$ = new Subject<void>();

  public settings$!: Observable<TimerSettings>;
  public localSettings: TimerSettings = {
    focusDuration: 1500,
    shortBreakDuration: 300,
    longBreakDuration: 900,
  };
  public saveSuccess = false;
  public saveError = false;

  public ngOnInit(): void {
    this.settings$ = this.settingsFacade.settings$.pipe(takeUntil(this.destroy$));

    this.settings$.subscribe((settings) => {
      this.localSettings = { ...settings };
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onSave(): void {
    this.saveSuccess = false;
    this.saveError = false;

    this.settingsFacade
      .updateSettings(this.localSettings)
      .pipe(takeUntil(this.destroy$))
      .subscribe((success) => {
        if (success) {
          this.saveSuccess = true;
          setTimeout(() => (this.saveSuccess = false), 3000);
        } else {
          this.saveError = true;
          setTimeout(() => (this.saveError = false), 3000);
        }
      });
  }

  public onReset(): void {
    this.settingsFacade.resetSettings();
    this.saveSuccess = false;
    this.saveError = false;
  }

  public secondsToMinutes(seconds: number): number {
    return Math.floor(seconds / 60);
  }

  public minutesToSeconds(minutes: number): number {
    return minutes * 60;
  }

  public onFocusChange(minutes: number): void {
    this.localSettings.focusDuration = this.minutesToSeconds(minutes);
  }

  public onShortBreakChange(minutes: number): void {
    this.localSettings.shortBreakDuration = this.minutesToSeconds(minutes);
  }

  public onLongBreakChange(minutes: number): void {
    this.localSettings.longBreakDuration = this.minutesToSeconds(minutes);
  }
}
