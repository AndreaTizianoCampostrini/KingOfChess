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
  @ViewChild(SidebarComponent) sidebar: SidebarComponent = new SidebarComponent(this.authService, this.router, this.screenService);
  @ViewChild(NgxTypedJsComponent) typed: NgxTypedJsComponent =
    new NgxTypedJsComponent();
  private subscription: Subscription;
  mobile: boolean;

  constructor(public authService: AuthService, private screenService: ScreenService, public router: Router) {
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
