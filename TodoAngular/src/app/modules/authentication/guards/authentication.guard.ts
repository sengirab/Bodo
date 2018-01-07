import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthenticationService} from '../services/authentication.service';

@Injectable()
export class AuthenticationGuard implements CanActivate {

    constructor(private authentication: AuthenticationService,
                private router: Router) {
    }

    async canActivate(route: ActivatedRouteSnapshot,
                      state: RouterStateSnapshot): Promise<boolean> {

        const path = route.routeConfig.path;
        const authenticated = await this.authentication.Validate();

        if (authenticated && path == 'authentication') {
            this.router.navigate(['/']);
            return false;
        }

        if (!authenticated && path != 'authentication') {
            this.router.navigate(['/authentication/login']);
            return false;
        }

        return true;
    }
}
