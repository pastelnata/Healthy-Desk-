import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private http: HttpClient) { }
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


  apiUrlBuzzer = 'http://192.168.0.104/api/sound-controll';

  sendAlert(alertType: string): Observable<any> {
    const body = {
      alert: alertType  
    };

    return this.http.post(this.apiUrlBuzzer, body, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

}
