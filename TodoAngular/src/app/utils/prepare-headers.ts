import {HttpHeaders} from "@angular/common/http";

export function PrepareHeaders(token?): HttpHeaders {
    let headerObj = {};

    headerObj['Content-Type'] = 'application/json';
    headerObj['Accept'] = 'application/json';

    if (typeof token !== 'undefined') headerObj['Authorization'] = `Bearer ${token}`;

    return new HttpHeaders(headerObj);
}
