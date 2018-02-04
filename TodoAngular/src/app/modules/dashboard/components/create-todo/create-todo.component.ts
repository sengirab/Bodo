import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, NgForm, Validators}                      from '@angular/forms';

import {TodosService}      from '../../services/todos.service';
import {DateTimeComponent} from '../../../../shared/components/date-time.component';

@Component({
    selector: 'app-create-todo',
    templateUrl: './create-todo.component.html',
})
export class CreateTodoComponent implements OnInit, AfterViewInit, OnChanges {
    @ViewChild(DateTimeComponent) Picker: DateTimeComponent;
    @Input('list') List: { Id: string, Name: string } = null;

    Date: Date = null;
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

    ngAfterViewInit() {
    }

    /**
     *
     * @param {SimpleChanges} changes
     * @returns {Promise<void>}
     */
    async ngOnChanges(changes: SimpleChanges) {
        if ((changes['List'] && changes['List'].currentValue) && changes['List'].currentValue !== null) {
            this.List = changes['List'].currentValue;
            this.Name = '"' + this.List.Name + '"';
            this.Picker.Reset();

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
        if (this.Date !== null) {
            this.Form.addControl('CompleteAt', new FormControl(this.Date));
        }

        await this.todos.AddTodo(f);

        this.Form.reset();
        if (this.Date !== null) {
            this.Date = null;
        }

        this.Form.controls['ListId'].setValue(this.List.Id);
    }

    /**
     *
     * @constructor
     */
    OpenPicker() {
        this.Picker.OpenPicker();
    }
}
