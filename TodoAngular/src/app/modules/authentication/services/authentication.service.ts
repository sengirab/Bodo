import {Injectable} from '@angular/core';
import {NgForm} from '@angular/forms';
import {HttpClient} from '@angular/common/http';

import {User} from '../../../models/user';
import {PrepareHeaders} from '../../../utils/prepare-headers';
import {API_AUTH, API_CLIENT} from '../../../utils/api';

@Injectable()
export class AuthenticationService {

    User: User;

    constructor(private http: HttpClient) {
    }

    get Token(): string {
        return localStorage.getItem('token');
    }

    set Token(value: string) {
        localStorage.setItem('token', value);
    }

    /**
     *
     * @param {NgForm} f
     * @returns {Promise<void>}
     * @constructor
     */
    async Login(f: NgForm) {
        let res = (<any>await this.http.post(`${API_AUTH}login`, f.value).toPromise());

        this.Token = res.Token;
    }

    /**
     *
     * @returns {Promise<void>}
     * @constructor
     */
    async Register() {

    }

    /**
     *
     * @returns {Promise<boolean>}
     * @constructor
     */
    async Validate() {
        try {
            this.User = (<User>await this.http.get(`${API_CLIENT}user/validate`, {headers: PrepareHeaders(this.Token)}).toPromise());

            return true
        } catch (err) {
            return false
        }
    }
}
