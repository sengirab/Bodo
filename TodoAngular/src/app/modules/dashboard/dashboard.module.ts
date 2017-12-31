import {NgModule} from '@angular/core';

import {DashboardComponent} from './dashboard.component';
import {CategoryListComponent} from './components/category-list/category-list.component';
import {CreateTodoComponent} from './components/create-todo/create-todo.component';
import {TodoItemComponent} from './components/todo-item/todo-item.component';
import {SharedModule} from '../../shared/shared.module';
import {DASHBOARD_ROUTING} from './dashboard.routing';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { TodoDetailComponent } from './components/todo-detail/todo-detail.component';


@NgModule({
    imports: [
        SharedModule,
        DASHBOARD_ROUTING
    ],
    declarations: [
        DashboardComponent,
        CategoryListComponent,
        CreateTodoComponent,
        TodoItemComponent,
        TodoListComponent,
        TodoDetailComponent,
    ]
})
export class DashboardModule {
}
