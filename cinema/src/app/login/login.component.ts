import { TokenStorageService } from './../services/token-storage.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../data/user.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('email', {static: false}) email: ElementRef;

  user: User;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService) {
    this.user = this.tokenStorage.getUser();
  }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = this.tokenStorage.getToken() !== 'auth-token';
      this.roles = this.tokenStorage.getUser().roles;
    }

    this.authService.currentUser.subscribe(user => {
      this.user = user;
    });

    if (!this.user) {
      this.errorMessage = 'Wrong properties.';
    }
  }

  login(email: string, password: string): void {
    this.authService.login(email, password).then(loginResponse => {
      if(loginResponse instanceof HttpErrorResponse) this.errorMessage = 'Wrong properties.';
    });
  }

  reloadPage(): void {
    window.location.reload();
  }

  signOut(): void {
    this.tokenStorage.signOut();
    window.location.reload();
  }

}
