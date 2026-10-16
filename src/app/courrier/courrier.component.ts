import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

interface Msg {
  from: 'me' | 'them';
  text: string;
  time: string;
}

interface Conversation {
  id: number;
  peer: string;
  sex: 'm' | 'f';
  online: boolean;
  unread: boolean;
  preview: string;
  time: string;
  messages: Msg[];
}

type Onglet = 'all' | 'unread';

@Component({
  selector: 'app-courrier',
  standalone: true,
  imports: [LucideAngularModule],
  templateUrl: './courrier.component.html',
  styleUrl: './courrier.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CourrierComponent {
  readonly onglet = signal<Onglet>('all');
  readonly selectedId = signal(1);
  readonly draft = signal('');
  /** Sur mobile : bascule entre la liste et le fil ouvert. */
  readonly mobileThread = signal(false);
  /** Mode d'entrée (depuis l'annuaire) : « tchat » ou « courrier ». */
  readonly mode = signal<'tchat' | 'courrier'>('courrier');

  private readonly route = inject(ActivatedRoute);
  /** id auto-incrémenté pour les nouvelles conversations créées depuis l'annuaire. */
  private nextId = 100;

  constructor() {
    // Arrivée depuis l'annuaire : ?avec=PSEUDO&mode=tchat|courrier&sexe=m|f
    this.route.queryParamMap.subscribe((params) => {
      const avec = params.get('avec');
      const mode = params.get('mode');
      if (mode === 'tchat' || mode === 'courrier') {
        this.mode.set(mode);
      }
      if (avec) {
        this.openWith(avec, (params.get('sexe') as 'm' | 'f') ?? 'f');
      }
    });
  }

  /** Ouvre la conversation avec ce membre, ou en crée une vide si elle n'existe pas. */
  private openWith(peer: string, sex: 'm' | 'f'): void {
    const existing = this.conversations().find((c) => c.peer === peer);
    if (existing) {
      this.select(existing.id);
      return;
    }
    const id = this.nextId++;
    const conv: Conversation = {
      id, peer, sex, online: false, unread: false,
      preview: 'Nouvelle conversation', time: '',
      messages: [],
    };
    this.conversations.update((list) => [conv, ...list]);
    this.select(id);
  }

  readonly conversations = signal<Conversation[]>([
    {
      id: 1, peer: 'KLODALI', sex: 'f', online: true, unread: true,
      preview: 'Avec plaisir, on se cale ça pour vendredi ?', time: '14:32',
      messages: [
        { from: 'them', text: 'Coucou ! J\'ai vu ton profil, on est tous les deux sur Lyon 😊', time: '14:10' },
        { from: 'me', text: 'Salut KLODALI ! Oui exactement, ça te dirait qu\'on prenne un verre ?', time: '14:21' },
        { from: 'them', text: 'Avec plaisir, on se cale ça pour vendredi ?', time: '14:32' },
      ],
    },
    {
      id: 2, peer: 'NEWFRANCK', sex: 'm', online: true, unread: true,
      preview: 'Tu connais un bon bar à Villeurbanne ?', time: '12:05',
      messages: [
        { from: 'them', text: 'Hello ! Partant pour échanger sur les sorties du coin ?', time: '11:48' },
        { from: 'them', text: 'Tu connais un bon bar à Villeurbanne ?', time: '12:05' },
      ],
    },
    {
      id: 3, peer: 'GODDESS JUN', sex: 'f', online: false, unread: false,
      preview: 'Merci pour le conseil, à bientôt !', time: 'Hier',
      messages: [
        { from: 'me', text: 'Tu devrais essayer le resto dont je t\'ai parlé 🙂', time: 'Hier' },
        { from: 'them', text: 'Merci pour le conseil, à bientôt !', time: 'Hier' },
      ],
    },
    {
      id: 4, peer: 'DRASTIK', sex: 'm', online: false, unread: false,
      preview: 'Vous : Ça marche, bonne soirée.', time: 'Lun.',
      messages: [
        { from: 'them', text: 'On reste en contact alors.', time: 'Lun.' },
        { from: 'me', text: 'Ça marche, bonne soirée.', time: 'Lun.' },
      ],
    },
  ]);

  readonly filtered = computed(() => {
    const list = this.conversations();
    return this.onglet() === 'unread' ? list.filter((c) => c.unread) : list;
  });
  readonly unreadCount = computed(() => this.conversations().filter((c) => c.unread).length);
  readonly selected = computed(() => this.conversations().find((c) => c.id === this.selectedId()) ?? null);

  setOnglet(o: Onglet): void {
    this.onglet.set(o);
  }

  select(id: number): void {
    this.selectedId.set(id);
    this.mobileThread.set(true);
    this.conversations.update((list) =>
      list.map((c) => (c.id === id ? { ...c, unread: false } : c)),
    );
  }

  backToList(): void {
    this.mobileThread.set(false);
  }

  send(): void {
    const text = this.draft().trim();
    const id = this.selectedId();
    if (!text) {
      return;
    }
    const time = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    this.conversations.update((list) =>
      list.map((c) =>
        c.id === id
          ? { ...c, messages: [...c.messages, { from: 'me', text, time }], preview: `Vous : ${text}`, time }
          : c,
      ),
    );
    this.draft.set('');
  }

  initials(pseudo: string): string {
    const words = pseudo.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return pseudo.slice(0, 2).toUpperCase();
  }
}
