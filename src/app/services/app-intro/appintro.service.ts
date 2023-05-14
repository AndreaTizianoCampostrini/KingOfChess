import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppIntroService {
  animationComplete$ = new ReplaySubject<void>();
  introComplete$ = new ReplaySubject<void>();
}

