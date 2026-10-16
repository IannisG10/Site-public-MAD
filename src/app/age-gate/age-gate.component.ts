import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AgeGateService } from './age-gate.service';

@Component({
  selector: 'app-age-gate',
  standalone: true,
  templateUrl: './age-gate.component.html',
  styleUrl: './age-gate.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgeGateComponent {
  private readonly gate = inject(AgeGateService);

  readonly status = this.gate.status;
  readonly minAge = this.gate.minAge;

  /** Liste des années proposées, de l'année courante jusqu'à 100 ans en arrière. */
  readonly years: number[];

  readonly selectedYear = signal<number | null>(null);

  constructor() {
    const current = new Date().getFullYear();
    const years: number[] = [];
    for (let y = current; y >= current - 100; y--) {
      years.push(y);
    }
    this.years = years;
  }

  onSelect(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedYear.set(value ? Number(value) : null);
  }

  /** « J'ai plus de 18 ans » : exige une année, puis valide l'âge réel. */
  over18(): void {
    const year = this.selectedYear();
    if (year === null) {
      return;
    }
    this.gate.confirmBirthYear(year);
  }

  under18(): void {
    this.gate.declineMinor();
  }

  retry(): void {
    this.selectedYear.set(null);
    this.gate.reset();
  }
}
