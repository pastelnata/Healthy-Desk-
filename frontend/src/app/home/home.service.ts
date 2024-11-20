import { Injectable } from '@angular/core';
import { Profile } from '../models/profile.model';

@Injectable({
  providedIn: 'root'
})

export class HomeService {
  hours: number = 0;
  minutes: number = 0;
  userHeight!: number;
  motivationLevel!: string;
  profiles: Profile[] = [];

  constructor() {
  }
  
  validateHours() {
    if (this.hours > 23) this.hours = 23;
    else if (this.hours < 0) this.hours = 0;
  }

  validateMinutes() {
    if (this.minutes > 59) this.minutes = 59; 
    else if (this.minutes < 0) this.minutes = 0;
  }

  isUserStanding(deskHeight: number, standingHeight: number) {
    if((deskHeight > standingHeight - 10) && (deskHeight < standingHeight + 10))
      return true;
    else return false;
  }
}
