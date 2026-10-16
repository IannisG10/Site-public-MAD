import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

interface OnlineMember {
  pseudo: string;
  sex: 'm' | 'f';
  code: string;
  /** rendu : lien (bleu), en avant (gras clair), ou estompé (hors-ligne) */
  state: 'link' | 'bold' | 'dim';
}

interface Featured {
  pseudo: string;
  sex: 'm' | 'f';
}

interface ForumTopic {
  date: string;
  title: string;
  author: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [DecimalPipe, RouterLink, LucideAngularModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  // ===== Statistiques (données de démonstration, front seul) =====
  readonly connected = 147;
  readonly activeMembers = 243438;
  readonly photoProfiles = 40316;
  readonly classifieds = 1219;
  readonly forumMessages = 2240;

  // ===== Membres en ligne =====
  readonly onlineMembers: OnlineMember[] = [
    { pseudo: 'NEWFRANCK', sex: 'm', code: '23', state: 'link' },
    { pseudo: 'LUDO65', sex: 'm', code: '65', state: 'bold' },
    { pseudo: 'DRASTIK', sex: 'm', code: '26', state: 'bold' },
    { pseudo: 'FEET ENJOY', sex: 'f', code: '49', state: 'bold' },
    { pseudo: 'ABSOLUTEVA', sex: 'm', code: '08', state: 'link' },
    { pseudo: 'ACTIF160', sex: 'm', code: '91', state: 'bold' },
    { pseudo: 'GODECEINTURE', sex: 'm', code: '50', state: 'bold' },
    { pseudo: 'PATSI34', sex: 'm', code: '34', state: 'bold' },
    { pseudo: 'GODDESS JUN', sex: 'f', code: '07', state: 'bold' },
    { pseudo: 'THALLIS', sex: 'm', code: '59', state: 'dim' },
    { pseudo: 'MLL SAMANTHA', sex: 'f', code: '92', state: 'dim' },
    { pseudo: 'PETITANUS', sex: 'm', code: '85', state: 'bold' },
    { pseudo: 'LUDOM75', sex: 'm', code: '36', state: 'bold' },
    { pseudo: 'HDU7401AFC', sex: 'm', code: '74', state: 'bold' },
    { pseudo: 'INTELLECT13', sex: 'm', code: '13', state: 'link' },
    { pseudo: 'TINAGIRLY', sex: 'f', code: '31', state: 'dim' },
    { pseudo: 'SIR HARNESS', sex: 'm', code: '33', state: 'bold' },
    { pseudo: 'CATSUITBOY69', sex: 'm', code: '69', state: 'bold' },
    { pseudo: 'JOJODEBRIEC', sex: 'm', code: '29', state: 'dim' },
    { pseudo: 'CONDOR78', sex: 'm', code: '78', state: 'link' },
    { pseudo: 'BIGLEUX', sex: 'm', code: 'BE', state: 'bold' },
    { pseudo: 'PENDRAGON', sex: 'm', code: '97', state: 'dim' },
    { pseudo: 'LADY SYA', sex: 'f', code: '08', state: 'dim' },
    { pseudo: 'BALY63', sex: 'm', code: '63', state: 'bold' },
    { pseudo: 'SOUMCRIS330', sex: 'm', code: '33', state: 'bold' },
    { pseudo: 'HERBERTO', sex: 'm', code: '27', state: 'bold' },
    { pseudo: 'FILOUKAT44', sex: 'm', code: 'BE', state: 'bold' },
    { pseudo: 'LIONEL57100', sex: 'm', code: '57', state: 'bold' },
  ];

  /** Aperçu affiché dans la carte « Membres en ligne » (progressive disclosure :
   *  on ne montre qu'une sélection, le reste via « voir tous »). */
  get onlinePreview(): OnlineMember[] {
    return this.onlineMembers.slice(0, 8);
  }

  /** Initiales (1 à 2 lettres) pour un avatar : initiales des deux premiers
   *  mots, sinon les deux premières lettres du pseudo. */
  avatarInitials(pseudo: string): string {
    const words = pseudo.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return pseudo.slice(0, 2).toUpperCase();
  }

  // ===== À la une =====
  readonly featured: Featured[] = [
    { pseudo: 'KLODALI', sex: 'f' },
    { pseudo: 'OBEDIA', sex: 'f' },
    { pseudo: 'CARLA29', sex: 'f' },
    { pseudo: 'DEBORAHH', sex: 'f' },
  ];

  // ===== Forum =====
  readonly forumTopics: ForumTopic[] = [
    { date: '09/10 21:53', title: 'Première rencontre, vos conseils', author: 'ATTACHO' },
    { date: '09/10 15:31', title: 'Cherche partenaire sur la région', author: 'NFS76' },
    { date: '05/10 18:04', title: 'Soirée entre libertins ce week-end', author: 'SOUMCRIS' },
    { date: '01/10 21:56', title: 'Comment bien débuter sans pression', author: 'GODECE' },
  ];

  // ===== Recherche rapide : options des menus =====
  readonly lookingForOptions = ['Un homme', 'Une femme', 'Un couple', 'Peu importe'];
  readonly youAreOptions = ['Un homme', 'Une femme', 'Un couple'];
  readonly zoneOptions = ['France', 'Belgique', 'Suisse', 'Luxembourg', 'Canada'];

  initial(pseudo: string): string {
    return pseudo.charAt(0).toUpperCase();
  }
}
