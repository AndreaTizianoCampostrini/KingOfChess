import { Component, ViewChild } from '@angular/core';
import {
  NgxChessBoardModule,
  NgxChessBoardService,
  NgxChessBoardView,
} from 'ngx-chess-board';
import { ChessService } from 'src/app/services/chess/chess.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { AuthService } from 'src/app/auth/auth.service';
import { ScreenService } from 'src/app/services/screen/screen.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-daily',
  templateUrl: './daily.component.html',
  styleUrls: ['./daily.component.css'],
})
export class DailyComponent {
  @ViewChild('board', { static: false }) board!: NgxChessBoardView;
  @ViewChild(SidebarComponent) sidebar: SidebarComponent = new SidebarComponent(
    this.authService,
    this.router,
    this.screenService
  );
  mobile: boolean;
  solution = [];
  subscription: Subscription;
  size = 400;
  dark: boolean = false;
  light: boolean = true;
  move: number = 0;
  ended: boolean = true;
  win: boolean | null = null;
  initPgn: string = '';

  constructor(
    public ngxChessBoardService: NgxChessBoardService,
    private chessService: ChessService,
    public authService: AuthService,
    private screenService: ScreenService,
    public router: Router
  ) {
    this.subscription = new Subscription();
    this.mobile = false;
    this.chessService.getDailyPuzzle().subscribe(
      (data) => {
        this.board.setPGN(data.game.pgn);
        this.initPgn = data.game.pgn;
        if (
          this.board.getMoveHistory()[this.board.getMoveHistory().length - 1]
            .color != 'black'
        ) {
          this.board.reverse();
          this.dark = false;
          this.light = true;
        } else {
          this.dark = true;
          this.light = false;
        }
        this.solution = data.puzzle.solution;
        this.ended = false;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  ngOnInit(): void {
    this.subscription = this.screenService.width$.subscribe((width: number) => {
      this.mobile = width < 490;
      if (this.mobile) {
        this.size = width * 0.7;
      }
      this.size = width * 0.4;
    });
  }

  onMove(event: any) {
    if (!this.ended) {
      if (
        (event.color == 'black' && this.light) ||
        (event.color == 'white' && this.dark)
      ) {
        console.log(this.solution[this.move]);
        console.log(event.move);
        if (event.move == this.solution[this.move]) {
          this.move++;
          console.log('si');

          if (this.move == this.solution.length) {
            console.log('si');
            this.ended = true;
            this.win = true;
          }
        } else {
          console.log('no');
          this.ended = true;
          this.win = false;
        }
      }
    }
  }
  resetGame() {
    this.board.reset();
    if (this.initPgn != '') {
      this.board.setPGN(this.initPgn);
      if (
        this.board.getMoveHistory()[this.board.getMoveHistory().length - 1]
          .color != 'black'
      ) {
        this.board.reverse();
        this.dark = false;
        this.light = true;
      } else {
        this.dark = true;
        this.light = false;
      }
      this.ended = false;
    }
  }
}
