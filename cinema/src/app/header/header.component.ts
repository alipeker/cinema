import { User } from '../data/user.model';
import { TokenStorageService } from './../services/token-storage.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user: User;
  navbarCollapsed = true;
  Object = Object;

  constructor(private tokenStorage: TokenStorageService, private authService: AuthService) {
    this.user = this.tokenStorage.getUser();
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.user = user;
    });
  }


}
