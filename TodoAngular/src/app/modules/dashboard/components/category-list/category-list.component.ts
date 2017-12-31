import {Component, EventEmitter, Output} from '@angular/core';
import {ListEmitables, ListsService} from '../../services/lists.service';
import {SubscriberComponent} from '../../../../shared/abstract/subsciber-component.abstract';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';

@Component({
    selector: 'app-category-list',
    templateUrl: './category-list.component.html',
})
export class CategoryListComponent extends SubscriberComponent<ListEmitables> {

    @Output('selected') CategorySelected: EventEmitter<{Id: string, Name: string}> = new EventEmitter<{Id: string, Name: string}>();

    Form: FormGroup;

    constructor(private lists: ListsService, private form: FormBuilder) {
        super(lists);
    }

    /**
     *
     */
    async ngOnInit() {
        super.ngOnInit();

        this.Form = this.form.group({
            Name: ['', Validators.required],
            UserId: '3fcadfa1-0716-4a75-9e61-be38b89f80ba',
        });

        await this.lists.GetLists('3fcadfa1-0716-4a75-9e61-be38b89f80ba');

        if(this.Fillables.Lists.length > 0) {
           this.SelectCategory(this.Fillables.Lists[0].Id, this.Fillables.Lists[0].Name)
        }
    }

    /**
     *
     * @param {NgForm} f
     * @returns {Promise<void>}
     * @constructor
     */
    async AddList(f: NgForm) {
        await this.lists.AddList(f);

        this.Form.controls['Name'].reset();
    }

    /**
     *
     * @param {string} Id
     * @returns {Promise<void>}
     * @constructor
     */
    async DeleteList(Id: string) {
        await this.lists.DeleteList(Id);

        if(this.Fillables.Lists.length == 0) {
            this.SelectCategory('', '', true);
            return;
        }

        this.SelectCategory(this.Fillables.Lists[0].Id, this.Fillables.Lists[0].Name);
    }

    /**
     *
     * @param {string} Id
     * @param Name
     * @param EmitNull
     * @constructor
     */
    SelectCategory(Id: string, Name: string, EmitNull: boolean = false) {
        if(EmitNull) {
            this.CategorySelected.emit(null);
            return;
        }

        this.CategorySelected.emit({Id, Name})
    }
}
