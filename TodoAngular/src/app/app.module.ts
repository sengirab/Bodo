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
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ModalsService} from './components/modals/service/modals.service';
import {ListModalComponent} from './components/modals/components/list-modal/list-modal.component';
import {ModalComponent} from './components/modals/modal.component';
import {DynamicModalComponent} from './components/modals/components/dynamic-modal/dynamic-modal.component';

@NgModule({
    declarations: [
        AppComponent,

        // Modals
        DynamicModalComponent,
        ModalComponent,
        ListModalComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        SharedModule,
        BrowserAnimationsModule,
        APP_ROUTING
    ],
    providers: [
        AuthenticationService,
        AuthenticationGuard,
        TodosService,
        TodoService,
        ListsService,
        ModalsService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
