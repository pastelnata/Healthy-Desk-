import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NavigationModule } from '../navigation.module';
import { LoginServiceService } from '../../login/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation-view',
  templateUrl: './navigation-view.component.html',
  styleUrl: './navigation-view.component.css'
})
export class NavigationViewComponent {
  constructor(private loginService: LoginServiceService, private router: Router) {}
  
  isLoggedIn: boolean = false
  currentStreak: number = 0

  ngOnInit(): void {
    this.currentStreak = this.loginService.getStreak();
  }

  @Output() toggleAccountVisibility = new EventEmitter<void>();
  @Output() toggleeStreakVisibility = new EventEmitter<void>();

  accountClicked() {
    this.isLoggedIn = this.loginService.isLoggedIn();
    if(this.isLoggedIn){
      this.toggleAccountVisibility.emit();
    }
    else {
      alert("User is not logged in!");
      this.router.navigate(['/login']);
    }
  }

  streakClicked() {
    console.log("Streak clicked");
    this.toggleeStreakVisibility.emit();
  }



}
