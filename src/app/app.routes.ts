import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import { SearchComponent } from './search/search.component';
import { MembresComponent } from './membres/membres.component';
import { ProfilComponent } from './profil/profil.component';
import { CourrierComponent } from './courrier/courrier.component';
import { ForumComponent } from './forum/forum.component';
import { ForfaitComponent } from './forfait/forfait.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent, title: 'IziContact — Accueil' },
      { path: 'recherche', component: SearchComponent, title: 'IziContact — Recherche' },
      { path: 'membres', component: MembresComponent, title: 'IziContact — Membres en ligne' },
      { path: 'courrier', component: CourrierComponent, title: 'IziContact — Mon courrier' },
      { path: 'forum', component: ForumComponent, title: 'IziContact — Forum' },
      { path: 'profil', component: ProfilComponent, title: 'IziContact — Mon profil' },
      { path: 'forfait', component: ForfaitComponent, title: 'IziContact — Mon forfait' },
    ],
  },
];
