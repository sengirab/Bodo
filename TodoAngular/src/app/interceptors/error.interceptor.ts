import {Injectable}                                           from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';

import {NotificationService}  from '../components/notifications/service/notification.service';
import {PlatformNotification} from '../components/notifications/notification';
import {StatusOptions}        from '../utils/status';

import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/catch';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private notifications: NotificationService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).catch(error => {
            let message = '';
            switch (error.status) {
                case 500:
                case 400:
                    message = 'We did something wrong. Please try again in a while';
                    this.notifications.AddNotification(new PlatformNotification(message, StatusOptions.Error));
                    break;
                case 403:
                    message = 'We\'re very sorry sir, but you have done something wrong. Please try again.';
                    this.notifications.AddNotification(new PlatformNotification(message, StatusOptions.Error));
                    break;
                case 401:
                    if (req.url.includes('validate')) return;

                    message = 'We\'re very sorry sir, but you\'re not authorized to do this.';
                    this.notifications.AddNotification(new PlatformNotification(message, StatusOptions.Error));
                    break;
                default:
                    break;
            }

            return Observable.throw(error);
        });
    }
}
