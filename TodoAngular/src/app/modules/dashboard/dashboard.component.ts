import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../authentication/services/authentication.service';
import {Router} from '@angular/router';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {

    List: {Id: string, Name: string} = null;
    User: any = {};

    constructor(private authentication: AuthenticationService, private router: Router) {
    }

    ngOnInit() {
        this.User = this.authentication.User;
    }

    /**
     *
     * @constructor
     */
    SelectList(List: {Id: string, Name: string} | null) {
        this.List = List
    }

    /**
     *
     * @constructor
     */
    Logout() {
        this.authentication.Token = "";
        this.router.navigate(['authentication/login'])
    }
}
