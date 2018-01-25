import {Component, OnInit}              from '@angular/core';
import {FormBuilder, FormGroup, NgForm} from '@angular/forms';
import {AuthenticationService}          from '../../services/authentication.service';
import {ActivatedRoute, Router}         from '@angular/router';
import {ListsService}                   from '../../../dashboard/services/lists.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

    Form: FormGroup;

    constructor(private fb: FormBuilder,
                private authentication: AuthenticationService,
                private lists: ListsService,
                private router: Router,
                private route: ActivatedRoute) {
    }

    /**
     *
     */
    ngOnInit() {
        this.Form = this.fb.group({
            Username: '',
            Password: '',
        });
    }

    /**
     *
     * @param {NgForm} f
     * @returns {Promise<void>}
     * @constructor
     */
    async Login(f: NgForm) {
        await this.authentication.Login(f);

        if(typeof this.route.snapshot.queryParams['list'] !== 'undefined') {
            await this.lists.AcceptInvitation(this.route.snapshot.queryParams['list'])
        }

        this.router.navigate(['/']);
    }
}
