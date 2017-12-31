import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EmitableService} from '../../../shared/utils/classes/emitable-service.class';
import {NgForm} from '@angular/forms';

export interface ListEmitables {
    Lists: any[]
}

@Injectable()
export class ListsService extends EmitableService {

    Emitables = {
        Lists: []
    };

    constructor(private http: HttpClient) {
        super();
    }

    /**
     *
     * @param {string} UserId
     * @returns {Observable<Object>}
     * @constructor
     */
    async GetLists(UserId: string) {
        this.Emitables.Lists = (<any[]>await this.http.get(`http://localhost:8080/v1/lists/${UserId}`).toPromise());
        this.Emit(this.Emitables, 'Lists')
    }

    /**
     *
     * @returns {Promise<void>}
     * @constructor
     * @param List
     */
    async AddList(List: NgForm) {
        await this.http.post(`http://localhost:8080/v1/lists`, List.value).toPromise();

        await this.GetLists('3fcadfa1-0716-4a75-9e61-be38b89f80ba');
    }

    /**
     *
     * @param {string} Id
     * @returns {Promise<void>}
     * @constructor
     */
    async DeleteList(Id: string) {
        await this.http.delete(`http://localhost:8080/v1/lists/${Id}`).toPromise();

        this.Emitables.Lists = this.Emitables.Lists.filter((l) => l.Id !== Id);
        this.Emit(this.Emitables, 'Lists')
    }
}
