import { Component } from '@angular/core';
import { ScoreModule } from '../score.module';
import { UserScore } from '../../models/user-score';
import { ScoreService } from '../score.service';
import { OnInit } from '@angular/core';
import { LoginService } from '../../login/login.service';
import { User } from '../../models/UserModel';
@Component({
  selector: 'app-score-view',
  templateUrl: './score-view.component.html',
  styleUrl: './score-view.component.css'
})
export class ScoreViewComponent implements OnInit {

  constructor(private scoreService: ScoreService, private loginService: LoginService) { 
  }

  users: UserScore[] = [];
  currentUserId: number = 1;
  currentUserName: string = '';
  todayScore: number = 21;  
  weekScore: number = 41;
  monthScore: number = 256;
  userScore: UserScore[] = [];

  ngOnInit(): void {
    this.loadCurrentUsuerScore();
    this.users = this.scoreService.getUserScore();
    this.displayUserScoreInOrder();

  }

  loadCurrentUsuerScore(){
    this.currentUserName = this.loginService.getCurrentUsername();
    this.weekScore = this.loginService.getUserScore() - 21; ;
    this.monthScore = this.loginService.getUserScore();
    this.todayScore = this.loginService.getUserScore() -166;

    
  }

  displayUserScoreInOrder() {
    this.users = this.users.sort((a, b) => b.score - a.score);
  }
}