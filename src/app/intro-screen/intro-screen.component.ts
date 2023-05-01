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
    this.cursorService.changeCursor('../../assets/cursor-small-hover.png');
  }

  onMouseLeave() {
    this.cursorService.changeCursor('../../assets/cursor-small.png');
  }

  ngOnDestroy() {
    this.cursorService.changeCursor('../../assets/cursor-small.png');
  }
}
