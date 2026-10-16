import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
  LOCALE_ID,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

import { provideClientHydration } from '@angular/platform-browser';
import {
  LucideAngularModule,
  Search,
  MessageSquare,
  MessageCircle,
  Sparkles,
  Users,
  Images,
  Megaphone,
  UserPlus,
  RefreshCw,
  LogIn,
  Mail,
  Heart,
  ChevronRight,
  ChevronLeft,
  X,
  Send,
  SlidersHorizontal,
  User,
  Star,
  MapPin,
  Calendar,
  Pencil,
  Eye,
  Check,
  Plus,
  Camera,
  Pin,
  Flame,
} from 'lucide-angular';

import { routes } from './app.routes';

registerLocaleData(localeFr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    { provide: LOCALE_ID, useValue: 'fr-FR' },
    provideRouter(routes),
    provideClientHydration(),
    importProvidersFrom(
      LucideAngularModule.pick({
        Search,
        MessageSquare,
        MessageCircle,
        Sparkles,
        Users,
        Images,
        Megaphone,
        UserPlus,
        RefreshCw,
        LogIn,
        Mail,
        Heart,
        ChevronRight,
        ChevronLeft,
        X,
        Send,
        SlidersHorizontal,
        User,
        Star,
        MapPin,
        Calendar,
        Pencil,
        Eye,
        Check,
        Plus,
        Camera,
        Pin,
        Flame,
      }),
    ),
  ],
};
