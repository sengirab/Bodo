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
        Lists: []
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
        this.Emitables.Lists = (<any[]>await this.http.get(`${API_CLIENT}lists`, {headers: PrepareHeaders(this.authentication.Token)}).toPromise());
        this.Emit(this.Emitables, 'Lists')
    }

    /**
     *
     * @returns {Promise<void>}
     * @constructor
     * @param List
     */
    async AddList(List: NgForm) {
        await this.http.post(`${API_CLIENT}lists`, List.value, {headers: PrepareHeaders(this.authentication.Token)}).toPromise();

        await this.GetLists();
    }

    /**
     *
     * @param {string} Id
     * @returns {Promise<void>}
     * @constructor
     */
    async DeleteList(Id: string) {
        await this.http.delete(`${API_CLIENT}lists/${Id}`, {headers: PrepareHeaders(this.authentication.Token)}).toPromise();

        this.Emitables.Lists = this.Emitables.Lists.filter((l) => l.Id !== Id);
        this.Emit(this.Emitables, 'Lists')
    }
}
