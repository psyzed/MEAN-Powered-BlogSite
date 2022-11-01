import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';

import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private userId: string;
  private token: string;
  private tokenExpirationTimer: NodeJS.Timer;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getAuthStatus() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http.post(BACKEND_URL + '/signup', authData).subscribe(
      (responseData) => {
        this.router.navigate(['/']);
      },
      (error) => {
        this.authStatusListener.next(false);
      }
    );
  }

  loginUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{
        message: string;
        token: string;
        expiresIn: number;
        userId: string;
      }>(BACKEND_URL + '/login', authData)
      .subscribe(
        (responseDaTa) => {
          const token = responseDaTa.token;
          this.token = token;
          if (token) {
            const tokenExpirationTime = responseDaTa.expiresIn;
            this.setAuthTimer(tokenExpirationTime);
            this.isAuthenticated = true;
            this.userId = responseDaTa.userId;
            this.authStatusListener.next(true);
            const currentTime = new Date();
            const tokenExpirationDate = new Date(
              currentTime.getTime() + tokenExpirationTime * 1000
            );
            this.saveAuthData(token, tokenExpirationDate, this.userId);
            this.router.navigate(['/']);
          }
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }

  autoLoginUser() {
    const userAuthInformation = this.getAuthData();
    if (!userAuthInformation) {
      return;
    }
    const currentTime = new Date();
    const expiresIn =
      userAuthInformation.tokenExpirationDate.getTime() - currentTime.getTime();
    if (expiresIn > 0) {
      this.token = userAuthInformation.token;
      this.isAuthenticated = true;
      this.userId = userAuthInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenExpirationTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer(tokenExpirationTime: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, tokenExpirationTime * 1000);
  }

  private saveAuthData(
    token: string,
    tokenExpirationDate: Date,
    userId: string
  ) {
    localStorage.setItem('token', token);
    localStorage.setItem(
      'tokenExpirationDate',
      tokenExpirationDate.toISOString()
    );
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpirationDate');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const tokenExpirationDate = localStorage.getItem('tokenExpirationDate');
    const userId = localStorage.getItem('userId');
    if (!token || !tokenExpirationDate) {
      return;
    }
    return {
      token: token,
      tokenExpirationDate: new Date(tokenExpirationDate),
      userId: userId,
    };
  }
}
