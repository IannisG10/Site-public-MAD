import { afterNextRender, Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const STORAGE_KEY = 'izicontact.age-verified';

export type AgeGateStatus = 'verified' | 'denied' | null;

/**
 * État de la vérification d'âge (opt-in d'entrée sur le site public).
 * - `null`    : pas encore répondu → on affiche la porte.
 * - `verified`: majeur confirmé → accès au site, mémorisé dans localStorage.
 * - `denied`  : mineur déclaré → accès bloqué (non mémorisé, peut recommencer).
 */
@Injectable({ providedIn: 'root' })
export class AgeGateService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** Âge minimum requis pour entrer. */
  readonly minAge = 18;

  readonly status = signal<AgeGateStatus>(null);

  constructor() {
    // Après l'hydratation (navigateur uniquement) : on restaure un consentement
    // déjà donné. Lu ici et pas dans le constructeur pour éviter tout décalage
    // d'hydratation (le serveur rend toujours la porte).
    afterNextRender(() => {
      try {
        if (localStorage.getItem(STORAGE_KEY) === '1') {
          this.status.set('verified');
        }
      } catch {
        /* localStorage indisponible (mode privé, etc.) : on redemande. */
      }
    });
  }

  /**
   * Valide l'année de naissance sélectionnée (bouton « J'ai plus de 18 ans »).
   * Accès accordé + mémorisé si l'âge atteint le minimum, refusé sinon.
   */
  confirmBirthYear(year: number): Exclude<AgeGateStatus, null> {
    const age = new Date().getFullYear() - year;
    if (age >= this.minAge) {
      this.status.set('verified');
      if (this.isBrowser) {
        try {
          localStorage.setItem(STORAGE_KEY, '1');
        } catch {
          /* on ignore : l'accès reste valide pour la session en cours */
        }
      }
      return 'verified';
    }
    this.status.set('denied');
    return 'denied';
  }

  /** « J'ai moins de 18 ans » : accès refusé (non mémorisé). */
  declineMinor(): void {
    this.status.set('denied');
  }

  /** Réinitialise (bouton « recommencer » après un refus). */
  reset(): void {
    this.status.set(null);
    if (this.isBrowser) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {
        /* no-op */
      }
    }
  }
}
