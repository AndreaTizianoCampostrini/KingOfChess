import { Component, HostBinding, HostListener } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AppIntroType } from './components/app-intro/app-intro-type';
import { Subscription } from 'rxjs';
import { AppIntroService } from './services/app-intro/appintro.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'KingOfChess';
  private subscription: Subscription;
  introAnimationComplete: boolean = false;
  introExitComplete: boolean = false;
  animationType = AppIntroType;
  isMobile: boolean;

  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer, private introService: AppIntroService) {
    this.subscription = new Subscription();

    if (window.matchMedia("(pointer:fine)").matches) {
      this.isMobile = false;
    } else {
      this.isMobile = true;
    }

    this.matIconRegistry.addSvgIcon(
      'google',
      this.domSanitizer.bypassSecurityTrustResourceUrl('https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg')
    );
  }
  ngOnInit(): void {
    this.subscription.add(this.introService.animationComplete$.subscribe(() => {
      this.introAnimationComplete = true;
    }));

    this.subscription.add(this.introService.introComplete$.subscribe(() => {
      this.introExitComplete = true;
    }));

    if (window.matchMedia("(pointer:fine)").matches) {
      this.isMobile = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (window.matchMedia("(pointer:fine)").matches) {
      this.isMobile = false;
    } else {
      this.isMobile = true;
    }
  }

  @HostBinding('style.cursor')
  get cursorStyle() {
    return this.isMobile ? 'default' : 'none !important';
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
