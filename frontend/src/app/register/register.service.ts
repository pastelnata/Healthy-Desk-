import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { HomeService } from '../home/home.service';
import { Profile } from '../models/ProfileModel';
import { User } from '../models/UserModel';
import { AlertService } from '../alert/alert.service';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  standingUpHours: number = 0;
  standingUpMinutes: number = 0;
  standingUpTime: number = 0;

  sittingHours: number = 0;
  sittingMinutes: number = 0;
  sittingTime: number = 0;

  apiUrl = 'http://localhost:3000/api';
  constructor(
    private http: HttpClient,
    private homeService: HomeService,
    private alertService: AlertService
  ) {}

  /* REGISTER USER */

  registerUser(
    username: string,
    email: string,
    password: string,
    height: number,
    mot_lvl: 'low' | 'medium' | 'high',
    avg_standing_hrs: number,
    times_moved: number,
    calories_burned: number
  ): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const newUser = this.newUser(
      username,
      email,
      password,
      height,
      mot_lvl,
      avg_standing_hrs,
      times_moved,
      calories_burned
    );

    const { standingUpTime, sittingTime } = this.alertService.calcTimers(
      newUser.mot_lvl
    );
    this.standingUpTime = standingUpTime;
    this.sittingTime = sittingTime;

    this.registerProfiles(height);

    console.log(`NEW USER: ${JSON.stringify(newUser)}`);

    return this.http.post(`${this.apiUrl}/users`, newUser, { headers }).pipe(
      tap((response) => console.log('User created successfully:', response)),
      catchError((error) => {
        console.error('Error creating user:', error);
        return throwError(error);
      })
    );
  }

  newUser(
    username: string,
    email: string,
    password: string,
    height: number,
    mot_lvl: 'low' | 'medium' | 'high',
    avg_standing_hrs: number,
    times_moved: number,
    calories_burned: number
  ): User {
    const newUser: User = {
      userid: 3, //This should not be like that, needs to be changed when login is implemented
      username: username,
      email: email,
      password: password,
      height: height,
      mot_lvl: mot_lvl,
      avg_standing_hrs: avg_standing_hrs,
      times_moved: times_moved,
      calories_burned: calories_burned,
    };

    return newUser;
  }

  /* DEFAULT TIMER PROFILES */

  registerProfiles(userHeight: number) {
    console.log('standing up time', this.standingUpTime);
    console.log('sitting time', this.standingUpTime);
    const { hours: standingUpHours, minutes: standingUpMinutes } =
      this.convertMinutesToHours(this.standingUpTime);
    const { hours: sittingHours, minutes: sittingMinutes } =
      this.convertMinutesToHours(this.sittingTime);
    this.standingUpHours = standingUpHours;
    this.standingUpMinutes = standingUpMinutes;
    this.sittingHours = sittingHours;
    this.sittingMinutes = sittingMinutes;

    console.log(
      'standing up time after',
      this.standingUpHours,
      this.standingUpMinutes
    );
    console.log('sitting time after', this.sittingHours, this.sittingMinutes);
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const newProfile = this.newStandingProfile(userHeight);
    const newDefaultSitting = this.newSittingDefault(userHeight);
    const newDefaultStanding = this.newStandingDefault(userHeight);

    this.http.post(`${this.apiUrl}/profiles`, newProfile, { headers });
    this.http.post(`${this.apiUrl}/profiles`, newDefaultSitting, { headers });
    this.http.post(`${this.apiUrl}/profiles`, newDefaultStanding, { headers });
  }

  convertMinutesToHours(time: number): { hours: number; minutes: number } {
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    return { hours, minutes };
  }

  newStandingProfile(userHeight: number): Profile {
    const timeStanding = `${this.standingUpHours}h ${this.standingUpMinutes}m`;
    const timeSitting = `${this.sittingHours}h ${this.sittingMinutes}m`;

    const newProfile: Profile = {
      title: 'Default Timer',
      deskHeight: Math.round(userHeight * 0.61),
      timer_sitting: timeStanding,
      timer_standing: timeSitting,
      userId: 3,
      profileId: Date.now().toString(),
    };

    this.homeService.profiles.push(newProfile);

    this.homeService.profiles.forEach((profile) => {
      console.log(profile);
    });

    return newProfile;
  }

  /* DEFAULT PROFILES */

  newSittingDefault(userHeight: number): Profile {
    const newProfile: Profile = {
      title: 'Optimal Sitting Height',
      deskHeight: Math.round(userHeight * 0.43),
      userId: 3,
      profileId: Date.now().toString(),
    };

    this.homeService.defaultProfiles.push(newProfile);

    this.homeService.defaultProfiles.forEach((profile) => {
      console.log(profile);
    });

    return newProfile;
  }

  newStandingDefault(userHeight: number): Profile {
    const newProfile: Profile = {
      title: 'Optimal Standing Height',
      deskHeight: Math.round(userHeight * 0.61),
      userId: 3,
      profileId: Date.now().toString(),
    };

    this.homeService.defaultProfiles.push(newProfile);

    this.homeService.defaultProfiles.forEach((profile) => {
      console.log(profile);
    });

    return newProfile;
  }
}
