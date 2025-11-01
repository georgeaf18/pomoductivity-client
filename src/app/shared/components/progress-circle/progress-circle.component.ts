import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-progress-circle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-circle.component.html',
  styleUrls: ['./progress-circle.component.scss'],
})
export class ProgressCircleComponent implements OnChanges {
  @Input() public progress = 0; // 0-100
  @Input() public size = 300;
  @Input() public strokeWidth = 12;
  @Input() public color = '#6366f1';

  public radius = 0;
  public circumference = 0;
  public strokeDashoffset = 0;

  public ngOnChanges(): void {
    this.radius = (this.size - this.strokeWidth) / 2;
    this.circumference = 2 * Math.PI * this.radius;
    this.strokeDashoffset = this.circumference - (this.progress / 100) * this.circumference;
  }

  public get viewBox(): string {
    return `0 0 ${this.size} ${this.size}`;
  }

  public get center(): number {
    return this.size / 2;
  }
}
