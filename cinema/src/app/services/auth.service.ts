import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../store/user.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public http: HttpClient) {
  }

  login(user: User) {
    let headers = new HttpHeaders();
    headers.append('Accept', 'application/json')
    // creating base64 encoded String from user name and password
    var base64Credential: string = btoa( user.username+ ':' + user.password);
    headers.append("Authorization", "Basic " + base64Credential);

    let options = {
      headers: headers
    }
    // console.log(user)
    this.http.get("/proxy/account/authenticate", options)
      .subscribe(user => {
        console.log(user)
      }, err=>{
        console.log('yanlis')
        }
    );
  }
}
