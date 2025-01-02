import { Component, EventEmitter, Output } from '@angular/core';
import { StreakPopupService } from '../streak-popup.service';
import { LoginService } from '../../login/login.service';

@Component({
  selector: 'app-streak-popup-view',
  templateUrl: './streak-popup-view.component.html',
  styleUrl: './streak-popup-view.component.css',
})
export class StreakPopupViewComponent {
  currentStreak: number = 0;
  longestStreak: number = 0;

  constructor(private loginService: LoginService) {}

  ngOnInit(): void {
    this.updateStreakData();
  }

  updateStreakData() {
    const curStreak = this.loginService.getStreak();
    const lonStreak = this.loginService.getLongestStreak();
    if (curStreak) {
      console.log('Streak loaded' + curStreak);
      this.currentStreak = curStreak;
    }
    if (lonStreak) {
      console.log('Longest Streak loaded' + lonStreak);
      this.longestStreak = lonStreak;
    } else if (lonStreak < curStreak) {
      this.longestStreak = curStreak;
    }
  }

  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}
