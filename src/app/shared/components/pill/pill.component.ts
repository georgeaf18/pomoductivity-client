import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

import { SessionType } from '@core/models/timer.models';

@Component({
  selector: 'app-pill',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pill.component.html',
  styleUrls: ['./pill.component.scss'],
})
export class PillComponent {
  @Input() public type!: SessionType;
  @Input() public active = false;
  @Input() public disabled = false;
  @Output() public readonly selected = new EventEmitter<SessionType>();

  public onClick(): void {
    if (!this.disabled) {
      this.selected.emit(this.type);
    }
  }

  public get label(): string {
    const labels: Record<SessionType, string> = {
      focus: 'Focus',
      short_break: 'Short Break',
      long_break: 'Long Break',
    };
    return labels[this.type];
  }

  public get pillClasses(): string {
    const baseClasses =
      'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer';
    const activeClasses = this.active
      ? 'bg-primary-500 text-white shadow-md'
      : 'bg-gray-200 text-gray-700 hover:bg-gray-300';
    const disabledClasses = this.disabled ? 'opacity-50 cursor-not-allowed' : '';

    return `${baseClasses} ${activeClasses} ${disabledClasses}`;
  }
}
