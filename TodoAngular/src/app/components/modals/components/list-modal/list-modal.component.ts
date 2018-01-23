import {Component, Injector, OnInit} from '@angular/core';
import {ModalsService} from '../../service/modals.service';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {ListsService} from '../../../../modules/dashboard/services/lists.service';

@Component({
    selector: 'app-list-modal',
    templateUrl: './list-modal.component.html',
})
export class ListModalComponent implements OnInit {

    List: any = {};
    Members: any[] = [];
    EForm: FormGroup;
    IForm: FormGroup;

    // Callbacks
    Deleted: () => void;

    constructor(private injector: Injector,
                private modals: ModalsService,
                private form: FormBuilder,
                private lists: ListsService) {
    }

    /**
     *
     */
    async ngOnInit() {
        this.List = this.injector.get(this.modals.CurrentTokens['List']);
        this.Deleted = this.injector.get(this.modals.CurrentTokens['Deleted']);

        this.EForm = this.form.group({
            Name: [this.List.Name, Validators.required],
        });
        this.IForm = this.form.group({
            Emails: ['', Validators.required],
        });

        this.Members = <any>await this.lists.GetListUsers(this.List.Id);
    }

    /**
     *
     * @param {NgForm} f
     * @constructor
     */
    EditList(f: NgForm) {

    }

    async InviteMembers(f: NgForm) {
        let members = f.value.Emails.split(",");

        members = members.map(m => {
            return {
                Email: m.trim(),
                ListId: this.List.Id
            }
        });

        await this.lists.InviteMembers(members);
        this.modals.RemoveModal()
    }

    /**
     *
     * @param {string} Id
     * @returns {Promise<void>}
     * @constructor
     */
    async DeleteList(Id: string) {
        await this.lists.DeleteList(Id);

        // If list is deleted we need to switch to another list.
        // We need to do this from within the caller that holds the list.
        this.Deleted();
    }
}
