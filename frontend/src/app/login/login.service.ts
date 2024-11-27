import { Injectable } from '@angular/core';
import { LoginViewComponent } from './login-view/login-view.component';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { User } from '../models/UserModel';
import { response } from 'express';
import { map, Observable, retry } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  
  defaultHeight!: number;
  //keep user data in here as loged in user
  loggedInUser!: User;
  apiUrl = "http://localhost:3000/api"
  router: any;
  isManager = false;

  constructor(private http: HttpClient) { }

  //Send user data to database
  //Return if user is in database and if credentials are correct
  logIn(username: string, password: string): Observable<{ success: boolean, user?: any, isManager: boolean }> {
    const body = { username, password };

    return this.http.post<{ success: boolean, user?: any, isManager: boolean }>(`${this.apiUrl}/user`, body).pipe(
        map(response => {
            if (!response.success) {
              return response;
            } 
            else {
              localStorage.setItem('isLoggedIn', 'true');
              localStorage.setItem('isManager', response.isManager ? 'true': 'false');

              this.loggedInUser = response.user;
              localStorage.setItem('currentUser', JSON.stringify(response.user));

              return response;
            }
        })
    );
}


  logOut() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isManager');
    localStorage.removeItem('currentUser');
  }

  getCurrentUser() {
    return this.loggedInUser;
  }
}


