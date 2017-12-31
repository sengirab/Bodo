import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {EmitableService} from '../../../../../shared/utils/classes/emitable-service.class';
import {TodosService} from '../../../services/todos.service';
import {NgForm} from '@angular/forms';

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

    constructor(private http: HttpClient, private todos: TodosService) {
        super();
    }

    /**
     *
     * @constructor
     */
    SetTodo(Todo: any) {
        this.Emitables.Todo = Todo;

        if(Todo.Todos !== null) {
            const todos = TodosService.FillTodoLists(Todo.Todos);

            this.Emitables.Todos = todos.Todos;
            this.Emitables.Completed = todos.Completed;
        }

        this.Emit(this.Emitables, 'Todo');
    }

    /**
     *
     * @returns {Promise<void>}
     * @constructor
     */
    async UpdateTodo(Todo: any) {
        const PatchedTodo = <any>await this.http.patch(`http://localhost:8080/v1/todos`, Todo).toPromise();

        this.Emitables.Todo = PatchedTodo;
        this.Emit(this.Emitables, 'Todo');

        this.todos.ReplaceWithNew(PatchedTodo)
    }

    /**
     *
     * @returns {Promise<void>}
     * @constructor
     */
    async AddChildTodo(Todo: NgForm) {
        const CreatedTodo = (<any>await this.http.post('http://localhost:8080/v1/todos', Todo.value).toPromise());


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
        const Todo = (<any>await this.http.post('http://localhost:8080/v1/todos/complete', {TodoId, Completed}).toPromise());

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
}
