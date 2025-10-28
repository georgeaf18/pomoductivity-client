import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TimerFacade } from '@core/services/timer.facade';
import { TimerState, SessionType } from '@core/models/timer.models';
import { TimeFormatPipe } from '@shared/pipes/time-format.pipe';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [CommonModule, TimeFormatPipe],
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit, OnDestroy {
  private readonly timerFacade = inject(TimerFacade);
  private readonly destroy$ = new Subject<void>();

  public state: TimerState = {
    isRunning: false,
    timeRemaining: 1500,
    sessionType: 'focus',
    sessionCount: 0,
    startTime: null,
    history: [],
  };
  public loading = true;
  public sessionTypes: SessionType[] = ['focus', 'short_break', 'long_break'];

  public ngOnInit(): void {
    this.timerFacade.state$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (state) => {
        this.state = state;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading timer state:', error);
        this.loading = false;
      },
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public onToggle(): void {
    this.timerFacade.toggle();
  }

  public onReset(): void {
    this.timerFacade.reset();
  }

  public onTypeChange(type: SessionType): void {
    this.timerFacade.setType(type);
  }

  public getSessionLabel(type: SessionType): string {
    const labels: Record<SessionType, string> = {
      focus: 'Focus',
      short_break: 'Short Break',
      long_break: 'Long Break',
    };
    return labels[type];
  }
}
