import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../services/authentication.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

    Form: FormGroup;

    constructor(private fb: FormBuilder, private authentication: AuthenticationService, private router: Router) {
    }

    /**
     *
     */
    ngOnInit() {
        this.Form = this.fb.group({
            Username: ['', Validators.required],
            Password: ['', Validators.required],
            FirstName: ['', Validators.required],
            LastName: ['', Validators.required],
            Street: ['', Validators.required],
            Postal: ['', Validators.required]
        });
    }

    /**
     *
     * @param {NgForm} f
     * @returns {Promise<void>}
     * @constructor
     */
    async Register(f: NgForm) {
        await this.authentication.Register(f);

        this.router.navigate(['/']);
    }
}
