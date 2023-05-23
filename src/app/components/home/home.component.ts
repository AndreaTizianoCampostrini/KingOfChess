import { Component, ViewChild } from '@angular/core';
import { NgxTypedJsComponent } from 'ngx-typed-js';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { ScreenService } from 'src/app/services/screen/screen.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  @ViewChild(SidebarComponent) sidebar: SidebarComponent = new SidebarComponent(
    this.authService,
    this.router,
    this.screenService
  );
  @ViewChild(NgxTypedJsComponent) typed: NgxTypedJsComponent =
    new NgxTypedJsComponent();
  private subscription: Subscription;
  mobile: boolean;
  cards = [
    {
      title: 'Puzzle rush',
      icon: '/assets/rush.png',
      description:
        "Puzzle Rush in chess is a fast-paced exercise of speed and tactical acumen, where you rapidly solve a series of chess puzzles that increase in difficulty within a time limit. It's a great tool to hone your chess skills.",
      roules: [
        'solve as many puzzles as you can!',
        'The puzzles start off easy and then progressively become more difficult',
        'Se sbagli tre problemi la tua Raffica finisce',
      ],
      route: '/rush',
    },
    {
      title: 'Daily puzzle',
      icon: '/assets/daily.png',
      description:
        'The "Daily Puzzle" mode in chess offers a unique and challenging chess puzzle every day. These puzzles represent specific board positions where players need to identify the best move or sequence of moves. It serves as a daily brain exercise and a consistent way to enhance one\'s tactical chess skills and overall game understanding.',
      route: '/daily',
    },
  ];
  gamemodeTexts = [
    'Chess is a centuries-old game, renowned for its strategic depth and its ability to challenge the human mind. Excelling requires a combination of tactical skills, strategic thinking, and problem-solving abilities. The site offers two main modes, "Puzzle Rush" and "Daily Puzzle", designed to help players develop these skills.',
    'Puzzle Rush provides a series of chess puzzles that increase in difficulty, testing your tactical skills under time pressure. This mode is ideal for honing quick thinking and the ability to make effective decisions rapidly.',
    'On the other hand, Daily Puzzle presents a unique chess puzzle each day. This allows for consistent mental exercise and a way to regularly improve your tactical skills, keeping your approach to the game fresh and presenting new challenges every day.',
    "Both of these modes are exceptional tools for players of all levels, from beginners to experts. They not only help improve tactical ability, but also enhance a general understanding of the game, from opening to endgame. And it's not just us saying this: even the greatest Grandmasters in the field of chess agree that regular practice through puzzles is one of the most effective methods to improve your chess skills.",
    'So, regardless of your skill level or experience in the game of chess, solving chess puzzles will aid you in progressing in your chess journey, improving your understanding of the game and your ability to think strategically and tactically.',
  ];

  constructor(
    public authService: AuthService,
    private screenService: ScreenService,
    public router: Router
  ) {
    this.subscription = new Subscription();
    this.mobile = false;
  }

  ngOnInit(): void {
    this.subscription = this.screenService.width$.subscribe((width: number) => {
      this.mobile = width < 420;
    });
  }

  logout() {
    this.authService.logout();
  }

  toggleMenu() {
    this.sidebar.sidebarExpanded = !this.sidebar.sidebarExpanded;
  }
}
