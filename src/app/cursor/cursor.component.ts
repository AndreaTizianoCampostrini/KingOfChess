import { Component, OnInit, ElementRef, Renderer2, HostListener } from '@angular/core';
import { CursorService } from '../cursor.service';

@Component({
  selector: 'app-cursor',
  templateUrl: './cursor.component.html',
  styleUrls: ['./cursor.component.css']
})
export class CursorComponent implements OnInit {

  cursorImage: string = '../../assets/cursor-white.png'; // Immagine di default del cursore
  cursorPos: { x: number, y: number } = { x: 0, y: 0 }; // Posizione del cursore

  constructor(private cursorService: CursorService, private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.cursorService.cursorImage$.subscribe(imageUrl => {
      this.cursorImage = imageUrl;
    });

    this.cursorService.clickAnimation$.subscribe(pos => {
      const clickEffect = this.renderer.createElement('span');
      this.renderer.addClass(clickEffect, 'click-effect');
      this.renderer.setStyle(clickEffect, 'left', (pos.x  - 6) + 'px');
      this.renderer.setStyle(clickEffect, 'top', (pos.y - 10) + 'px');
      this.renderer.appendChild(this.el.nativeElement, clickEffect);

      this.cursorService.clickAnimation(clickEffect);
    });
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.cursorPos = { x: event.clientX, y: event.clientY };
  }

  @HostListener('document:click', ['$event'])
  onMouseClick(event: MouseEvent) {
    this.cursorService.animateClick(event.clientX, event.clientY);
  }
}
