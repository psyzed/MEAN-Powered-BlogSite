import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  constructor(private authService: AuthService) {}
  private authListenerSubscription: Subscription;

  public userIsLoggedIn = false;

  ngOnInit(): void {
    this.userIsLoggedIn = this.authService.getAuthStatus();
    this.authListenerSubscription = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsLoggedIn = isAuthenticated;
      });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authListenerSubscription.unsubscribe();
  }
}
