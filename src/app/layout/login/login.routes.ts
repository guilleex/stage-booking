import { Routes } from '@angular/router';

export const loginRoutes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('../../auth/feature/auth/auth').then(m => m.Auth),
        data: {
            title: 'Login'
        }
    }
];
