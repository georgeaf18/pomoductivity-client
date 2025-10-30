import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary' | 'icon';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() public variant: ButtonVariant = 'primary';
  @Input() public size: ButtonSize = 'md';
  @Input() public disabled = false;
  @Input() public ariaLabel?: string;
  @Output() public readonly clicked = new EventEmitter<void>();

  public onClick(): void {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }

  public get buttonClasses(): string {
    const baseClasses = 'btn transition-all duration-200 focus:outline-none';
    const variantClasses = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      icon: 'btn-icon',
    };
    const sizeClasses = {
      sm: 'text-sm px-4 py-2',
      md: 'text-base px-6 py-3',
      lg: 'text-lg px-8 py-4',
    };

    return `${baseClasses} ${variantClasses[this.variant]} ${
      this.variant !== 'icon' ? sizeClasses[this.size] : ''
    }`;
  }
}
