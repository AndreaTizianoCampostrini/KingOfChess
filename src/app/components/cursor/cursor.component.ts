import {
  Component,
  OnInit,
  ElementRef,
  Renderer2,
  HostListener,
} from '@angular/core';
import { CursorService } from 'src/app/services/cursor/cursor.service';

@Component({
  selector: 'app-cursor',
  templateUrl: './cursor.component.html',
  styleUrls: ['./cursor.component.css'],
})
export class CursorComponent implements OnInit {
  cursorImage: string = 'assets/cursor-white.png'; // Immagine di default del cursore
  cursorPos: { x: number; y: number } = { x: 0, y: 0 }; // Posizione del cursore
  private lastScrollX: number = window.pageXOffset;
  private lastScrollY: number = window.pageYOffset;

  constructor(
    private cursorService: CursorService,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const x = event.clientX + window.pageXOffset;
    const y = event.clientY + window.pageYOffset;

    if (this.isCursorInsideDocument(x, y)) {
      this.cursorPos = { x: x, y: y };
    }
  }

  private isCursorInsideDocument(x: number, y: number): boolean {
    //page height
    const documentWidth = document.documentElement.scrollWidth;
    const documentHeight = document.documentElement.scrollHeight;

    return x >= 0 && x <= documentWidth && y >= 0 && y <= documentHeight;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Calcola la differenza di scroll rispetto all'ultimo scroll
    const deltaX = window.pageXOffset - this.lastScrollX;
    const deltaY = window.pageYOffset - this.lastScrollY;

    // Aggiorna la posizione del cursore
    this.cursorPos.x += deltaX;
    this.cursorPos.y += deltaY;

    // Aggiorna la posizione dello scroll
    this.lastScrollX = window.pageXOffset;
    this.lastScrollY = window.pageYOffset;
  }


  @HostListener('document:click', ['$event'])
  onMouseClick(event: MouseEvent) {
    this.cursorService.animateClick(
      event.clientX + window.pageXOffset,
      event.clientY + window.pageYOffset
    );
  }

  ngOnInit(): void {
    this.cursorService.cursorImage$.subscribe((imageUrl) => {
      this.cursorImage = imageUrl;
    });
    this.cursorService.clickAnimation$.subscribe((pos) => {
      const clickEffect = this.renderer.createElement('span');
      this.renderer.addClass(clickEffect, 'click-effect');
      this.renderer.setStyle(clickEffect, 'left', pos.x - 6 + 'px');
      this.renderer.setStyle(clickEffect, 'top', pos.y - 10 + 'px');
      this.renderer.appendChild(this.el.nativeElement, clickEffect);
      this.cursorService.clickAnimation(clickEffect);
    });
  }
}
