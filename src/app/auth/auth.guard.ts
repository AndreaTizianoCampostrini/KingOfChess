import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, catchError, from, map, of } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  private jwtHelper = new JwtHelperService();


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return setTimeout(() => {
      return this.authService.isLoggedIn$.forEach((value) => {
        if (value) {
          return true;
        } else {
          return this.router.navigate(['login']);
        }
      });
    }, 500);
  }

  /*canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.checkTokenValidity();
  }

  private checkTokenValidity(): Observable<boolean> {
    const token = this.authService.user?.token;

    // Se il token non esiste, l'utente deve fare il login
    if (!token) {
      return of(false);
    }

    // Verifica se il token è scaduto
    const isTokenExpired = this.isTokenExpired(token);
    if (isTokenExpired) {
      // Se il token è scaduto, prova a rinnovarlo
      return from(this.authService.refreshToken()).pipe(
        map(() => true),
        catchError((error) => {
          console.error('Token refresh failed', error);
          return of(false);
        })
      );
    } else {
      // Se il token non è scaduto, permetti all'utente di accedere
      return of(true);
    }
  }

  private isTokenExpired(token: string): boolean {
    const expiryDate = this.jwtHelper.getTokenExpirationDate(token);
    if (!expiryDate) return true; // Se non esiste una data di scadenza, considera il token come scaduto
    return !(expiryDate.valueOf() > new Date().valueOf());
  }*/
}
