import { Injectable } from '@angular/core';
import { Day } from '../models/DayModel';
import { LoginService } from '../login/login.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private apiUrl = 'http://localhost:3000/api/analytics';

  constructor(private loginService: LoginService, private http: HttpClient) {}

  async updateDay(timeStanding: number) {
    const userid = this.loginService.getUserId();
    if (userid !== null) {
      const day = this.createDayModel(timeStanding, userid);
      console.log('Sending request to create day:', day);
      await this.http.post(`${this.apiUrl}/${Number(userid)}`, day).subscribe({
        next: (response) => console.log('Day created successfully:', response),
        error: (error) => console.error('Error creating day:', error),
      });
    } else {
      console.error('User ID is null');
    }
  }

  createDayModel(timeStanding: number, userid: number): Day {
    // convert time from milliseconds to hours
    const hoursStanding = timeStanding / (1000 * 60 * 60);
    const curDate = new Date();
    const day: Day = {
      userid: Number(userid),
      date: curDate,
      // adds one time_moved to an existing day as well
      times_moved: 1,
      standing_hrs: hoursStanding,
    };
    return day;
  }
}
