import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from '../../config/config';
import { Storage } from '@ionic/storage';

/*
  Generated class for the AuthProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AuthProvider {
  ip = config.ip;

  constructor(
    public http: HttpClient,
    private storage: Storage
  ) {
    console.log('Hello AuthProvider Provider');
  }

  checkSession(token) {

    //Check if there is a token inside localStorage

    //Verify the token
    const url = this.ip + "/auth/users/checkSession";
    console.log(token)
    const httpOptions = {
      headers: new HttpHeaders({
        'authorization': token,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    }

    return this.http.get<UserInfo>(url, httpOptions);
  }

  getPayload(token) {
    const url = this.ip + "/auth/payload";
    console.log(token)
    const httpOptions = {
      headers: new HttpHeaders({
        'authorization': token,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    }

    return this.http.get<Payload>(url, httpOptions);

  }

  login(username, password) {
    const url = this.ip + "/auth/users/mobile/login";
    const data = {
      username,
      password
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      })
    };

    return this.http.post(url, data, httpOptions);

  }

}

interface UserInfo {
  id: number,
  name: string,
  username: string,
  iat: number,
  exp: number
}
interface Payload {
  dp_path: string,
  exp: number,
  iat: number,
  id: number,
  name: string,
  username: string
}

