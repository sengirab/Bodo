import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EmitableService} from '../../../shared/utils/classes/emitable-service.class';
import {NgForm} from '@angular/forms';
import {API_CLIENT} from '../../../utils/api';
import {PrepareHeaders} from '../../../utils/prepare-headers';
import {AuthenticationService} from '../../authentication/services/authentication.service';

export interface ListEmitables {
    Lists: any[]
}

@Injectable()
export class ListsService extends EmitableService {

    Emitables = {
        Lists: [],
        Shared: null
    };

    constructor(private http: HttpClient, private authentication: AuthenticationService) {
        super();
    }

    /**
     *
     * @returns {Observable<Object>}
     * @constructor
     */
    async GetLists() {
        this.Emitables.Lists = (<any[]>await this.http.get(`${API_CLIENT}lists`).toPromise());
        this.Emit(this.Emitables, 'Lists')
    }

    /**
     *
     * @returns {Observable<Object>}
     * @constructor
     */
    async GetSharedLists() {
        this.Emitables.Shared = (<any[]>await this.http.get(`${API_CLIENT}lists/shared`).toPromise());
        this.Emit(this.Emitables, 'Shared')
    }

    /**
     *
     * @returns {Promise<void>}
     * @constructor
     * @param List
     */
    async AddList(List: NgForm) {
        await this.http.post(`${API_CLIENT}lists`, List.value).toPromise();

        await this.GetLists();
    }

    /**
     *
     * @param {string} Id
     * @returns {Promise<void>}
     * @constructor
     */
    async DeleteList(Id: string) {
        await this.http.delete(`${API_CLIENT}lists/${Id}`).toPromise();

        this.Emitables.Lists = this.Emitables.Lists.filter((l) => l.Id !== Id);
        this.Emit(this.Emitables, 'Lists')
    }

    /**
     *
     * @param {string[]} Members
     * @returns {Promise<void>}
     * @constructor
     */
    async InviteMembers(Members: string[]) {
        await this.http.post(`${API_CLIENT}lists/invite`, Members).toPromise();
    }

    /**
     *
     * @param {string[]} ListId
     * @returns {Promise<void>}
     * @constructor
     */
    async AcceptInvitation(ListId: string[]) {
        await this.http.post(`${API_CLIENT}lists/accept`, {ListId}).toPromise();
    }

    /**
     *
     * @returns {Observable<Object>}
     * @constructor
     */
    async GetListUsers(Id: string) {
        return this.http.get(`${API_CLIENT}lists/users/${Id}`).toPromise()
    }
}
