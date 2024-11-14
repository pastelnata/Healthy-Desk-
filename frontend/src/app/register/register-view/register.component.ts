import { Component } from '@angular/core';
import { HomeService } from '../../home/home.service';
import { Router } from '@angular/router';
import { RegisterService } from '../register.service';
import { Profile } from '../../models/profile.model';
import { response } from 'express';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})

export class RegisterComponent {
  username: string = '';
  email!: string;
  password: string = '';
  height: number = 0;
  hours: number = 0;
  minutes: number = 0;
  mot_lvl!: 'low';

  constructor(private homeService: HomeService, private router: Router, private registerService: RegisterService) {}
  validateHours() {
    this.homeService.validateHours();
  }

  validateMinutes() {
    this.homeService.validateMinutes();
  }

  register(): void {
    this.registerService.registerUser(this.username, this.email, this.password, this.height, this.mot_lvl, 0, 0, 0).subscribe(response => {
      console.log('User registered:', response);
    }, error => {
      console.error('Error registering user:', error);
    });
    //this.registerService.registerDefaultProfile(this.hours, this.minutes, this.height);
    this.router.navigate(['']);
  }
}
