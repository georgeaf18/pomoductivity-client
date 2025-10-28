import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { TimerSettings, SettingsResponse } from '@core/models/timer.models';

@Injectable({
  providedIn: 'root',
})
export class SettingsApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api';

  public getSettings(): Observable<TimerSettings> {
    return this.http.get<TimerSettings>(`${this.baseUrl}/settings`);
  }

  public updateSettings(settings: Partial<TimerSettings>): Observable<SettingsResponse> {
    return this.http.put<SettingsResponse>(`${this.baseUrl}/settings`, settings);
  }

  public resetSettings(): Observable<SettingsResponse> {
    return this.http.post<SettingsResponse>(`${this.baseUrl}/settings/reset`, {});
  }
}
