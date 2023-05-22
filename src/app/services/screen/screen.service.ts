import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ScreenService {
  width$: Observable<number>;
  heigth$: Observable<number>;

  constructor() {
    this.width$ = fromEvent(window, 'resize').pipe(
      map(event => (event.target as Window).innerWidth),
      startWith(window.innerWidth)
    );
    this.heigth$ = fromEvent(window, 'resize').pipe(
      map(event => (event.target as Window).innerHeight),
      startWith(window.innerHeight)
    );
  }
}
