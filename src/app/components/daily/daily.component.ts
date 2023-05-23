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
        console.log(data);
        this.board.setPGN(data.game.pgn);
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
      },
      (err) => {
        console.error(err);
      }
    );
  }

  ngOnInit(): void {
    this.subscription = this.screenService.width$.subscribe((width: number) => {
      this.mobile = width < 490;
      if(this.mobile) {
        this.size = width * 0.7;
      }
      this.size = width * 0.4;
    });
  }

  onMove(event: any) {
  }
  /*moveMade(e) {
    // e is an object { from: ..., to: ... }
    console.log(e);
    // The library doesn't handle game logic, you have to do it by yourself.
    this.chessGame.move(e);
    // Here you could implement AI logic based on the difficulty level
    // if it's AI's turn to move
    if (this.chessGame.turn() !== this.playerColor) {
      // compute AI's move and update chessGame
    }
  }*/
}
