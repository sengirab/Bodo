import {Component, HostBinding, Input, OnChanges, SimpleChanges} from '@angular/core';

import {SubscriberComponent}          from '../../../../shared/abstract/subsciber-component.abstract';
import {TodosEmitables, TodosService} from '../../services/todos.service';
import {TodoService}                  from '../todo-detail/services/todo.service';
import {ModalsService}                from '../../../../components/modals/service/modals.service';
import {easeInOut}                    from '../../../../shared/animations/ease-in-out';


@Component({
    selector: 'app-todo-list',
    templateUrl: './todo-list.component.html',
    animations: [
        easeInOut
    ],
})
export class TodoListComponent extends SubscriberComponent<TodosEmitables> implements OnChanges {

    @Input('list') List: { Id: string, Name: string } = null;
    @HostBinding('@.disabled') DisabledAnimations = true;

    Dom = {
        ActiveTab: <string>'todos',
        ShowCompleted: <boolean>false
    };

    constructor(private todos: TodosService,
                private todo: TodoService,
                private modals: ModalsService) {
        super(todos);
    }

    /**
     *
     */
    async ngOnInit() {
        super.ngOnInit();

        if (this.List !== null) {
            await this.GetTodos(this.List.Id);
        }
    }

    /**
     *
     * @param {SimpleChanges} changes
     * @returns {Promise<void>}
     */
    async ngOnChanges(changes: SimpleChanges) {
        if ((changes['List'] && changes['List'].currentValue) && changes['List'].currentValue !== null) {
            this.List = changes['List'].currentValue;

            await this.GetTodos(changes['List'].currentValue['Id']);
            this.Dom.ActiveTab = 'todos';
        }
    }

    /**
     *
     * @param {string} ListId
     * @returns {Promise<void>}
     * @constructor
     */
    async GetTodos(ListId: string) {
        this.DisabledAnimations = true;
        await this.todos.GetTodos(ListId);

        // Too fast without set timeout, resulting in to animations that we don't want here.
        setTimeout(() => {
            this.DisabledAnimations = false;
        }, 0);
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
    async Complete(TaskRequest: { TodoId: string, Completed: boolean }) {
        await this.todos.CompleteTodo(TaskRequest.TodoId, TaskRequest.Completed);
    }

    /**
     *
     * @constructor
     */
    SetTodo(Todo: any) {
        this.todo.SetTodo(Todo);

        this.modals.TriggerOverlay();
    }

    /**
     *
     * @param {string} Tab
     * @constructor
     */
    ChangeTab(Tab: string) {
        this.Dom.ActiveTab = Tab;
    }

    /**
     *
     * @constructor
     */
    ShowCompleted() {
        this.Dom.ShowCompleted = !this.Dom.ShowCompleted;
    }
}
