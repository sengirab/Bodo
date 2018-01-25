import {Component, OnInit}                   from '@angular/core';
import {AuthenticationService}               from '../authentication/services/authentication.service';
import {Router}                              from '@angular/router';
import {animate, style, transition, trigger} from '@angular/animations';
import {TodoEmitables, TodoService}          from './components/todo-detail/services/todo.service';
import {SubscriberComponent}                 from '../../shared/abstract/subsciber-component.abstract';
import {NotificationService}                 from '../../components/notifications/service/notification.service';
import {StatusOptions}                       from '../../utils/status';
import {PlatformNotification}                from '../../components/notifications/notification';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    animations: [
        trigger('fromRight', [
            transition(':enter', [
                style({
                    position: 'fixed',
                    overflow: 'hidden',
                    width: '25%',
                    transform: 'translateX(100%)',
                }),
                animate('600ms cubic-bezier(0.19, 1, 0.22, 1)', style({
                    position: 'fixed',
                    width: '25%',
                    overflow: 'hidden',
                    transform: 'translateX(0)'
                }))
            ]),
            transition(':leave', [
                style({
                    position: 'fixed',
                    width: '25%',
                    overflow: 'hidden',
                    transform: 'translateX(0)',
                }),
                animate('600ms cubic-bezier(0.19, 1, 0.22, 1)', style({
                    position: 'fixed',
                    overflow: 'hidden',
                    width: '25%',
                    transform: 'translateX(100%)'
                }))
            ])
        ]),
    ],
})
export class DashboardComponent extends SubscriberComponent<TodoEmitables> implements OnInit {

    List: { Id: string, Name: string } = null;
    User: any = {};

    constructor(private authentication: AuthenticationService,
                private router: Router,
                private todo: TodoService) {

        // We need to subscribe (only on this service here) so we can show the details
        // only when one is selected.
        super(todo);
    }

    ngOnInit() {
        this.User = this.authentication.User;
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
