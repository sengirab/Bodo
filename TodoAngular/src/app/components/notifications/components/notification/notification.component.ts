import {Component, Input, OnInit} from '@angular/core';

import {PlatformNotification} from '../../notification';
import {NotificationService}  from '../../service/notification.service';
import {Timer}                from '../../../../shared/utils/classes/timer.class';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
})
export class NotificationComponent implements OnInit {
    @Input() Notification: PlatformNotification;
    Timer: Timer;

    get timer() {
        return this.Timer;
    }

    constructor(public notification: NotificationService) {
    }

    /**
     *
     */
    ngOnInit() {
        this.Timer = new Timer(() => {
            this.notification.RemoveNotification(this.Notification);
        }, 3000);
    }

    /**
     *
     * @constructor
     */
    Close() {
        this.Timer = null;
        this.notification.RemoveNotification(this.Notification);
    }
}
