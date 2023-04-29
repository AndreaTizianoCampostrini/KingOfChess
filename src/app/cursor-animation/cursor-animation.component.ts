import { Component, HostListener, ElementRef } from '@angular/core';

@Component({
  selector: 'app-cursor-animation',
  templateUrl: './cursor-animation.component.html',
  styleUrls: ['./cursor-animation.component.css']
})
export class CursorAnimationComponent {

  top: string = '';
  left: string = '';
  display: string = 'none';

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    // Posiziona l'animazione dove è avvenuto il clic
    this.left = (event.pageX - 11) + 'px'; // -25 per allineare il centro dell'animazione con il cursore
    this.top = (event.pageY - 12.5) + 'px';

    // Mostra l'animazione
    this.display = 'block';

    // Nascondi l'animazione dopo l'animazione
    setTimeout(() => {
      this.display = 'none';
    }, 1000); // Questo dovrebbe corrispondere alla durata dell'animazione CSS
  }

  constructor(private elementRef: ElementRef) {}

}
