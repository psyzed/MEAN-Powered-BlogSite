import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
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

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post('http://localhost:3000/api/user/signup', authData)
      .subscribe((responseData) => {});
  }

  loginUser(email: string, password: string) {
    const authData: AuthData = { email: email, password: password };
    this.http
      .post<{ message: string; token: string; expiresIn: number }>(
        'http://localhost:3000/api/user/login',
        authData
      )
      .subscribe((responseDaTa) => {
        const token = responseDaTa.token;
        this.token = token;
        if (token) {
          const tokenExpirationTime = responseDaTa.expiresIn;
          this.setAuthTimer(tokenExpirationTime);
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const currentTime = new Date();
          const tokenExpirationDate = new Date(
            currentTime.getTime() + tokenExpirationTime * 1000
          );
          this.saveAuthData(token, tokenExpirationDate);
          this.router.navigate(['/']);
        }
      });
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
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    clearTimeout(this.tokenExpirationTimer);
    this.clearAuthData();
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
  }

  private setAuthTimer(tokenExpirationTime: number) {
    console.log('Setting timer ' + tokenExpirationTime);
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, tokenExpirationTime * 1000);
  }

  private saveAuthData(token: string, tokenExpirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem(
      'tokenExpirationDate',
      tokenExpirationDate.toISOString()
    );
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpirationDate');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const tokenExpirationDate = localStorage.getItem('tokenExpirationDate');
    if (!token || !tokenExpirationDate) {
      return;
    }
    return {
      token: token,
      tokenExpirationDate: new Date(tokenExpirationDate),
    };
  }
}
