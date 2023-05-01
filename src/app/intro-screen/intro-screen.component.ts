import { Component, HostListener, OnDestroy } from '@angular/core';
import { CursorService } from '../cursor.service';

@Component({
  selector: 'app-intro-screen',
  templateUrl: './intro-screen.component.html',
  styleUrls: ['./intro-screen.component.css']
})
export class IntroScreenComponent implements OnDestroy {

  constructor(private cursorService: CursorService){
  }

  onMouseEnter() {
    this.cursorService.addClassToCursor(document.querySelector('.cursor'), 'cursor-hover');
    this.cursorService.changeCursor('../../assets/cursor-black.png');
  }

  onMouseLeave() {
    this.cursorService.removeClassFromCursor(document.querySelector('.cursor'), 'cursor-hover');
    this.cursorService.changeCursor('../../assets/cursor-white.png');
  }

  ngOnDestroy() {
    this.cursorService.removeClassFromCursor(document.querySelector('.cursor'), 'cursor-hover');
    this.cursorService.changeCursor('../../assets/cursor-white.png');
  }
}
