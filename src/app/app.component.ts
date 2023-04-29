import { Component } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AppIntroType } from './app-intro/app-intro-type';
import { ClickMode, Container, Engine, HoverMode, ISourceOptions, MoveDirection, OutMode } from 'tsparticles-engine';
import { particlesOptions } from './login/particles-config';
import { loadFull } from 'tsparticles';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'KingOfChess';
  introAnimationComplete: boolean = false;
  introExitComplete: boolean = false;
  animationType = AppIntroType;

  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.matIconRegistry.addSvgIcon(
      'google',
      this.domSanitizer.bypassSecurityTrustResourceUrl('https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg')
    );
  }
}
