import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ScreenService } from 'src/app/services/screen/screen.service';
import { Subscription } from 'rxjs';
import { IconName } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  sidebarExpanded: boolean = true;
  private subscription: Subscription;
  mobile: boolean;
  playSubMenu: boolean = false;
  playIcon: IconName = 'caret-up';

  constructor(
    private authService: AuthService,
    public router: Router,
    private screenService: ScreenService
  ) {
    this.subscription = new Subscription();
    this.mobile = false;
  }

  ngOnInit() {
    this.subscription = this.screenService.width$.subscribe((width: number) => {
      this.sidebarExpanded = width >= 1200;
      this.mobile = width < 490;
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  toggleSidebar(sidebar: number) {
    if(sidebar == 0) {
      this.sidebarExpanded = !this.sidebarExpanded;
    }
  }

  togglePlaySubMenu() {
    this.playSubMenu = !this.playSubMenu;
  }

  togglePlayIcon() {
    if(this.playIcon == 'caret-down') {
      this.playIcon = 'caret-up';
    }
    else {
      this.playIcon = 'caret-down';
    }
    this.sidebarExpanded = true;
  }

  logout() {
    this.authService.logout();
  }

}
