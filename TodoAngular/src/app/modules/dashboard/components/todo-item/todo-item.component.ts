import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-todo-item',
    templateUrl: './todo-item.component.html',
})
export class TodoItemComponent implements OnInit {

    @Output('deleted') DeleteEmitter: EventEmitter<string> = new EventEmitter<string>();
    @Output('completed') CompleteEmitter: EventEmitter<any> = new EventEmitter<any>();
    @Output('clicked') ClickedEmitter: EventEmitter<any> = new EventEmitter<any>();

    @Input('todo') Todo: any = null;

    constructor() {
    }

    /**
     *
     */
    ngOnInit() {

    }

    /**
     *
     * @constructor
     */
    Clicked() {
        this.ClickedEmitter.emit(this.Todo);
    }

    /**
     *
     * @constructor
     */
    Delete() {
        this.DeleteEmitter.emit(this.Todo.Id);
    }

    /**
     *
     * @constructor
     */
    Complete() {
        if (this.Todo.Completed) {
            this.CompleteEmitter.emit({TodoId: this.Todo.Id, Completed: false});
        }

        if (!this.Todo.Completed) {
            this.CompleteEmitter.emit({TodoId: this.Todo.Id, Completed: true});
        }
    }
}
