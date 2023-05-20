import { Component, HostBinding, HostListener } from '@angular/core';
import { AppIntroType } from './components/app-intro/app-intro-type';
import { Subscription } from 'rxjs';
import { AppIntroService } from './services/app-intro/appintro.service';
import { DeviceDetectorService } from 'ngx-device-detector';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'KingOfChess';
  private subscription: Subscription;
  introAnimationComplete: boolean = false;
  introExitComplete: boolean = false;
  animationType = AppIntroType;
  isMobile: boolean;

  constructor(
    public afAuth: AngularFireAuth,
    private authService: AuthService,
    private introService: AppIntroService,
    private deviceService: DeviceDetectorService,
    private router: Router
  ) {
    this.subscription = new Subscription();
    this.isMobile = this.deviceService.isMobile();
  }

  ngOnInit(): void {
    this.subscription.add(
      this.introService.animationComplete$.subscribe(() => {
        this.introAnimationComplete = true;
      })
    );

    this.subscription.add(
      this.introService.introComplete$.subscribe(() => {
        this.introExitComplete = true;
      })
    );

    this.afAuth.authState.subscribe(async (user) => {
      if (user) {// Se l'utente è loggato
        // Controlla se ha un username nel Firestore
        const data = await this.authService.getFirestoreUser(user.email ?? '');
        if (!data) {
          //se non esiste, l'utente non ha inserito l'usernmae, poichè si è loggato con un servizio
          this.router.navigate(['/register']);
        } else {
          //ricrea l'utente con i dati del firestore
          this.authService.createUser(
            data['email'],
            data['username'],
            data['uid'],
            data['password']
          );
        }
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = this.deviceService.isMobile();
  }

  @HostBinding('style.cursor')
  get cursorStyle() {
    return this.isMobile ? 'default' : 'none !important';
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
