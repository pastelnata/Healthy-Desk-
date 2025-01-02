import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AlertPopupService {

  constructor(private http: HttpClient) { }

   
  apiUrl = 'http://192.168.0.104/';
  buzzerUrl = 'buzzer.cgi?';
  ledUrl = 'led.cgi?';
  
  sendAlert(param: string) {
    console.log('Playing sound...');
    const url = `${this.apiUrl}${this.buzzerUrl}?${param}`;
    this.http.get(url)
      .subscribe();
  }


}
