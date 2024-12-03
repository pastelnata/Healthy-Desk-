import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from '../login.service';
import { User } from '../../models/UserModel';
import { jwtDecode } from "jwt-decode"

@Component({
  selector: 'app-login-view',
  templateUrl: './login-view.component.html',
  styleUrl: './login-view.component.css'
})

export class LoginViewComponent implements OnInit {
  ngOnInit(): void {
    // How username and permissions should be retrieved anywhere in the code:
    this.username = this.loginService.getCurrentUsername();
    this.isManager = this.loginService.getIsManager();
  }
  constructor(private loginService: LoginServiceService) { }

  username: string = '';
  password: string = '';
  isManager: boolean = false;



  //Get data from login form

  //validate input
  logIn() {
    this.loginService.logIn(this.username, this.password).subscribe(
      (response) => {
        this.clearInput();
        // success = login credentials are correct 
        if (response.success) {
          // Decode the token for isManager bool
          const decodedUser: any = jwtDecode(response.token);
          if(decodedUser.isManager) {
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
    // Checks if the user token is in localStorage (which means that user is logged in)
    const token = localStorage.getItem('token')
    return (token);
  }

  logOut() {
    this.loginService.logOut();
  }

}
