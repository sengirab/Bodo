import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {EmitableService} from '../../../../../shared/utils/classes/emitable-service.class';
import {TodosService} from '../../../services/todos.service';
import {NgForm} from '@angular/forms';
import {API_CLIENT} from '../../../../../utils/api';
import {AuthenticationService} from '../../../../authentication/services/authentication.service';
import {PrepareHeaders} from '../../../../../utils/prepare-headers';

export interface TodoEmitables {
    Todo: any;
    Todos: any[];
    Completed: any[];
}

@Injectable()
export class TodoService extends EmitableService {

    Emitables: TodoEmitables = {
        Todo: null,
        Todos: [],
        Completed: []
    };

    constructor(private http: HttpClient, private todos: TodosService, private authentication: AuthenticationService) {
        super();
    }

    /**
     *
     * @constructor
     */
    SetTodo(Todo: any) {
        this.Emitables.Todo = Todo;
        this.Emitables.Todos = [];
        this.Emitables.Completed = [];

        if(Todo.Todos !== null) {
            const todos = TodosService.FillTodoLists(Todo.Todos);

            this.Emitables.Todos = todos.Todos;
            this.Emitables.Completed = todos.Completed;
        }

        this.Emit(this.Emitables, 'Todo', 'Todos', 'Completed');
    }

    /**
     *
     * @returns {Promise<void>}
     * @constructor
     */
    async UpdateTodo(Todo: any) {
        const PatchedTodo = <any>await this.http.patch(`${API_CLIENT}todos`, Todo, {headers: PrepareHeaders(this.authentication.Token)}).toPromise();

        this.Emitables.Todo = PatchedTodo;
        this.Emit(this.Emitables, 'Todo');

        this.todos.ReplaceWithNew(PatchedTodo)
    }

    /**
     *
     * @param {string} Id
     * @returns {Promise<void>}
     * @constructor
     */
    async DeleteTodo(Id: string) {
        await this.http.delete(`${API_CLIENT}todos/${Id}`, {headers: PrepareHeaders(this.authentication.Token)}).toPromise();

        let Todo: any = null;
        this.Emitables.Todos = this.Emitables.Todos.filter(t => {
            if(t.Id == Id) {
                Todo = t;
                return false
            }

            return true
        });

        this.deleteAndChangePosition(Todo, Id);
        this.Emit(this.Emitables, 'Todos', 'Completed');
    }

    /**
     *
     * @returns {Promise<void>}
     * @constructor
     */
    async AddChildTodo(Todo: NgForm) {
        const CreatedTodo = (<any>await this.http.post(`${API_CLIENT}todos`, Todo.value, {headers: PrepareHeaders(this.authentication.Token)}).toPromise());


        this.Emitables.Todos.unshift(CreatedTodo);

        this.Emit(this.Emitables, 'Todos');
        this.todos.ReplaceWithNew(this.Emitables.Todo)
    }

    /**
     *
     * @param {string} TodoId
     * @param {boolean} Completed
     * @returns {Promise<void>}
     * @constructor
     */
    async CompleteTodo(TodoId: string, Completed: boolean) {
        const Todo = (<any>await this.http.post(`${API_CLIENT}todos/complete`, {TodoId, Completed}, {headers: PrepareHeaders(this.authentication.Token)}).toPromise());

        this.completeAndChangePosition(Todo);

        this.Emit(this.Emitables, 'Todos', 'Completed');
    }

    // ------------------------------------------------- //
    // Utils                                             //
    // ------------------------------------------------- //

    /**
     *
     */
    private completeAndChangePosition(Todo: any) {
        if(Todo.Completed) {
            this.Emitables.Todos = this.Emitables.Todos.filter(t => t.Id != Todo.Id);
            this.Emitables.Completed.push(Todo);
        }

        if(!Todo.Completed) {
            this.Emitables.Completed = this.Emitables.Completed.filter(t => t.Id != Todo.Id);

            this.Emitables.Todos.push(Todo);

            TodosService.SortTodoLists(this.Emitables, ['CreatedAt', 'CreatedAt'], 'Todos', 'Completed');
        }
    }

    /**
     *
     */
    private deleteAndChangePosition(Todo: any, Id: string) {
        if(Todo == null) {
            this.Emitables.Completed = this.Emitables.Completed.filter(t => t.Id != Id);
            return
        }

        if(!Todo.Completed) {
            this.Emitables.Todos = this.Emitables.Todos.filter(t => t.Id != Todo.Id);
        }
    }
}
