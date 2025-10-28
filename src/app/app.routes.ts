import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/timer',
    pathMatch: 'full',
  },
  {
    path: 'timer',
    loadComponent: () =>
      import('./features/timer/timer.component').then((m) => m.TimerComponent),
  },
  {
    path: 'history',
    loadComponent: () =>
      import('./features/history/history.component').then((m) => m.HistoryComponent),
  },
  {
    path: 'settings',
    loadComponent: () =>
      import('./features/settings/settings.component').then((m) => m.SettingsComponent),
  },
  {
    path: '**',
    redirectTo: '/timer',
  },
];
