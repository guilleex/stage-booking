import { Routes } from '@angular/router';


export const mainRoutes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'admin/dashboard',
        loadComponent: () => import('../../admin/dashboard/feature/dashboard/dashboard').then(m => m.Dashboard),
        data: {
            title: 'Dashboard',
            roles: ['Admin']
        }
    },
    {
        path: 'employee/calendar',
        loadComponent: () => import('../../employee/calendar/feature/calendar/calendar').then(m => m.Calendar),
        data: {
            title: 'Calendar',
            roles: ['Employee']
        }
    },
    {
        path: 'user/home',
        loadComponent: () => import('../../user/home/feature/home/home').then(m => m.Home),
        data: {
            title: 'Home',
            roles: ['User']
        }
    },
];
