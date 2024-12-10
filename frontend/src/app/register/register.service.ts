import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HomeService } from '../home/home.service';
import { Profile } from '../models/ProfileModel';
import { User } from '../models/UserModel';
import { AlertService } from '../alert/alert.service';
import { LoginService } from '../login/login.service';

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
    private alertService: AlertService,
    private loginService: LoginService
  ) {}

  /* REGISTER USER */

  registerUser(
    username: string,
    email: string,
    password: string,
    height: number,
    mot_lvl: 'low' | 'medium' | 'high',
    avg_standing_hrs: number,
    times_moved: number
  ): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const newUser = this.newUser(
      username,
      email,
      password,
      height,
      mot_lvl,
      avg_standing_hrs,
      times_moved
    );

    const { standingUpTime, sittingTime } = this.alertService.calcTimers(
      newUser.mot_lvl
    );
    this.standingUpTime = standingUpTime;
    this.sittingTime = sittingTime;

    console.log(`NEW USER: ${JSON.stringify(newUser)}`);

    return this.http
      .post<{ success: boolean; token: string }>(
        `${this.apiUrl}/users`,
        newUser,
        { headers }
      )
      .pipe(
        map(async (response) => {
          console.log('User created successfully:', response.token);
          localStorage.setItem('token', response.token);
          await this.registerProfiles(height);
          return response.token;
        }),
        catchError((error) => {
          console.error('Error creating user:', error);
          return throwError(() => error);
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
    times_moved: number
  ): User {
    const newUser: User = {
      username: username,
      email: email,
      password: password,
      height: height,
      mot_lvl: mot_lvl,
      avg_standing_hrs: avg_standing_hrs,
      times_moved: times_moved,
    };

    return newUser;
  }

  /* DEFAULT TIMER PROFILES */

  async registerProfiles(userHeight: number) {
    this.getTimers();
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const curUser = await this.loginService.getUserId();
    console.log('current user:', curUser);
    if (curUser) {
      console.log('registering profiles...');
      this.newStandingProfile(userHeight, curUser, headers);
      this.newSittingDefault(userHeight, curUser, headers);
      this.newStandingDefault(userHeight, curUser, headers);
    }
  }

  getTimers() {
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
  }

  convertMinutesToHours(time: number): { hours: number; minutes: number } {
    const hours = Math.floor(time / 60);
    const minutes = time % 60;
    return { hours, minutes };
  }

  async newStandingProfile(userHeight: number, userid: number, headers: any) {
    const timeStanding = `${this.standingUpHours}h ${this.standingUpMinutes}m`;
    const timeSitting = `${this.sittingHours}h ${this.sittingMinutes}m`;

    const newProfile: Profile = {
      title: 'Default Timer',
      deskHeight: Math.round(userHeight * 0.61),
      timer_sitting: timeStanding,
      timer_standing: timeSitting,
      userId: userid,
    };
    await this.http.post(`${this.apiUrl}/${userid}/profiles`, newProfile, { headers }).subscribe({
      next: (response) => {
        this.homeService.profiles.push(newProfile);
        console.log('Profile created:', response);
      },
      error: (error) => {
        console.error('Error creating profile:', error);
      }
    });

    return newProfile;
  }

  /* DEFAULT PROFILES */

  async newSittingDefault(userHeight: number, userid: number, headers: any) {
    const newProfile: Profile = {
      title: 'Optimal Sitting Height',
      deskHeight: Math.round(userHeight * 0.43),
      userId: userid,
    };
    await this.http.post(`${this.apiUrl}/${userid}/profiles`, newProfile, {
      headers,
    }).subscribe({
      next: (response) => {
        this.homeService.defaultProfiles.push(newProfile);
        console.log('Profile created:', response);
      },
      error: (error) => {
        console.error('Error creating profile:', error);
      }
    });
  }

  async newStandingDefault(userHeight: number, userid: number, headers: any) {
    const newProfile: Profile = {
      title: 'Optimal Standing Height',
      deskHeight: Math.round(userHeight * 0.61),
      userId: userid,
    };
    await this.http.post(`${this.apiUrl}/${userid}/profiles`, newProfile, {
      headers,
    }).subscribe({
      next: (response) => {
        this.homeService.defaultProfiles.push(newProfile);
        console.log('Profile created:', response);
      },
      error: (error) => {
        console.error('Error creating profile:', error);
      }
  });
  }
}
