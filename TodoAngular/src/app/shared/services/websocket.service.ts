import {Injectable}            from '@angular/core';
import {Subject}               from 'rxjs/Subject';
import {Observer}              from 'rxjs/Observer';
import {Observable}            from 'rxjs/Observable';
import {SocketResponses}       from '../../utils/socket';
import {AuthenticationService} from '../../modules/authentication/services/authentication.service';

@Injectable()
export class WebSocketService {
    private socket: Subject<MessageEvent>;

    constructor(private authentication: AuthenticationService) {
    }

    /**
     *
     * @param url
     * @returns {Subject<MessageEvent>}
     * @constructor
     */
    Connect(url): Subject<MessageEvent> {
        this.socket = this._create(url);
        return this.socket;
    }

    /**
     *
     * @param data
     * @param ws
     * @constructor
     */
    DetermineAction(data: any, ws: Subject<any>) {
        console.log(data);

        switch (data.Type) {
            case SocketResponses.Identify:
                ws.next({Type: SocketResponses.Identify, Fields: {Token: this.authentication.Token}});
                break;
        }
    }

    /**
     *
     * @param url
     * @private
     */
    private _create(url): Subject<MessageEvent> {
        let ws = new WebSocket(url);

        let observable = Observable.create(
            (obs: Observer<MessageEvent>) => {
                ws.onmessage = obs.next.bind(obs);
                ws.onerror = obs.error.bind(obs);
                ws.onclose = obs.complete.bind(obs);
                /**
                 *
                 */
                return ws.close.bind(ws);
            }
        );
        let observer = {
            next: (data: Object) => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify(data));
                }
            },
        };

        /**
         *
         */
        return Subject.create(observer, observable);
    }
}
