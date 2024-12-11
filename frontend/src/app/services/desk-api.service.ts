import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, distinct, distinctUntilChanged, interval, map, Observable, switchMap, tap } from 'rxjs';
import { Desk } from '../models/DeskModel';
import { LoginService } from '../login/login.service';
import { AnalyticsService } from '../analytics/analytics.service';

@Injectable({
  providedIn: 'root',
})
export class DeskApiService {
  private connectedDeskId: string = '';
  private userIsStanding!: boolean;
  private userIsSitting!: boolean;
  private whenUserStood!: number;
  private whenUserSat!: number;
  private curDeskPosition!: number;
  private targetPosition!: number | null;

  private apiUrl =
    'http://127.0.0.1:8000/api/v2/E9Y2LxT4g1hQZ7aD8nR3mWx5P0qK6pV7/desks';

  //  private apiUrl = 'http://localhost:3000/api/desks'

  constructor(
    private http: HttpClient,
    private loginService: LoginService,
    private analyticsService: AnalyticsService
  ) { 
    this.init();
  }

  private init() {
    this.getDeskPosition().subscribe((position) => {
      this.curDeskPosition = position;
      console.log('Current desk position:', this.curDeskPosition);  
      const sittingHeight = this.loginService.getUserHeight() * 0.43;
      const standingHeight = this.loginService.getUserHeight() * 0.61;     
      this.userIsStanding = this.checkPosition(this.curDeskPosition, standingHeight);
      this.userIsSitting = this.checkPosition(this.curDeskPosition, sittingHeight);
      console.log('User is standing:', this.userIsStanding);
      console.log('User is sitting:', this.userIsSitting);
    });
  }

  getDesks(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl);
  }

  getDeskInfo(deskId: string): Observable<Desk> {
    const deskUrl = `${this.apiUrl}/${deskId}`;
    return this.http.get<Desk>(deskUrl);
  }

  getDeskPosition(): Observable<number> {
    const id = this.getConnectedDeskId();
    return interval(1000).pipe(
      switchMap(() =>
      this.http
      .get<{ position_mm: number }>(`${this.apiUrl}/${id}/state`, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })),
        map((response) => {
          return response.position_mm / 10;
        }),
        distinctUntilChanged(),
        catchError((error) => {
          console.error('Error getting desk position', error);
          throw error;
        })
      );
  }

  updateDeskPosition(position: number): Observable<any> {
    const id = this.getConnectedDeskId();
    this.targetPosition = position;
    const position_mm = position * 10;
    const data = { position_mm: position_mm };
    console.log('Updating desk position', data);
    return this.http
      .put<Desk>(`${this.apiUrl}/${id}/state`, data, {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
      .pipe(
        map((response: Desk) => {
          console.log('Desk position updated response:', response);
          this.targetPosition = null;
          //checks if user is in movement
          this.updateAnalytics();
          return response;
        }),
        catchError((error) => {
          console.log('Error updating desk position', error);
          throw error;
        })
      );
  }

  updateDeskID(deskId: string) {}

  getConnectedDeskId() {
    this.connectedDeskId = localStorage.getItem('deskId') || '';
    if (this.connectedDeskId == '') {
      alert('No desk connected');
    }
    console.log('Connected to:', this.connectedDeskId);
    return this.connectedDeskId;
  }

  connectToDesk(id: string) {
    this.connectedDeskId = id;
    localStorage.setItem('deskId', id);
    alert('connected to desk with id: ' + this.connectedDeskId);
  }

  async getUserPosture(deskPosition: number) {
    const sittingHeight = this.loginService.getUserHeight() * 0.43;
    const standingHeight = this.loginService.getUserHeight() * 0.61;
    try {
      console.log('Getting user posture', deskPosition);
      if (this.ifUserSat(deskPosition, sittingHeight)) {
        this.userIsSitting = true;
        this.userIsStanding = false;
        console.log('User is sitting');
        return;
      } else if (this.ifUserStood(deskPosition, standingHeight)) {
        this.userIsStanding = true;
        this.userIsSitting = false;
        console.log('User is standing');
        return;
      } else {
        this.userIsSitting = false;
        this.userIsStanding = false;
        console.log('User is moving');
        this.updateAnalytics();
        return;
      }
    } catch (error) {
      console.error('Error getting user posture:', error);
    }
  }
  
  ifUserSat(deskPosition: number, sittingHeight: number): boolean {
    // if the user was already standing 
    // double values dont get added
    if (
      this.userIsStanding &&
      this.checkPosition(deskPosition, sittingHeight)
    ) {
      return true;
    } else return false;
  }
  
  ifUserStood(deskPosition: number, standingHeight: number): boolean {
    if (
      this.userIsSitting &&
      this.checkPosition(deskPosition, standingHeight)
    ) {
      return true;
    } else return false;
  }

  checkPosition(deskHeight: number, height: number): boolean {
    if (deskHeight >= height - 10 && deskHeight <= height + 10) {
      return true;
    } else return false;
  }

  async updateAnalytics() {
    // if the user is standing
    if (this.userIsStanding) {
      this.whenUserStood = Date.now();
    } else if (this.userIsSitting) {
      this.whenUserSat = Date.now();
    }
    // example: if user stood at 14h30 and sat at 14h45, it returns 15m (in ms)
    const timeDifference = this.whenUserSat - this.whenUserStood;

    console.log('Updating analytics...');
    console.log('Time difference:', timeDifference);
    if (this.whenUserSat !== 0 && this.whenUserStood !== 0) {
      await this.analyticsService.updateDay(timeDifference);
      this.whenUserSat = 0;
      this.whenUserStood = 0;
      return;
    }
    
    // user stood up
    if(timeDifference < 0) {
      this.analyticsService.updateDay(0);
      this.whenUserSat = 0;
      return;
    }
  }
}