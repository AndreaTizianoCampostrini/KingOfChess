import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;
  registerUrl: string = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBld34jAF_uoeKSfolTrYB_lf0Lg3S45lo";
  constructor(private http: HttpClient) { }

  isAuthenticated() {
    return this.isLoggedIn;
  }

  register(body : {}) {
    return this.http.post(this.registerUrl, body);
  }


}
