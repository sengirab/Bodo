import {NgModule} from '@angular/core';

import {RegisterComponent} from './components/register/register.component';
import {AuthenticationComponent} from './authentication.component';
import {AUTHENTICATION_ROUTING} from './authentication.routing';
import {LoginComponent} from './components/login/login.component';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
    imports: [
        SharedModule,
        AUTHENTICATION_ROUTING
    ],
    declarations: [
        LoginComponent,
        RegisterComponent,
        AuthenticationComponent,
    ]
})
export class AuthenticationModule {
}
