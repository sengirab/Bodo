import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NgForm} from '@angular/forms';

import {EmitableService} from '../../../shared/utils/classes/emitable-service.class';
import {ListsService} from './lists.service';
import {API_CLIENT} from '../../../utils/api';
import {PrepareHeaders} from '../../../utils/prepare-headers';
import {AuthenticationService} from '../../authentication/services/authentication.service';

export interface TodosEmitables {
    Todos: any[];
    Completed: any[];
}

@Injectable()
export class TodosService extends EmitableService {

    Emitables: TodosEmitables = {
        Todos: [],
        Completed: []
    };

    constructor(private http: HttpClient, private lists: ListsService) {
        super();
    }

    // ------------------------------------------------- //
    // Functionality                                     //
    // ------------------------------------------------- //

    /**
     *
     * @param {string} ListId
     * @returns {Promise<void>}
     * @constructor
     */
    async GetTodos(ListId: string) {
        const Todos = (<any[]>await this.http.get(`${API_CLIENT}todos/${ListId}`).toPromise());

        if(Todos === null) {
            this.Emitables = TodosService.FillTodoLists([]);
        } else {
            this.Emitables = TodosService.FillTodoLists(Todos);
        }

        this.Emit(this.Emitables, 'Todos', 'Completed');
    }

    /**
     *
     * @returns {Observable<Object>}
     * @constructor
     */
    async AddTodo(Todo: NgForm) {
        const CreatedTodo = (<any>await this.http.post(`${API_CLIENT}todos`, Todo.value).toPromise());
        this.Emitables.Todos.unshift(CreatedTodo);

        this.Emit(this.Emitables, 'Todos');
        this.UpdateListCount(CreatedTodo.ListId, '+');
    }

    /**
     *
     * @param {string} TodoId
     * @param {boolean} Completed
     * @returns {Promise<void>}
     * @constructor
     */
    async CompleteTodo(TodoId: string, Completed: boolean) {
        const Todo = (<any>await this.http.post(`${API_CLIENT}todos/complete`, {TodoId, Completed}).toPromise());

        this.completeAndChangePosition(Todo);
        this.Emit(this.Emitables, 'Todos', 'Completed');
    }

    /**
     *
     * @returns {Promise<void>}
     * @constructor
     * @param Todo
     */
    async DeleteTodo(Todo: any) {
        await this.http.delete(`${API_CLIENT}todos/${Todo.Id}`).toPromise();
        this.deleteAndChangePosition(Todo);

        this.Emit(this.Emitables, 'Todos', 'Completed');
    }

    // ------------------------------------------------- //
    // Utils                                             //
    // ------------------------------------------------- //

    /**
     *
     * @param {string} Id
     * @param MustBe
     */
    UpdateListCount(Id: string, MustBe: "+" | "-") {
        this.lists.Emitables.Lists.map((l) => {
            if(l.Id != Id) {
                return l
            }

            if(MustBe === "+") {
                l.TodoCount++
            }
            if(MustBe === "-") {
                l.TodoCount--
            }

            return l

        });

        this.lists.Emit(this.lists.Emitables, 'Lists')
    }

    /**
     *
     * @constructor
     */
    ReplaceWithNew(Todo: any) {
        this.Emitables = Object.keys(this.Emitables).reduce((r, k): TodosEmitables => {
            r[k] = this.Emitables[k].map((t) => {
                if(t.Id === Todo.Id) {
                    t = Todo
                }

                return t
            });

            return r
        }, {Todos: [], Completed: []});

        this.Emit(this.Emitables, 'Todos', 'Completed');
    }

    /**
     *
     */
    private completeAndChangePosition(Todo: any) {
        if(Todo.Completed) {
            this.Emitables.Todos = this.Emitables.Todos.filter(t => t.Id != Todo.Id);
            this.Emitables.Completed.push(Todo);

            this.UpdateListCount(Todo.ListId, '-');
        }

        if(!Todo.Completed) {
            this.Emitables.Completed = this.Emitables.Completed.filter(t => t.Id != Todo.Id);
            this.Emitables.Todos.push(Todo);

            this.UpdateListCount(Todo.ListId, '+');
        }

        TodosService.SortTodoLists(this.Emitables, ['CreatedAt', 'CompletedAt'], 'Todos', 'Completed');
    }

    /**
     *
     */
    private deleteAndChangePosition(Todo: any) {
        if(Todo !== null) {

            if(Todo.Completed) {
                this.Emitables.Completed = this.Emitables.Completed.filter(t => t.Id != Todo.Id);

                return;
            }

            this.Emitables.Todos = this.Emitables.Todos.filter(t => t.Id != Todo.Id);
            this.UpdateListCount(Todo.ListId, '-');
        }
    }

    // ------------------------------------------------- //
    // Statics                                           //
    // ------------------------------------------------- //

    /**
     *
     * @param {any[]} Todos
     * @constructor
     */
    static FillTodoLists(Todos: any[]): TodosEmitables {
        let TodosObject: TodosEmitables = Todos.reduce((r, t) => {
            if (t.DeletedAt == null && !t.Completed) {
                r.Todos.push(t);
            }

            if(t.Completed && t.DeletedAt == null) {
                r.Completed.push(t);
            }

            return r;
        }, {Todos: [], Completed: []});

        TodosService.SortTodoLists(TodosObject, ['CreatedAt', 'CompletedAt'], 'Todos', 'Completed');

        return TodosObject;
    }

    /**
     *
     * @param {TodosEmitables} o
     * @param {string[]} sort
     * @param {string} lists
     * @returns {TodosEmitables}
     * @constructor
     */
    static SortTodoLists<T, K extends keyof T>(o: T, sort: string[], ...lists: K[]) {
        lists.forEach((k, i) => {

            (<any>o[k]).sort(function (a, b) {
                return new Date(b[sort[i]]).getTime() - new Date(a[sort[i]]).getTime();
            });
        })
    }
}
