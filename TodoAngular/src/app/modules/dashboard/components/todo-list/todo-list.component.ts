import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

import {SubscriberComponent} from '../../../../shared/abstract/subsciber-component.abstract';
import {TodosEmitables, TodosService} from '../../services/todos.service';
import {TodoService} from '../todo-detail/services/todo.service';


@Component({
    selector: 'app-todo-list',
    templateUrl: './todo-list.component.html',
})
export class TodoListComponent extends SubscriberComponent<TodosEmitables> implements OnChanges {

    @Input('list') List: {Id: string, Name: string} = null;

    Dom = {
        ActiveTab: <string>'todos',
        ShowCompleted: <boolean>false
    };

    constructor(private todos: TodosService, private todo: TodoService) {
        super(todos);
    }

    /**
     *
     */
    async ngOnInit() {
        super.ngOnInit();

        if(this.List !== null) {
            await this.todos.GetTodos(this.List.Id);
        }
    }

    /**
     *
     * @param {SimpleChanges} changes
     * @returns {Promise<void>}
     */
    async ngOnChanges(changes: SimpleChanges) {
        if((changes['List'] && changes['List'].currentValue) && changes['List'].currentValue !== null) {
            this.List = changes['List'].currentValue;

            await this.todos.GetTodos(changes['List'].currentValue['Id']);
            this.Dom.ActiveTab = 'todos';
        }
    }

    /**
     *
     * @constructor
     */
    SetTodo(Todo: any) {
        this.todo.SetTodo(Todo)
    }

    /**
     *
     * @param {string} Id
     * @returns {Promise<void>}
     * @constructor
     */
    async Delete(Id: string) {
        await this.todos.DeleteTodo(Id);
    }

    /**
     *
     * @returns {Promise<void>}
     * @constructor
     */
    async Complete(TaskRequest: {TodoId: string, Completed: boolean}) {
        await this.todos.CompleteTodo(TaskRequest.TodoId, TaskRequest.Completed)
    }

    /**
     *
     * @param {string} Tab
     * @constructor
     */
    ChangeTab(Tab: string) {
        this.Dom.ActiveTab = Tab
    }

    /**
     *
     * @constructor
     */
    ShowCompleted() {
        this.Dom.ShowCompleted =! this.Dom.ShowCompleted
    }
}
