import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { gsap } from 'gsap';

@Injectable({
  providedIn: 'root'
})
export class CursorService {

  // Observable per cambiare l'immagine del cursore
  private cursorImageSubject = new Subject<string>();
  cursorImage$ = this.cursorImageSubject.asObservable();

  // Observable per animare il click
  private clickAnimationSubject = new Subject<{ x: number, y: number }>();
  clickAnimation$ = this.clickAnimationSubject.asObservable();

  constructor() { }

  changeCursor(imageUrl: string) {
    this.cursorImageSubject.next(imageUrl);
  }

  animateClick(x: number, y: number) {
    this.clickAnimationSubject.next({ x, y });
  }

  // Funzione per creare l'animazione di click
  clickAnimation(element: any) {
    gsap.to(element, {
      scale: 2,
      opacity: 0,
      duration: 0.5,
      ease: "power2.out",
      onComplete: () => this.cleanupAnimation(element)
    });
  }

  // Funzione per rimuovere l'elemento animato
  cleanupAnimation(element: any) {
    element.parentNode.removeChild(element);
  }

  addClassToCursor(element: any, className: string) {
    element.classList.add(className);
  }

  removeClassFromCursor(element: any, className: string) {
    element.classList.remove(className);
  }
}
