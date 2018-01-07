import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, NgForm} from '@angular/forms';
import {AuthenticationService} from '../../services/authentication.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

    Form: FormGroup;

    constructor(private fb: FormBuilder, private authentication: AuthenticationService, private router: Router) {
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

        this.router.navigate(['/']);
    }
}
