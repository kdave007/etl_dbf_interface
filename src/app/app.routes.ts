import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./components/auth/login/login.component')
      .then(m => m.LoginComponent),
    title: 'Iniciar Sesión'
  },
  {
    path: '',
    redirectTo: '/estatus',
    pathMatch: 'full'
  },
  {
    path: 'estatus',
    loadComponent: () => import('./components/views/client-status/client-status.component')
      .then(m => m.ClientStatusComponent),
    title: 'Estatus de Clientes',
    canActivate: [authGuard]
  },
  {
    path: 'estadistica',
    loadComponent: () => import('./components/views/statistics/statistics.component')
      .then(m => m.StatisticsComponent),
    title: 'Estadística',
    canActivate: [authGuard]
  },
  {
    path: 'tablas',
    loadComponent: () => import('./components//views/raw-tables/raw-tables.component')
      .then(m => m.RawTablesComponent),
    title: 'Datos',
    canActivate: [authGuard]
  },
  {
    path: 'configuracion',
    loadComponent: () => import('./components//views/settings/settings.component')
      .then(m => m.SettingsComponent),
    title: 'configuración',
    canActivate: [authGuard]
  }
];
