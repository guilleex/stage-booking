import { Routes } from '@angular/router';
import { Main } from './layout/main/main';
import { authGuard } from './shared/guards/auth-guard';
import { mainRoutes } from './layout/main/main.routes';
import { Login } from './layout/login/login';
import { loginGuard } from './shared/guards/login-guard';
import { loginRoutes } from './layout/login/login.routes';

export const routes: Routes = [
    {
        path: '',
        component: Main,
        canActivate: [authGuard],
        children: mainRoutes
    },
    {
        path: '',
        component: Login,
        canActivate: [loginGuard],
        children: loginRoutes
    },
    {
        path: 'page-not-found',
        loadComponent: () => import('./shared/ui/page-not-found/page-not-found').then( m => m.PageNotFound),
        title: '404-Page not found'
    },
    {
        path: '**',
        redirectTo: '/page-not-found'
    } 
];
