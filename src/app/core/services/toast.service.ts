import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
  id: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly toasts$ = new BehaviorSubject<Toast[]>([]);
  private idCounter = 0;

  public getToasts(): Observable<Toast[]> {
    return this.toasts$.asObservable();
  }

  public showError(message: string): void {
    this.addToast(message, 'error');
  }

  public showSuccess(message: string): void {
    this.addToast(message, 'success');
  }

  public showInfo(message: string): void {
    this.addToast(message, 'info');
  }

  private addToast(message: string, type: Toast['type']): void {
    const id = this.idCounter++;
    const toast: Toast = { message, type, id };
    const current = this.toasts$.value;
    this.toasts$.next([...current, toast]);

    // Auto remove after 5 seconds
    setTimeout(() => this.removeToast(id), 5000);
  }

  public removeToast(id: number): void {
    const current = this.toasts$.value;
    this.toasts$.next(current.filter((t) => t.id !== id));
  }
}
