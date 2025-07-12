import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guards';

export const routes: Routes = [

    { path: '', loadChildren: () => import('./website/website.routes').then(m => m.default), },
    
    {
        path: 'tipo-cambio', 
        canActivate: [AuthGuard], 
        loadChildren: () => import('./admin/shared/tipocambio.routes').then(m => m.default), 
    },

    { 
        path: 'dashboard', 
        canActivate: [AuthGuard], 
        loadChildren: () => import('./admin/shared/dashboard.routes').then(m => m.default), 
    },

    { path: '**', redirectTo: '', },
];