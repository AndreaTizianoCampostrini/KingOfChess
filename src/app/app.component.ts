import { Component, HostBinding, HostListener } from '@angular/core';
import { AppIntroType } from './components/app-intro/app-intro-type';
import { Subscription } from 'rxjs';
import { AppIntroService } from './services/app-intro/appintro.service';
import { DeviceDetectorService } from 'ngx-device-detector';
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
    private authService: AuthService,
    private introService: AppIntroService,
    private deviceService: DeviceDetectorService
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
    const json = localStorage.getItem('user');
    if (json != null) {
      const user = JSON.parse(json);
      //try del login o del renew
      this.authService.createUser(
        user.email,
        user.uid,
        user.token,
        user.refreshToken,
        user.expirationTime
      );
      this.authService.setLoggedIn(true);
      console.log('qua ');
      console.log(this.authService.isLoggedIn$)
    }
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
