import {RouterModule, Routes} from '@angular/router';

import {AuthenticationComponent} from './authentication.component';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';


const AUTHENTICATION_ROUTES: Routes = [
    {
        path: '', component: AuthenticationComponent, children: [
            {
                path: 'login', component: LoginComponent,
            },
            {
                path: 'register', component: RegisterComponent,
            }
        ]
    },
    {path: '**', redirectTo: '/login'}
];

export const AUTHENTICATION_ROUTING = RouterModule.forChild(AUTHENTICATION_ROUTES);
