import {BrowserModule} from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {APP_ROUTING} from './app.routing';
import {SharedModule} from './shared/shared.module';

import {TodosService} from './modules/dashboard/services/todos.service';
import {ListsService} from './modules/dashboard/services/lists.service';
import {TodoService} from './modules/dashboard/components/todo-detail/services/todo.service';
import {AuthenticationService} from './modules/authentication/services/authentication.service';
import {AuthenticationGuard} from './modules/authentication/guards/authentication.guard';


@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        SharedModule,
        APP_ROUTING
    ],
    providers: [
        AuthenticationService,
        AuthenticationGuard,
        TodosService,
        TodoService,
        ListsService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
