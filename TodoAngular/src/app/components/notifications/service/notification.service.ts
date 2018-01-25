import {EventEmitter, Injectable} from '@angular/core';
import {PlatformNotification}     from '../notification';
import {Defined}                  from '../../../shared/utils/defined';

@Injectable()
export class NotificationService {

    Notifications: PlatformNotification[] = [];
    Listener: EventEmitter<PlatformNotification[]> = new EventEmitter();

    constructor() {
    }

    /**
     *
     * @param {PlatformNotification} Notification
     * @constructor
     */
    AddNotification(Notification: PlatformNotification) {
        Notification.message = Notification.message ? Notification.message : 'Whoops something went wrong!';

        let found = false;
        this.Notifications = (this.Notifications || []).map((ENotification: PlatformNotification) => {
            const [message, count] = ENotification.message.split(' (');

            if (Notification.message === message) {
                ENotification.message = message.concat(' (' + ((parseInt(Defined(count) ? count : '1') + 1)) + ')');
                found = true;
                return ENotification;
            }

            return ENotification;
        });


        if (!found) this.Notifications.unshift(Notification);
        this.Listener.emit(this.Notifications);
    }


    /**
     * removeNotification
     * @param notification
     */
    RemoveNotification(notification: PlatformNotification) {
        this.Notifications.splice(this.Notifications.indexOf(notification), 1);
    }
}
