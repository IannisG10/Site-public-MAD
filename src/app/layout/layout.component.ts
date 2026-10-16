import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
  signal,
} from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

interface ChatMessage {
  from: 'me' | 'them';
  text: string;
  time: string;
}

/**
 * Coquille partagée : en-tête, navigation et messagerie temps réel.
 * Les styles sont volontairement globaux (ViewEncapsulation.None) : la coquille
 * fournit le conteneur `.lb`, la base des icônes/liens et le design system de
 * surface pour toutes les pages routées à l'intérieur de `<router-outlet>`.
 */
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, LucideAngularModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class LayoutComponent {
  // ===== Indicateurs d'en-tête (données de démonstration, front seul) =====
  readonly connected = 147;
  readonly onlineContacts = 0;

  // ===== Dialogue : messagerie en temps réel (démo front, conversation simulée) =====
  @ViewChild('thread') private threadRef?: ElementRef<HTMLElement>;
  @ViewChild('chatInput') private chatInputRef?: ElementRef<HTMLInputElement>;

  readonly dialogueOpen = signal(false);
  /** Nombre de dialogues non lus affiché sur la pastille d'en-tête. */
  readonly unreadDialogues = signal(1);

  readonly peerName = 'NEWFRANCK';
  readonly peerSex: 'm' | 'f' = 'm';
  readonly peerTyping = signal(false);

  readonly draft = signal('');
  readonly messages = signal<ChatMessage[]>([
    { from: 'them', text: 'Salut ! Bienvenue sur IziContact 👋', time: '14:02' },
    { from: 'them', text: 'Tu cherches à discuter dans quelle région ?', time: '14:03' },
    { from: 'me', text: 'Salut ! Plutôt vers Lyon, et toi ?', time: '14:05' },
  ]);

  private replyTimer?: ReturnType<typeof setTimeout>;
  private readonly cannedReplies = [
    'Ah super, j’adore Lyon 😄',
    'On pourrait se capter un de ces jours ?',
    'Tu es plutôt sorties ou soirées tranquilles ?',
    'Je t’ajoute à mes contacts alors 😉',
  ];
  private replyIdx = 0;

  openDialogue(): void {
    this.dialogueOpen.set(true);
    this.unreadDialogues.set(0);
    this.focusInput();
    this.scrollThread();
  }
  closeDialogue(): void {
    this.dialogueOpen.set(false);
  }
  toggleDialogue(): void {
    this.dialogueOpen() ? this.closeDialogue() : this.openDialogue();
  }

  sendMessage(): void {
    const text = this.draft().trim();
    if (!text) {
      return;
    }
    this.messages.update((list) => [...list, { from: 'me', text, time: this.nowTime() }]);
    this.draft.set('');
    this.scrollThread();
    this.simulateReply();
  }

  /** Simule une réponse « temps réel » de l'interlocuteur : indicateur de
   *  frappe puis message après un court délai. */
  private simulateReply(): void {
    clearTimeout(this.replyTimer);
    this.peerTyping.set(true);
    this.scrollThread();
    this.replyTimer = setTimeout(() => {
      this.peerTyping.set(false);
      const text = this.cannedReplies[this.replyIdx % this.cannedReplies.length];
      this.replyIdx++;
      this.messages.update((list) => [...list, { from: 'them', text, time: this.nowTime() }]);
      if (!this.dialogueOpen()) {
        this.unreadDialogues.update((n) => n + 1);
      }
      this.scrollThread();
    }, 1400);
  }

  private nowTime(): string {
    return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  private focusInput(): void {
    setTimeout(() => this.chatInputRef?.nativeElement.focus());
  }
  private scrollThread(): void {
    setTimeout(() => {
      const el = this.threadRef?.nativeElement;
      if (el) {
        el.scrollTop = el.scrollHeight;
      }
    });
  }

  initial(pseudo: string): string {
    return pseudo.charAt(0).toUpperCase();
  }
}
