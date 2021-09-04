import { TokenStorageService } from './../services/token-storage.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { User } from '../data/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: User;

  constructor(private authService: AuthService, private tokenStorage: TokenStorageService) {
    this.user = this.tokenStorage.getUser();
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.user = user;
    })
  }

}
