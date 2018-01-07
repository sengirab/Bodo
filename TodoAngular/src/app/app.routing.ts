import {RouterModule, Routes} from "@angular/router";
import {AuthenticationGuard} from './modules/authentication/guards/authentication.guard';

const APP_ROUTES: Routes = [
    {
        path: 'authentication',
        loadChildren: 'app/modules/authentication/authentication.module#AuthenticationModule',
        canActivate: [AuthenticationGuard]
    },
    {
        path: '',
        loadChildren: 'app/modules/dashboard/dashboard.module#DashboardModule',
        canActivate: [AuthenticationGuard]
    },
    {path: '**', redirectTo: '/'}
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);
