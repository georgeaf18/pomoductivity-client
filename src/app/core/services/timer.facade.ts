import { Injectable, inject, OnDestroy } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { TimerState, SessionType } from '@core/models/timer.models';
import { TimerApiService } from './timer-api.service';
import { WebSocketService } from './websocket.service';
import { TimerStateService } from '@core/state/timer.state';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class TimerFacade implements OnDestroy {
  private readonly timerApi = inject(TimerApiService);
  private readonly wsService = inject(WebSocketService);
  private readonly timerState = inject(TimerStateService);
  private readonly toastService = inject(ToastService);
  private readonly destroy$ = new Subject<void>();

  public readonly state$: Observable<TimerState> = this.timerState.getState();

  constructor() {
    this.initializeTimer();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.wsService.disconnect();
  }

  private initializeTimer(): void {
    // Get initial state
    this.timerApi
      .getStatus()
      .pipe(
        tap((state) => this.timerState.setState(state)),
        catchError((error) => {
          console.error('Failed to load initial timer state:', error);
          return of(null);
        })
      )
      .subscribe();

    // Connect to WebSocket for real-time updates
    this.wsService
      .connect()
      .pipe(tap((state) => this.timerState.setState(state)))
      .subscribe();
  }

  public start(): void {
    this.timerApi
      .start()
      .pipe(
        tap((response) => {
          if (response) {
            this.timerState.setState(response.state);
          }
        }),
        catchError((error) => {
          this.toastService.showError('Failed to start timer. Please try again.');
          console.error('Failed to start timer:', error);
          return of(null);
        })
      )
      .subscribe();
  }

  public stop(): void {
    this.timerApi
      .stop()
      .pipe(
        tap((response) => {
          if (response) {
            this.timerState.setState(response.state);
          }
        }),
        catchError((error) => {
          this.toastService.showError('Failed to stop timer. Please try again.');
          console.error('Failed to stop timer:', error);
          return of(null);
        })
      )
      .subscribe();
  }

  public toggle(): void {
    this.timerApi
      .toggle()
      .pipe(
        tap((response) => {
          if (response) {
            this.timerState.setState(response.state);
          }
        }),
        catchError((error) => {
          this.toastService.showError('Failed to toggle timer. Please try again.');
          console.error('Failed to toggle timer:', error);
          return of(null);
        })
      )
      .subscribe();
  }

  public reset(): void {
    this.timerApi
      .reset()
      .pipe(
        tap((response) => {
          if (response) {
            this.timerState.setState(response.state);
          }
        }),
        catchError((error) => {
          this.toastService.showError('Failed to reset timer. Please try again.');
          console.error('Failed to reset timer:', error);
          return of(null);
        })
      )
      .subscribe();
  }

  public setType(type: SessionType): void {
    this.timerApi
      .setType(type)
      .pipe(
        tap((response) => {
          if (response) {
            this.timerState.setState(response.state);
          }
        }),
        catchError((error) => {
          this.toastService.showError('Failed to change session type. Please try again.');
          console.error('Failed to set session type:', error);
          return of(null);
        })
      )
      .subscribe();
  }

  public get currentState(): TimerState {
    return this.timerState.getCurrentState();
  }

  public get isRunning(): boolean {
    return this.timerState.isRunning;
  }

  public get timeRemaining(): number {
    return this.timerState.timeRemaining;
  }

  public get sessionType(): SessionType {
    return this.timerState.sessionType;
  }
}
