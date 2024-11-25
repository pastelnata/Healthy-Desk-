import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private http: HttpClient) { }
  
  apiUrl = 'http://192.168.0.104/';
  
  motivationLevel: string = 'low';
  standingUpTime: number = 0;

  calcStandingTime(mot_lvl: string) {
    if (mot_lvl === 'low') {
      this.standingUpTime =180;
    } else if (mot_lvl === 'medium') {
      this.standingUpTime = 120;
    } else if (mot_lvl === 'high') {
      this.standingUpTime = 60;
    }

  return this.standingUpTime;
  }

  sendAlert(param: string) {
    console.log('Playing sound...');
    const url = `${this.apiUrl}${param}?`;
    this.http.get(url)
      .subscribe();
  }

}
