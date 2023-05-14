import { Component, OnInit, ViewChild } from '@angular/core';
import { particlesOptions } from './particles-config';
import { Container, Engine, ISourceOptions } from 'tsparticles-engine';
import { loadFull } from 'tsparticles';
import { AppIntroService } from 'src/app/services/app-intro/appintro.service';
import { Subscription } from 'rxjs';
import { NgxTypedJsComponent } from 'ngx-typed-js';
import {
  AnimationEvent,
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css'],
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          opacity: 1,
        })
      ),
      state(
        'closed',
        style({
          opacity: 0,
        })
      ),
      transition('closed => open', [animate('1s')]),
    ]),
  ],
})
export class NotFoundComponent implements OnInit {
  @ViewChild(NgxTypedJsComponent) typed: NgxTypedJsComponent =
    new NgxTypedJsComponent();
  private subscription: Subscription;
  particlesOptions: ISourceOptions = particlesOptions;
  showError: boolean = false;
  showMessage1: boolean = false;
  showMessage2: boolean = false;
  showReturnButton: boolean = false;
  showCursor: boolean = true;

  constructor(private introService: AppIntroService) {
    this.subscription = new Subscription();
  }

  /*----- Particles -----*/
  particlesLoaded(container: Container): void {
    console.log('particles loaded');
  }

  async particlesInit(engine: Engine): Promise<void> {
    await loadFull(engine);
  }

  ngOnInit(): void {
    this.subscription.add(
      this.introService.animationComplete$.subscribe(() => {
        setTimeout(() => {
          this.showError = true;
        }, 1000);
      })
    );

    this.subscription.add(this.introService.introComplete$.subscribe());
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  animationDone(event: AnimationEvent) {
    if (event.toState === 'open') {
      this.showMessage1 = true;
    }
  }

  hideCursor() {
    const cursorElement = document.querySelector('.typed-cursor')
    if (cursorElement) {
      cursorElement.remove();
    }
  }
}
