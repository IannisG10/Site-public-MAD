import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

interface OnlineMember {
  pseudo: string;
  sex: 'm' | 'f';
  age: number;
  city: string;
  dept: string;
  hasPhoto: boolean;
  /** minutes écoulées depuis la connexion (plus petit = arrivé le plus récemment) */
  since: number;
}

type Sexe = 'all' | 'm' | 'f';

@Component({
  selector: 'app-membres',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
  templateUrl: './membres.component.html',
  styleUrl: './membres.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MembresComponent {
  // ===== Filtres rapides (présence, pas de recherche avancée) =====
  readonly sexe = signal<Sexe>('all');
  readonly withPhoto = signal(false);

  readonly sexeOptions: { value: Sexe; label: string }[] = [
    { value: 'all', label: 'Tous' },
    { value: 'f', label: 'Femmes' },
    { value: 'm', label: 'Hommes' },
  ];

  setSexe(v: Sexe): void {
    this.sexe.set(v);
  }

  // ===== Membres actuellement en ligne (données de démonstration) =====
  private readonly members: OnlineMember[] = [
    { pseudo: 'KLODALI', sex: 'f', age: 29, city: 'Lyon', dept: '69', hasPhoto: true, since: 1 },
    { pseudo: 'NEWFRANCK', sex: 'm', age: 34, city: 'Villeurbanne', dept: '69', hasPhoto: true, since: 2 },
    { pseudo: 'GODDESS JUN', sex: 'f', age: 33, city: 'Annecy', dept: '74', hasPhoto: true, since: 3 },
    { pseudo: 'DRASTIK', sex: 'm', age: 38, city: 'Valence', dept: '26', hasPhoto: false, since: 4 },
    { pseudo: 'DEBORAHH', sex: 'f', age: 24, city: 'Lille', dept: '59', hasPhoto: true, since: 6 },
    { pseudo: 'ABSOLUTEVA', sex: 'm', age: 45, city: 'Nice', dept: '06', hasPhoto: false, since: 8 },
    { pseudo: 'TINAGIRLY', sex: 'f', age: 31, city: 'Toulouse', dept: '31', hasPhoto: true, since: 11 },
    { pseudo: 'CONDOR78', sex: 'm', age: 47, city: 'Versailles', dept: '78', hasPhoto: false, since: 13 },
    { pseudo: 'LADY SYA', sex: 'f', age: 39, city: 'Nantes', dept: '44', hasPhoto: true, since: 17 },
    { pseudo: 'BALY63', sex: 'm', age: 36, city: 'Clermont-Ferrand', dept: '63', hasPhoto: false, since: 21 },
    { pseudo: 'MLL SAMANTHA', sex: 'f', age: 28, city: 'Grenoble', dept: '38', hasPhoto: true, since: 24 },
    { pseudo: 'INTELLECT13', sex: 'm', age: 52, city: 'Aix-en-Provence', dept: '13', hasPhoto: true, since: 27 },
    { pseudo: 'CARLA29', sex: 'f', age: 27, city: 'Quimper', dept: '29', hasPhoto: true, since: 33 },
    { pseudo: 'HERBERTO', sex: 'm', age: 43, city: 'Évreux', dept: '27', hasPhoto: true, since: 38 },
    { pseudo: 'OBEDIA', sex: 'f', age: 41, city: 'Marseille', dept: '13', hasPhoto: true, since: 44 },
    { pseudo: 'LIONEL57100', sex: 'm', age: 50, city: 'Metz', dept: '57', hasPhoto: false, since: 52 },
  ];

  /** Total en ligne (constant, affiché en stat « live »). */
  readonly onlineTotal = 147;

  private readonly visible = computed<OnlineMember[]>(() => {
    const sexe = this.sexe();
    const withPhoto = this.withPhoto();
    return this.members
      .filter((m) => (sexe === 'all' || m.sex === sexe) && (!withPhoto || m.hasPhoto))
      .sort((a, b) => a.since - b.since);
  });

  /** Arrivés il y a ≤ 5 min : mis en avant comme « viennent d'arriver ». */
  readonly justArrived = computed(() => this.visible().filter((m) => m.since <= 5));
  /** Le reste des membres en ligne. */
  readonly others = computed(() => this.visible().filter((m) => m.since > 5));
  readonly visibleCount = computed(() => this.visible().length);

  since(min: number): string {
    if (min <= 1) return "à l'instant";
    return `il y a ${min} min`;
  }

  initials(pseudo: string): string {
    const words = pseudo.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return pseudo.slice(0, 2).toUpperCase();
  }
}
