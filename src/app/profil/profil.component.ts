import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

interface CompletionItem {
  label: string;
  done: boolean;
}

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [DecimalPipe, LucideAngularModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilComponent {
  // ===== Identité (données de démonstration, front seul) =====
  readonly pseudo = 'IANNIS_G';
  readonly sex: 'm' | 'f' = 'm';
  readonly age = 29;
  readonly city = 'Lyon';
  readonly dept = '69';
  readonly memberSince = 'octobre 2026';
  readonly subscriber = true;
  readonly plan = 'Premium';
  readonly tagline = 'Curieux, bon vivant — ici pour de vraies rencontres.';
  readonly bio =
    "Lyonnais, passionné de cuisine et de voyages. J'aime les soirées simples " +
    "comme les escapades improvisées. Je privilégie l'échange et la sincérité " +
    'avant tout. N\'hésitez pas à me laisser un mot.';

  // ===== Statut en ligne (interrupteur) =====
  readonly online = signal(true);
  toggleOnline(): void {
    this.online.update((v) => !v);
  }

  // ===== Statistiques =====
  readonly stats = {
    views: 1284,
    contacts: 37,
    favorites: 58,
  };

  // ===== Ce que je recherche / centres d'intérêt =====
  readonly lookingFor = ['Une femme', '25 – 40 ans', 'Autour de Lyon (69)'];
  readonly interests = ['Sorties', 'Voyages', 'Cuisine', 'Cinéma', 'Randonnée'];

  // ===== Photos (placeholders : la 1re est la photo principale) =====
  readonly photos = [1, 2, 3, 4];

  // ===== Complétude du profil (progressive disclosure) =====
  readonly completionItems: CompletionItem[] = [
    { label: 'Photo de profil', done: true },
    { label: 'Description', done: true },
    { label: 'Ce que je recherche', done: true },
    { label: 'Centres d’intérêt', done: true },
    { label: 'Vérification de l’e-mail', done: false },
    { label: 'Ajouter 2 photos de plus', done: false },
  ];
  readonly completion = computed(() => {
    const done = this.completionItems.filter((i) => i.done).length;
    return Math.round((done / this.completionItems.length) * 100);
  });
  readonly nextStep = computed(() => this.completionItems.find((i) => !i.done)?.label ?? null);

  initials(pseudo: string): string {
    const words = pseudo.trim().split(/[\s_]+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return pseudo.slice(0, 2).toUpperCase();
  }
}
