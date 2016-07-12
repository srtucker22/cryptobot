import { provideRouter, RouterConfig }  from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: RouterConfig = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: DashboardComponent
  },
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
