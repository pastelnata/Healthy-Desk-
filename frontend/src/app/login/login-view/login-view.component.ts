import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from '../login.service';
import { User } from '../../models/UserModel';

@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
  styleUrl: './login-view.component.css'
})

export class LoginViewComponent implements OnInit {
  ngOnInit(): void {
    //Loading user data (if existing)
    this.loggedInUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  }


  username: string = '';
  password: string = '';
  loggedInUser: User | null = null;

  constructor(private loginService: LoginServiceService) { }

  //Get data from login form

  //validate input
  logIn() {
    this.loginService.logIn(this.username, this.password).subscribe(
      (response) => {
        this.clearInput();
        // success = login credentials are correct 
        if (response.success) {
          localStorage.setItem('isLoggedIn', 'true')

          if(response.isManager) {
            localStorage.setItem('isManager', 'true')
            console.log("Manager is logged in");
            alert("Login successful!");
            window.location.href = 'http://localhost:4200/manager';
          }
          else {
            console.log("User is logged in");
            alert("Login successful!");
            window.location.href = 'http://localhost:4200';
          }
        }
      },
      (error) => {
        console.log("Error", error);
        alert("Wrong credentials or user not found");
      }
    );
  }

  clearInput() {
    this.username = '';
    this.password = '';
  }

  isLoggedIn() {
    return localStorage.getItem('isLoggedIn')==="true";
  }

  logOut() {
    this.loginService.logOut();
  }

}
