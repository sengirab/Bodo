import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';

import {SubscriberComponent}        from '../../../../shared/abstract/subsciber-component.abstract';
import {TodoEmitables, TodoService} from './services/todo.service';
import {ModalsService}              from '../../../../components/modals/service/modals.service';
import {easeInOut}                  from '../../../../shared/animations/ease-in-out';
import {SyncEventService}           from '../../../../shared/services/sync-event.service';
import {TodoItemComponent}          from '../todo-item/todo-item.component';

@Component({
    selector: 'app-todo-detail',
    templateUrl: './todo-detail.component.html',
    animations: [
        easeInOut
    ],
})
export class TodoDetailComponent extends SubscriberComponent<TodoEmitables> implements OnInit {
    @ViewChildren(TodoItemComponent) Todos: QueryList<TodoItemComponent>;

    PatchForm: FormGroup;
    ChildForm: FormGroup;

    SubscribeFunctions = {
        SetForm: () => this.SetForm()
    };

    constructor(private todo: TodoService,
                private form: FormBuilder,
                private modals: ModalsService,
                private syncEvent: SyncEventService) {
        super(todo);
    }

    ngOnInit() {
        super.ngOnInit();

        this.SetForm();

        this.syncEvent.AddEvent('keyup', (event) => this.ListenToESC(event));
    }

    /**
     *
     * @constructor
     */
    SetForm() {
        this.PatchForm = this.form.group({
            Text: [this.Fillables.Todo != null ? this.Fillables.Todo.Text : '', Validators.required],
        });

        this.ChildForm = this.form.group({
            Text: ['', Validators.required],
            ListId: [this.Fillables.Todo != null ? this.Fillables.Todo.ListId : '', Validators.required],
            ParentId: this.form.group({
                UUID: [this.Fillables.Todo != null ? this.Fillables.Todo.Id : '', Validators.required],
                Valid: true
            })
        });
    }

    /**
     *
     * @constructor
     */
    async UpdateTodo(f: NgForm) {
        let Todo = {
            ...this.Fillables.Todo,
            ...f.value,

        };

        await this.todo.UpdateTodo(Todo);
    }

    /**
     *
     * @returns {Promise<void>}
     * @constructor
     */
    async TodoEdited(Todo: any) {
        await this.todo.UpdateChild(Todo);
    }

    /**
     *
     * @param {NgForm} f
     * @constructor
     */
    async AddChildTodo(f: NgForm) {
        await this.todo.AddChildTodo(f);
    }

    /**
     *
     * @returns {Promise<void>}
     * @constructor
     */
    async Complete(TaskRequest: { TodoId: string, Completed: boolean }) {
        await this.todo.CompleteTodo(TaskRequest.TodoId, TaskRequest.Completed);
    }

    /**
     *
     * @returns {Promise<void>}
     * @constructor
     * @param Todo
     */
    async Delete(Todo: any) {
        await this.todo.DeleteTodo(Todo);
    }

    /**
     *
     * @constructor
     */
    TodoTab(Tab: {component: TodoItemComponent, shift: boolean}) {
        let todos = this.Todos.toArray().filter((t) => !t.Todo.Completed);
        let index = todos.indexOf(Tab.component);

        if(typeof todos[index + 1] !== 'undefined' && !Tab.shift) {
            Tab.component.EditInput.Dom.InputInFocus = false;

            Tab.component.EditInput.SyncEvent.RemoveEvent('click');
            Tab.component.EditInput.SyncEvent.RemoveEvent('keyup');

            todos[index + 1].EditInput.Switch();

        }
        if(typeof todos[index + -1] !== 'undefined' && Tab.shift) {
            Tab.component.EditInput.Dom.InputInFocus = false;

            Tab.component.EditInput.SyncEvent.RemoveEvent('click');
            Tab.component.EditInput.SyncEvent.RemoveEvent('keyup');

            todos[index + -1].EditInput.Switch();
        }
    }

    /**
     *
     * @param event
     * @constructor
     */
    ListenToESC(event) {
        switch (event.keyCode) {
            case 27:
                this.CloseDetail();
                break;
        }
    }

    /**
     *
     * @constructor
     */
    CloseDetail() {
        this.todo.SetTodo(null);
        this.modals.TriggerOverlay();

        this.syncEvent.RemoveEvent('keyup');
    }
}
