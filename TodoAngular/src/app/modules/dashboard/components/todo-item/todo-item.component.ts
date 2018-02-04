import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {EditInputComponent}                                        from '../../../../shared/components/edit-input.component';

@Component({
    selector: 'app-todo-item',
    templateUrl: './todo-item.component.html',
})
export class TodoItemComponent implements OnInit {
    @ViewChild(EditInputComponent) EditInput: EditInputComponent;

    @Output('deleted') DeleteEmitter: EventEmitter<string> = new EventEmitter<string>();
    @Output('completed') CompleteEmitter: EventEmitter<any> = new EventEmitter<any>();
    @Output('clicked') ClickedEmitter: EventEmitter<any> = new EventEmitter<any>();
    @Output('edited') EditedEmitter: EventEmitter<any> = new EventEmitter<any>();

    // Navigation between todos
    @Output('next') NextEmitter: EventEmitter<any> = new EventEmitter<any>();

    @Input('todo') Todo: any = null;

    constructor() {
    }

    /**
     *
     */
    ngOnInit() {

    }

    EmitSelf(shift: boolean) {
        this.NextEmitter.emit({component: this, shift: shift})
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
     * @param {string} title
     * @constructor
     */
    Edited(title: string) {
        this.EditedEmitter.emit({...this.Todo, Text: title});
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
