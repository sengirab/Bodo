import {RouterModule, Routes} from "@angular/router";

const APP_ROUTES: Routes = [
    // {
    //     path: 'authorization',
    //     loadChildren: 'app/modules/authorization/authorization.module#AuthenticationModule',
    // },
    {
        path: '',
        loadChildren: 'app/modules/dashboard/dashboard.module#DashboardModule',
    },
    {path: '**', redirectTo: '/'}
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);
