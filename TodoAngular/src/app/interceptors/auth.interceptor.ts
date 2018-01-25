import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from '../modules/authentication/services/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private injector: Injector) {}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authentication = this.injector.get(AuthenticationService);
        const token = authentication.Token;

        if (token !== null && req.headers.get('Authorization') === null) {
            req = req.clone({headers: req.headers.set('Authorization', `Bearer ${token}`)});
        }

        if(req.headers.get('Content-Type') === null) {
            req = req.clone({
                setHeaders: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'Accept': 'application/json',
                }
            });
        }

        return next.handle(req);
    }
}
