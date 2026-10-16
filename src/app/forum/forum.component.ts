import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

interface Topic {
  id: number;
  title: string;
  category: string;
  author: string;
  sex: 'm' | 'f';
  replies: number;
  views: number;
  last: string;
  pinned: boolean;
  hot: boolean;
}

@Component({
  selector: 'app-forum',
  standalone: true,
  imports: [DecimalPipe, LucideAngularModule],
  templateUrl: './forum.component.html',
  styleUrl: './forum.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForumComponent {
  readonly categories = ['Toutes', 'Rencontres', 'Conseils', 'Sorties', 'Discussions'];
  readonly activeCategory = signal('Toutes');
  setCategory(c: string): void {
    this.activeCategory.set(c);
  }

  private readonly topics: Topic[] = [
    { id: 1, title: 'Les règles de bonne conduite du forum (à lire)', category: 'Discussions', author: 'MODÉRATION', sex: 'f', replies: 12, views: 8420, last: 'il y a 2 h', pinned: true, hot: false },
    { id: 2, title: 'Première rencontre : vos meilleurs conseils', category: 'Conseils', author: 'ATTACHO', sex: 'm', replies: 48, views: 3120, last: 'il y a 18 min', pinned: false, hot: true },
    { id: 3, title: 'Soirée entre membres ce week-end sur Lyon', category: 'Sorties', author: 'SOUMCRIS', sex: 'm', replies: 31, views: 1890, last: 'il y a 42 min', pinned: false, hot: true },
    { id: 4, title: 'Cherche partenaire de sorties sur la région PACA', category: 'Rencontres', author: 'NFS76', sex: 'f', replies: 9, views: 540, last: 'il y a 1 h', pinned: false, hot: false },
    { id: 5, title: 'Comment bien débuter sans pression ?', category: 'Conseils', author: 'GODECE', sex: 'm', replies: 22, views: 1250, last: 'il y a 3 h', pinned: false, hot: false },
    { id: 6, title: 'Vos endroits préférés pour un premier verre', category: 'Sorties', author: 'TINAGIRLY', sex: 'f', replies: 17, views: 980, last: 'il y a 5 h', pinned: false, hot: false },
    { id: 7, title: 'Présentez-vous à la communauté 👋', category: 'Discussions', author: 'KLODALI', sex: 'f', replies: 203, views: 15600, last: 'il y a 6 h', pinned: false, hot: true },
    { id: 8, title: 'Retour d\'expérience après 6 mois sur IziContact', category: 'Discussions', author: 'CONDOR78', sex: 'm', replies: 14, views: 760, last: 'hier', pinned: false, hot: false },
  ];

  readonly filtered = computed<Topic[]>(() => {
    const cat = this.activeCategory();
    const list = cat === 'Toutes' ? this.topics : this.topics.filter((t) => t.category === cat);
    // Épinglés toujours en tête, puis populaires, puis le reste.
    return [...list].sort((a, b) => Number(b.pinned) - Number(a.pinned) || Number(b.hot) - Number(a.hot));
  });

  readonly topicCount = computed(() => this.topics.length);
  readonly messageCount = computed(() => this.topics.reduce((sum, t) => sum + t.replies, 0));

  initials(pseudo: string): string {
    const words = pseudo.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return pseudo.slice(0, 2).toUpperCase();
  }
}
