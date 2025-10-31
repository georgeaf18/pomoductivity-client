import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ToastComponent } from '@shared/components/toast/toast.component';
import { TimerFacade } from '@core/services/timer.facade';
import { TimerState, SessionType } from '@core/models/timer.models';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  private readonly timerFacade = inject(TimerFacade);
  private readonly destroy$ = new Subject<void>();

  public title = 'Pomoductivity';
  public timerState: TimerState | null = null;

  public ngOnInit(): void {
    this.timerFacade.state$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (state) => {
        this.timerState = state;
      },
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public getBackgroundClass(): string {
    if (!this.timerState || !this.timerState.isRunning) {
      return 'bg-inactive';
    }

    switch (this.timerState.sessionType) {
      case 'focus':
        return 'bg-work';
      case 'short_break':
        return 'bg-short-break';
      case 'long_break':
        return 'bg-long-break';
      default:
        return 'bg-inactive';
    }
  }
}
