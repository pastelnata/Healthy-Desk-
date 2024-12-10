import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable } from 'rxjs';
import { Desk } from '../models/DeskModel';
import { error } from 'highcharts';
import { response } from 'express';
import { LoginService } from '../login/login.service';

@Injectable({
  providedIn: 'root'
})
export class DeskApiService {

  private connectedDeskId: string = '';

  private apiUrl = 'http://127.0.0.1:8000/api/v2/E9Y2LxT4g1hQZ7aD8nR3mWx5P0qK6pV7/desks'

 //  private apiUrl = 'http://localhost:3000/api/desks'


  constructor(private http: HttpClient, private loginService: LoginService) {}

  getDesks(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl)
  }

  getDeskInfo(deskId: string): Observable<Desk> {
    const deskUrl = `${this.apiUrl}/${deskId}`;
    return this.http.get<Desk>(deskUrl);
  }

  getDeskPosition(): Observable<number> {
    const id = this.getConnectedDeskId();
    return this.http.get<{ position_mm: number }>(`${this.apiUrl}/${id}/state`, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      map(response => response.position_mm / 10),
      catchError((error) => {
        console.error("Error getting desk position", error);
        throw error;
      })
    );
  }

  updateDeskPosition(position: number): Observable<any> {
    const id = this.getConnectedDeskId();
    const position_mm = position * 10;
    const data = { position_mm: position_mm };
    console.log("Updating desk position", data);
    return this.http.put(`${this.apiUrl}/${id}/state`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      map(response => {
        console.log("Desk position updated response:", response);
        return response;
      }),
      catchError((error) => {
        console.log("Error updating desk position", error);
        throw error;
      })
    );
  }
  
  
  updateDeskID(deskId: string) {
  
  }

  getConnectedDeskId() {
    this.connectedDeskId= localStorage.getItem('deskId') || '';
    if(this.connectedDeskId == '') {
      alert("No desk connected");
    }
    console.log("Connected to:", this.connectedDeskId);
    return this.connectedDeskId;
  }

  connectToDesk(id: string) {
    this.connectedDeskId = id;
    localStorage.setItem('deskId', id)
    alert("connected to desk with id: " + this.connectedDeskId);
  }

  isUserStanding(): Observable<boolean> {
    return this.getDeskPosition().pipe(
      map(deskHeight => {
        const standingHeight = this.loginService.getUserHeight() * 0.61;
        if (deskHeight >= standingHeight - 10 && deskHeight <= standingHeight + 10) {
          return true;
        } else return false;
      })
    );
  }
}



