import { Injectable } from '@angular/core';
import { Profile } from '../models/ProfileModel';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  hours: number = 0;
  minutes: number = 0;
  hoursStanding: number = 0;
  minutesStanding: number = 0;
  userHeight!: number;
  motivationLevel!: string;
  profiles: Profile[] = [];
  defaultProfiles: Profile[] = [];
  profileId: string = '';

  apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  validateHours(hours: number) {
    if (hours > 23) hours = 23;
    else if (hours < 0) hours = 0;
  }

  validateMinutes(minutes: number) {
    if (minutes > 59) minutes = 59;
    else if (minutes < 0) minutes = 0;
  }

  isUserStanding(deskHeight: number, standingHeight: number) {
    if (deskHeight > standingHeight - 10 && deskHeight < standingHeight + 10)
      return true;
    else return false;
  }

  createProfile(userid: number, title: string, deskHeight: number, timer_sitting: string,timer_standing: string): Observable<any> {
    console.log(
      'Received request..',
      title,
      deskHeight,
      timer_sitting,
      timer_standing
    );

    //this doesnt work for some reason
    const profileData = {
      userid,
      title,
      deskHeight,
      timer_sitting,
      timer_standing,
    };
    return this.http.post(`${this.apiUrl}/profiles`, profileData).pipe(
      tap((response) => console.log('Profile created successfully:', response)),
      catchError((error) => {
        console.error('Error creating profile:', error);
        return error;
      })
    );
  }
}
