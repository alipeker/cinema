import { User } from '../data/user.model';
import { TokenStorageService } from './token-storage.service';
import { HttpClient, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}

export enum ERole {
  ROLE_USER,
  ROLE_MODERATOR,
  ROLE_ADMIN
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(public http: HttpClient, private tokenStorage: TokenStorageService) {
    this.currentUserSubject = new BehaviorSubject<User>(tokenStorage.getUser());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  async login(username: string, password: string): Promise<HttpErrorResponse | User> {
    return await this.http.post<User>('/proxy/api/auth/signin', {
      username,
      password,
    }, httpOptions).toPromise().then(data => {
      this.tokenStorage.saveToken(data.token);
      this.tokenStorage.saveUser(data);
      this.currentUserSubject.next(data);
      return data;
    }, err => {
        return err;
      });
  }

  register(username: string, email: string, password: string): void {
    const role = [ERole.ROLE_ADMIN];
    this.http.post('/proxy/api/auth/signup', {
      username,
      email,
      password,
      role
    }, httpOptions).subscribe(
      data => {

      },
      err => {
        console.log(err);
      }
    );
  }

  logout() {
    this.tokenStorage.signOut();
    this.currentUserSubject.next(this.tokenStorage.getUser());
  }

}
