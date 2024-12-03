import { Injectable } from '@angular/core';
import { LoginServiceService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class StreakPopupService {

  constructor(
    private loginService: LoginServiceService
  ) { }

  getUserStreak(){
    const username = this.getUsername();
    

  }

  getUsername(){
    return this.loginService.getCurrentUsername();
  }


}
