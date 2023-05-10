import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';
import { AppIntroType } from './app-intro-type';

@Component({
  selector: 'app-app-intro',
  templateUrl: './app-intro.component.html',
  styleUrls: ['./app-intro.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class AppIntroComponent implements OnInit {
  windowWidth: string;
  windowHeight: string;
  showIntro: boolean;
  opacityChange: number;
  transition: string;

  @Input() animationDuration: number = 0.5;
  @Input() duration: number = 3;
  @Input() animationType: AppIntroType = AppIntroType.SlideLeft;
  @Output() introExitComplete = new EventEmitter();
  @Output() introAnimationComplete = new EventEmitter();

  constructor() {
    this.showIntro = true;
    this.windowWidth = "0px";
    this.windowHeight = "0px";
    this.opacityChange = 1;
    this.transition = 'left 0.5s';
  }

  ngOnInit(): void {
    setTimeout(() => {
      let transitionStyle = '';

      switch (this.animationType) {
        case AppIntroType.SlideLeft:
          this.windowWidth = '-' + window.innerWidth + 'px';
          transitionStyle = 'left ' + this.animationDuration + 's';
          break;
        case AppIntroType.SlideRight:
          this.windowWidth = window.innerWidth + 'px';
          transitionStyle = 'left ' + this.animationDuration + 's';
          break;
        case AppIntroType.SlideUp:
          this.windowHeight = '-' + window.innerHeight + 'px';
          transitionStyle = 'top ' + this.animationDuration + 's';
          break;
        case AppIntroType.SlideDown:
          this.windowHeight = window.innerHeight + 'px';
          transitionStyle = 'top' + this.animationDuration + 's';
          break;
        case AppIntroType.FadeOut:
          this.opacityChange = 0;
          transitionStyle = 'opacity ' + this.animationDuration + 's';
          break;
        default:
          this.windowWidth = '-' + window.innerWidth + 'px';
          transitionStyle = 'left ' + this.animationDuration + 's';
          break;
      }

      this.transition = transitionStyle;
      this.introAnimationComplete.emit();
      setTimeout(() => {
        this.introExitComplete.emit();
        this.showIntro = false;
      }, this.animationDuration * 1000);
    }, this.duration * 1000);
  }
}
