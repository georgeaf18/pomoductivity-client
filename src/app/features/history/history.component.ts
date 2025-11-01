import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SessionHistoryEntry, SessionType } from '@core/models/timer.models';
import { TimerApiService } from '@core/services/timer-api.service';

interface HistoryStats {
  totalSessions: number;
  focusSessions: number;
  shortBreaks: number;
  longBreaks: number;
  totalFocusTime: number;
}

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  private readonly timerApi = inject(TimerApiService);

  public history$!: Observable<SessionHistoryEntry[]>;
  public stats$!: Observable<HistoryStats>;

  public ngOnInit(): void {
    this.history$ = this.timerApi.getHistory();
    this.stats$ = this.history$.pipe(map((history) => this.calculateStats(history)));
  }

  private calculateStats(history: SessionHistoryEntry[]): HistoryStats {
    return {
      totalSessions: history.length,
      focusSessions: history.filter((s) => s.type === 'focus').length,
      shortBreaks: history.filter((s) => s.type === 'short_break').length,
      longBreaks: history.filter((s) => s.type === 'long_break').length,
      totalFocusTime: history
        .filter((s) => s.type === 'focus')
        .reduce((sum, s) => sum + s.duration, 0),
    };
  }

  public formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  }

  public formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  public formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  public getSessionTypeLabel(type: SessionType): string {
    const labels: Record<SessionType, string> = {
      focus: 'Focus',
      short_break: 'Short Break',
      long_break: 'Long Break',
    };
    return labels[type];
  }

  public getSessionTypeColor(type: SessionType): string {
    const colors: Record<SessionType, string> = {
      focus: 'bg-primary-100 text-primary-700',
      short_break: 'bg-success-100 text-success-700',
      long_break: 'bg-warning-100 text-warning-700',
    };
    return colors[type];
  }

  public trackByIndex(index: number): number {
    return index;
  }
}
