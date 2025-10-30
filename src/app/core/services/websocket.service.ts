import { Injectable } from '@angular/core';
import { Observable, Subject, timer } from 'rxjs';
import { retry, share, takeUntil } from 'rxjs/operators';

import { TimerState } from '@core/models/timer.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private readonly wsUrl = environment.wsUrl;
  private socket: WebSocket | null = null;
  private readonly messages$ = new Subject<TimerState>();
  private readonly destroy$ = new Subject<void>();

  public connect(): Observable<TimerState> {
    if (this.socket) {
      return this.messages$.asObservable();
    }

    this.socket = new WebSocket(this.wsUrl);

    this.socket.onmessage = (event: MessageEvent): void => {
      try {
        const data = JSON.parse(event.data) as TimerState;
        this.messages$.next(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.socket.onerror = (error: Event): void => {
      console.error('WebSocket error:', error);
    };

    this.socket.onclose = (): void => {
      this.socket = null;
      // Attempt to reconnect after 3 seconds
      timer(3000)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => this.connect());
    };

    return this.messages$.asObservable().pipe(
      retry({ count: 3, delay: 3000 }),
      share(),
      takeUntil(this.destroy$)
    );
  }

  public disconnect(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}
