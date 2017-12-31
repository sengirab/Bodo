import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';

import {TodosService} from '../../services/todos.service';

@Component({
    selector: 'app-create-todo',
    templateUrl: './create-todo.component.html',
})
export class CreateTodoComponent implements OnInit, OnChanges {

    @Input('list') List: {Id: string, Name: string} = null;

    Name: string = '';
    Form: FormGroup;

    constructor(private todos: TodosService, private form: FormBuilder) {
    }

    ngOnInit() {

        this.Form = this.form.group({
            Text: ['', Validators.required],
            ListId: this.List != null ? this.List.Id : '',
        });
    }

    /**
     *
     * @param {SimpleChanges} changes
     * @returns {Promise<void>}
     */
    async ngOnChanges(changes: SimpleChanges) {
        if((changes['List'] && changes['List'].currentValue) && changes['List'].currentValue !== null) {
            this.List = changes['List'].currentValue;
            this.Name = '"' + this.List.Name + '"';

            this.Form.controls['ListId'].setValue(this.List.Id);
        }
    }

    /**
     *
     * @param {NgForm} f
     * @returns {Promise<void>}
     * @constructor
     */
    async AddTodo(f: NgForm) {
        await this.todos.AddTodo(f);

        this.Form.controls['Text'].reset();
    }
}
