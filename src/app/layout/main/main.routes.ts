import { Routes } from '@angular/router';
import { adminRoutes } from '../../admin/admin.routes';


export const mainRoutes: Routes = [
    {
        path: '',
        redirectTo: 'admin/dashboard',
        pathMatch: 'full'
    },
    {
        path: 'admin',
        children: adminRoutes,
        data: {
            roles: ['Administrator']
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
    {
        path: 'my-account',
        loadComponent: () => import('../../account/feature/account/account').then(m => m.Account),
        data: {
            title: 'MyAccount',
            roles: ['Administrator', 'Employee', 'User']
        }
    }
];
