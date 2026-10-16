import { ChangeDetectionStrategy, Component, computed, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

interface ResultMember {
  pseudo: string;
  sex: 'm' | 'f';
  age: number;
  city: string;
  dept: string;
  online: boolean;
  hasPhoto: boolean;
  /** horodatage relatif d'arrivée, pour le tri « récents » (plus grand = plus récent) */
  joined: number;
}

type Sexe = 'all' | 'm' | 'f';
type Tri = 'recent' | 'online' | 'age';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent {
  // ===== Panneau de filtres : ouvert/replié =====
  readonly filtersOpen = signal(true);
  toggleFilters(): void {
    this.filtersOpen.update((v) => !v);
  }

  // ===== État des filtres (signaux) =====
  readonly sexe = signal<Sexe>('all');
  readonly ageMin = signal(18);
  readonly ageMax = signal(75);
  readonly zone = signal('France');
  readonly city = signal('');
  readonly withPhoto = signal(false);
  readonly onlineOnly = signal(false);
  readonly tri = signal<Tri>('recent');

  readonly sexeOptions: { value: Sexe; label: string }[] = [
    { value: 'all', label: 'Peu importe' },
    { value: 'f', label: 'Une femme' },
    { value: 'm', label: 'Un homme' },
  ];
  readonly zoneOptions = ['France', 'Belgique', 'Suisse', 'Luxembourg', 'Canada'];
  readonly triOptions: { value: Tri; label: string }[] = [
    { value: 'recent', label: 'Arrivée récente' },
    { value: 'online', label: 'En ligne d’abord' },
    { value: 'age', label: 'Âge croissant' },
  ];

  setSexe(v: Sexe): void {
    this.sexe.set(v);
  }
  setZone(v: string): void {
    this.zone.set(v);
  }
  setTri(v: Tri): void {
    this.tri.set(v);
  }
  onNumber(sig: WritableSignal<number>, event: Event): void {
    const n = Number((event.target as HTMLInputElement).value);
    if (!Number.isNaN(n)) {
      sig.set(n);
    }
  }
  resetFilters(): void {
    this.sexe.set('all');
    this.ageMin.set(18);
    this.ageMax.set(75);
    this.zone.set('France');
    this.city.set('');
    this.withPhoto.set(false);
    this.onlineOnly.set(false);
  }

  // ===== Jeu de membres (données de démonstration, front seul) =====
  private readonly members: ResultMember[] = [
    { pseudo: 'KLODALI', sex: 'f', age: 29, city: 'Lyon', dept: '69', online: true, hasPhoto: true, joined: 24 },
    { pseudo: 'NEWFRANCK', sex: 'm', age: 34, city: 'Villeurbanne', dept: '69', online: true, hasPhoto: true, joined: 23 },
    { pseudo: 'OBEDIA', sex: 'f', age: 41, city: 'Marseille', dept: '13', online: false, hasPhoto: true, joined: 22 },
    { pseudo: 'DRASTIK', sex: 'm', age: 38, city: 'Valence', dept: '26', online: true, hasPhoto: false, joined: 21 },
    { pseudo: 'CARLA29', sex: 'f', age: 27, city: 'Quimper', dept: '29', online: false, hasPhoto: true, joined: 20 },
    { pseudo: 'ABSOLUTEVA', sex: 'm', age: 45, city: 'Nice', dept: '06', online: true, hasPhoto: false, joined: 19 },
    { pseudo: 'GODDESS JUN', sex: 'f', age: 33, city: 'Annecy', dept: '74', online: true, hasPhoto: true, joined: 18 },
    { pseudo: 'INTELLECT13', sex: 'm', age: 52, city: 'Aix-en-Provence', dept: '13', online: false, hasPhoto: true, joined: 17 },
    { pseudo: 'DEBORAHH', sex: 'f', age: 24, city: 'Lille', dept: '59', online: true, hasPhoto: true, joined: 16 },
    { pseudo: 'CONDOR78', sex: 'm', age: 47, city: 'Versailles', dept: '78', online: false, hasPhoto: false, joined: 15 },
    { pseudo: 'TINAGIRLY', sex: 'f', age: 31, city: 'Toulouse', dept: '31', online: true, hasPhoto: true, joined: 14 },
    { pseudo: 'BALY63', sex: 'm', age: 36, city: 'Clermont-Ferrand', dept: '63', online: false, hasPhoto: false, joined: 13 },
    { pseudo: 'LADY SYA', sex: 'f', age: 39, city: 'Nantes', dept: '44', online: true, hasPhoto: true, joined: 12 },
    { pseudo: 'HERBERTO', sex: 'm', age: 43, city: 'Évreux', dept: '27', online: false, hasPhoto: true, joined: 11 },
    { pseudo: 'MLL SAMANTHA', sex: 'f', age: 28, city: 'Grenoble', dept: '38', online: true, hasPhoto: true, joined: 10 },
    { pseudo: 'LIONEL57100', sex: 'm', age: 50, city: 'Metz', dept: '57', online: false, hasPhoto: false, joined: 9 },
  ];

  // ===== Résultats filtrés + triés (dérivés des signaux) =====
  readonly results = computed<ResultMember[]>(() => {
    const sexe = this.sexe();
    const min = this.ageMin();
    const max = this.ageMax();
    const city = this.city().trim().toLowerCase();
    const withPhoto = this.withPhoto();
    const onlineOnly = this.onlineOnly();

    const filtered = this.members.filter((m) => {
      if (sexe !== 'all' && m.sex !== sexe) return false;
      if (m.age < min || m.age > max) return false;
      if (city && !m.city.toLowerCase().includes(city) && !m.dept.includes(city)) return false;
      if (withPhoto && !m.hasPhoto) return false;
      if (onlineOnly && !m.online) return false;
      return true;
    });

    const tri = this.tri();
    return [...filtered].sort((a, b) => {
      if (tri === 'age') return a.age - b.age;
      if (tri === 'online') return Number(b.online) - Number(a.online) || b.joined - a.joined;
      return b.joined - a.joined;
    });
  });

  readonly resultCount = computed(() => this.results().length);
  readonly onlineCount = computed(() => this.results().filter((m) => m.online).length);

  initials(pseudo: string): string {
    const words = pseudo.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return pseudo.slice(0, 2).toUpperCase();
  }
}
