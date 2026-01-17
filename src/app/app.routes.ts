import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/estatus',
    pathMatch: 'full'
  },
  {
    path: 'estatus',
    loadComponent: () => import('./components/views/client-status/client-status.component')
      .then(m => m.ClientStatusComponent),
    title: 'Estatus de Clientes'
  },
  {
    path: 'estadistica',
    loadComponent: () => import('./components/views/statistics/statistics.component')
      .then(m => m.StatisticsComponent),
    title: 'Estadística'
  },
  {
    path: 'tablas',
    loadComponent: () => import('./components//views/raw-tables/raw-tables.component')
      .then(m => m.RawTablesComponent),
    title: 'Datos'
  },
  {
    path: 'configuracion',
    loadComponent: () => import('./components//views/settings/settings.component')
      .then(m => m.SettingsComponent),
    title: 'configuración'
  }
];
