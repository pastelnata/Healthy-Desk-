import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from '../login.service';
@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
  styleUrl: './login-view.component.css'
})

export class LoginViewComponent {
  username: string = '';
  password: string = '';
  constructor(private loginService: LoginServiceService) { }

  //Get data from login form

  //validate input
  logIn() {
    this.loginService.logInUser(this.username, this.password);
    this.clearInput();
    this.checkIfLogedIn();
  }

  clearInput() {
    this.username = '';
    this.password = '';
  }

  checkIfLogedIn() {
    if(this.loginService.checkIfLogedIn()){
      console.log("User is loged in");
      window.location.href = 'http://localhost:4200';
      alert("User is loged in");
    }
  }
  //send into service

}
