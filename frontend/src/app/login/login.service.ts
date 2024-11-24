import { Injectable } from '@angular/core';
import { LoginViewComponent } from './login-view/login-view.component';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { User } from '../models/UserModel';
import { response } from 'express';
import { Observable, retry } from 'rxjs';
import { Router } from 'express';
@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {
  
  defaultHeight!: number;
  //keep user data in here as loged in user
  LogedInUser!: User;
  apiUrl = "http://localhost:3000/api"
  router: any;
  isLogedIn = false;

  constructor(private http: HttpClient) {
    this.isLogedIn = false 
  }

  

  //Send user data to database
  //Return if user is in database and if credentials are correct
  logInUser(username: string, password: string) {
    const body = {username, password};
     this.http.post(`${this.apiUrl}/user`, body , { 
     }).subscribe(response => this.LogedInUser = response as User);
    console.log("User in logInUser: ", this.LogedInUser);
    if(this.LogedInUser){
      this.isLogedIn = true;
    }else{
      this.isLogedIn = false
      alert("Wrong credentials or user not found");
    }
  }

  checkIfLogedIn(){
    return this.isLogedIn
  }
  

}


