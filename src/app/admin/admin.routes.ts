import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
    {
        path: 'dashboard',
        loadComponent: () => import('../admin/dashboard/feature/dashboard/dashboard').then(m => m.Dashboard),
        data: {
            title: 'Dashboard',
            roles: ['Admin']
        }
    },
    {
        path: 'users',
        loadComponent: () => import('../admin/users/feature/users/users').then(m => m.Users),
        data: {
            title: 'Users',
            roles: ['Admin']
        }
    },
    {
        path: 'employees',
        loadComponent: () => import('../admin/employees/feature/employees/employees').then(m => m.Employees),
        data: {
            title: 'Employees',
            roles: ['Admin']
        }
    }
];

