import { Routes } from '@angular/router';


export const mainRoutes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    // {
    //     path: 'home',
    //     loadComponent: () => import('../../home/feature/home/home').then(m => m.Home),
    //     data: {
    //         title: 'Home',
    //         roles: ['User', 'Admin']
    //     }
    // },
];
