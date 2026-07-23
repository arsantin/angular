import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { WhoWeAre } from './pages/who-we-are/who-we-are';
import { Contato } from './pages/contato/contato';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { dashboardGuard } from './dashboard-guard';
import { Signup } from './pages/login/signup/signup';
import { MeuPerfil } from './pages/dashboard/meu-perfil/meu-perfil';
import { Users } from './pages/dashboard/users/users';
export const routes: Routes = [
  {
    path: '',
    component: Home,
  },
  {
    path: 'who-we-are',
    component: WhoWeAre,
  },
  {
    path: 'contato',
    component: Contato,
  },
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'login/signup',
    component: Signup,
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [dashboardGuard],
  },
  {
    path: 'dashboard/meu-perfil',
    component: MeuPerfil,
    canActivate: [dashboardGuard],
  },
  {
    path: 'dashboard/users',
    component: Users,
    canActivate: [dashboardGuard],
  },
];
