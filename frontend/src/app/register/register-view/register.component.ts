import { Component } from '@angular/core';
import { HomeService } from '../../home/home.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  hours?: number; // Remove the initial assignment and make these optional
  minutes?: number;
  userHeight?: number;

  constructor(private homeService: HomeService, private router: Router) {}
  
  validateHours() {
    this.homeService.hours = this.hours ?? 0; // Use 0 if hours is undefined
    this.homeService.validateHours();
  }

  validateMinutes() {
    this.homeService.minutes = this.minutes ?? 0; // Use 0 if minutes is undefined
    this.homeService.validateMinutes();
  }

  register() {
    // Use 0 as a fallback for undefined values
    this.homeService.hours = this.hours ?? 0;
    this.homeService.minutes = this.minutes ?? 0;
    this.homeService.userHeight = this.userHeight ?? 0;

    this.homeService.saveDefaultProfile();
    this.router.navigate(['']);
  }
}
