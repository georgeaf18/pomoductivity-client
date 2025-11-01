import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { ToastService, Toast } from '@core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  private readonly toastService = inject(ToastService);

  public toasts$: Observable<Toast[]> = this.toastService.getToasts();

  public close(id: number): void {
    this.toastService.removeToast(id);
  }

  public getAlertClass(type: string): string {
    const classes: Record<string, string> = {
      success: 'alert-success',
      error: 'alert-danger',
      info: 'alert-info',
    };
    return classes[type] || 'alert-info';
  }
}
