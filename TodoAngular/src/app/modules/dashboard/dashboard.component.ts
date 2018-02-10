import {Component, OnInit}                   from '@angular/core';
import {AuthenticationService}               from '../authentication/services/authentication.service';
import {Router}                              from '@angular/router';
import {animate, style, transition, trigger} from '@angular/animations';
import {TodoEmitables, TodoService}          from './components/todo-detail/services/todo.service';
import {SubscriberComponent}                 from '../../shared/abstract/subsciber-component.abstract';
import {Subject}                             from 'rxjs/Subject';
import {WebSocketService}                    from '../../shared/services/websocket.service';
import {SOCKET_CLIENT}                       from '../../utils/api';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    animations: [
        trigger('fromRight', [
            transition(':enter', [
                style({
                    position: 'fixed',
                    overflow: 'hidden',
                    width: '400px',
                    transform: 'translateX(100%)',
                }),
                animate('600ms cubic-bezier(0.19, 1, 0.22, 1)', style({
                    position: 'fixed',
                    width: '400px',
                    overflow: 'hidden',
                    transform: 'translateX(0)'
                }))
            ]),
            transition(':leave', [
                style({
                    position: 'fixed',
                    width: '400px',
                    overflow: 'hidden',
                    transform: 'translateX(0)',
                }),
                animate('600ms cubic-bezier(0.19, 1, 0.22, 1)', style({
                    position: 'fixed',
                    overflow: 'hidden',
                    width: '400px',
                    transform: 'translateX(100%)'
                }))
            ])
        ]),
    ],
})
export class DashboardComponent extends SubscriberComponent<TodoEmitables> implements OnInit {

    List: { Id: string, Name: string } = null;
    User: any = {};

    private ws: Subject<any>;

    constructor(private authentication: AuthenticationService,
                private router: Router,
                private todo: TodoService,
                private websocket: WebSocketService) {

        // We need to subscribe (only on this service here) so we can show the details
        // only when one is selected.
        super(todo);
    }

    ngOnInit() {
        this.User = this.authentication.User;

        this.InitSocket();
    }

    /**
     *
     * @constructor
     */
    InitSocket() {
        this.ws = <Subject<any>>this.websocket.Connect(`${SOCKET_CLIENT}ws`);

        /**
         *
         */
        this.ws.subscribe((response: any) => {
            const data = JSON.parse(response.data);

            /**
             * WebSocket service knows which action needs to be -
             * fired. Send data to that service. Keeps this component clean ;)
             */
            this.websocket.DetermineAction(data, this.ws);
        }, () => {
            setTimeout(() => {
                this.InitSocket();
            }, 1000);
        }, () => {
            this.InitSocket();
        });
    }

    /**
     *
     * @constructor
     */
    SelectList(List: { Id: string, Name: string } | null) {
        this.List = List;
    }

    /**
     *
     * @constructor
     */
    Logout() {
        this.authentication.Token = '';
        this.router.navigate(['authentication/login']);
    }
}
