import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Desk } from '../models/DeskModel';

@Injectable({
  providedIn: 'root'
})
export class DeskApiService {
  private apiUrl = 'http://localhost:3000/api/desks'

  constructor(private http: HttpClient) { }

  getDesks(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl)
  }

  getDeskInfo(deskId: string): Observable<Desk> {
    const deskUrl = `${this.apiUrl}/${deskId}`;
    return this.http.get<Desk>(deskUrl);
  }
}