import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';

interface Feature {
  label: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  tagline: string;
  /** prix mensuel de référence en euros (0 = gratuit) */
  monthly: number;
  features: Feature[];
  recommended: boolean;
}

type Billing = 'mensuel' | 'annuel';

@Component({
  selector: 'app-forfait',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './forfait.component.html',
  styleUrl: './forfait.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForfaitComponent {
  // ===== Forfait actuel (cohérent avec le profil : Premium) =====
  readonly currentPlanId = 'premium';
  readonly renewal = '14 novembre 2026';

  // ===== Facturation : mensuelle / annuelle (-20 %) =====
  readonly billing = signal<Billing>('mensuel');
  readonly annualDiscount = 0.2;
  setBilling(b: Billing): void {
    this.billing.set(b);
  }

  readonly plans: Plan[] = [
    {
      id: 'decouverte',
      name: 'Découverte',
      tagline: 'Pour commencer et explorer la communauté.',
      monthly: 0,
      recommended: false,
      features: [
        { label: 'Créer son profil', included: true },
        { label: 'Parcourir les membres', included: true },
        { label: 'Recevoir des messages', included: true },
        { label: 'Envoyer des messages', included: false },
        { label: 'Voir qui a visité son profil', included: false },
        { label: 'Badge et mise en avant', included: false },
      ],
    },
    {
      id: 'essentiel',
      name: 'Essentiel',
      tagline: 'Pour échanger librement avec les membres.',
      monthly: 14.9,
      recommended: false,
      features: [
        { label: 'Créer son profil', included: true },
        { label: 'Parcourir les membres', included: true },
        { label: 'Recevoir des messages', included: true },
        { label: 'Envoyer des messages', included: true },
        { label: 'Voir qui a visité son profil', included: false },
        { label: 'Badge et mise en avant', included: false },
      ],
    },
    {
      id: 'premium',
      name: 'Premium',
      tagline: 'L\'expérience complète, sans limites.',
      monthly: 24.9,
      recommended: true,
      features: [
        { label: 'Créer son profil', included: true },
        { label: 'Parcourir les membres', included: true },
        { label: 'Recevoir des messages', included: true },
        { label: 'Envoyer des messages', included: true },
        { label: 'Voir qui a visité son profil', included: true },
        { label: 'Badge et mise en avant', included: true },
      ],
    },
  ];

  readonly currentPlan = computed(() => this.plans.find((p) => p.id === this.currentPlanId) ?? null);

  /** Prix mensuel affiché selon la facturation choisie (annuel = -20 %). */
  priceFor(plan: Plan): string {
    if (plan.monthly === 0) {
      return 'Gratuit';
    }
    const m = this.billing() === 'annuel' ? plan.monthly * (1 - this.annualDiscount) : plan.monthly;
    return m.toFixed(2).replace('.', ',') + ' €';
  }

  /** Total facturé annuellement, pour le libellé sous le prix. */
  annualTotal(plan: Plan): string {
    const total = plan.monthly * (1 - this.annualDiscount) * 12;
    return Math.round(total) + ' € / an';
  }

  isCurrent(plan: Plan): boolean {
    return plan.id === this.currentPlanId;
  }
}
