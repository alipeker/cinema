import { AuthService } from './../services/auth.service';
import { TokenStorageService } from './../services/token-storage.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../data/user.model';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  user: User;
  Object = Object;

  constructor(private tokenStorage: TokenStorageService, private authService: AuthService) {
    this.user = this.tokenStorage.getUser();
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      this.user = user;
    });
  }

  nextButtonClick() {
    window.history.forward();
  }

  previousButtonClick() {
    window.history.back();
  }

}
