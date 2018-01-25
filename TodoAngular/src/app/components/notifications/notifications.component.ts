import {animate, style, transition, trigger} from '@angular/animations';
import {Component, OnDestroy, OnInit} from '@angular/core';

import {NotificationService} from "./service/notification.service";
import {PlatformNotification} from "./notification";
import {Subscription} from "rxjs/Subscription";

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    animations: [
        trigger('fromTop', [
            transition(':enter', [
                style({
                    position: 'absolute',
                    width: '100%',
                    top: -60
                }),
                animate('600ms cubic-bezier(0.19, 1, 0.22, 1)', style({
                    position: 'absolute',
                    width: '100%',
                    top: 0
                }))
            ]),
            transition(':leave', [
                style({
                    position: 'absolute',
                    width: '100%',
                    top: 0
                }),
                animate('600ms cubic-bezier(0.19, 1, 0.22, 1)', style({
                    position: 'absolute',
                    width: '100%',
                    top: -60
                }))
            ])
        ]),
    ]
})
export class NotificationsComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    public platformNotifications: PlatformNotification[];

    constructor(private notificationService: NotificationService) {
    }

    ngOnInit() {
        this.subscription = this.notificationService.Listener
            .subscribe((notifications: PlatformNotification[]) => {
                this.platformNotifications = notifications;
            })
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
