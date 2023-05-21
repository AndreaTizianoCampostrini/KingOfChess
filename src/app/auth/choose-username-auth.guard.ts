import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root',
})
export class ChooseUsernameAuthGuard implements CanActivate {
  constructor(
    public afAuth: AngularFireAuth,
    public authService: AuthService,
    public router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): any {
    this.afAuth.authState.subscribe(async (user) => {
      if (user) {
        const data = await this.authService.getFirestoreUser(user.email ?? '');
        if (!data || !data['username']) {
          return true;
        } else {
          this.router.navigate(['/home']);
          return false;
        }
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    });
  }
}
