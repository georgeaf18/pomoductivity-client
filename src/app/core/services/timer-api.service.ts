import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  TimerState,
  TimerResponse,
  SessionType,
  SessionHistoryEntry,
} from '@core/models/timer.models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TimerApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  public getStatus(): Observable<TimerState> {
    return this.http.get<TimerState>(`${this.baseUrl}/timer/status`);
  }

  public start(): Observable<TimerResponse> {
    return this.http.post<TimerResponse>(`${this.baseUrl}/timer/start`, {});
  }

  public stop(): Observable<TimerResponse> {
    return this.http.post<TimerResponse>(`${this.baseUrl}/timer/stop`, {});
  }

  public toggle(): Observable<TimerResponse> {
    return this.http.post<TimerResponse>(`${this.baseUrl}/timer/start-stop`, {});
  }

  public reset(): Observable<TimerResponse> {
    return this.http.post<TimerResponse>(`${this.baseUrl}/timer/reset`, {});
  }

  public setType(type: SessionType): Observable<TimerResponse> {
    return this.http.post<TimerResponse>(`${this.baseUrl}/timer/set-type`, { type });
  }

  public getHistory(): Observable<SessionHistoryEntry[]> {
    return this.http.get<SessionHistoryEntry[]>(`${this.baseUrl}/timer/history`);
  }
}
