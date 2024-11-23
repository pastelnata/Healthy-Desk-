import { Component } from '@angular/core';
import { AlertModule } from '../alert.module';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-alert-view',
  templateUrl: './alert-view.component.html',
  styleUrl: './alert-view.component.css'
})
export class AlertViewComponent {
  param = "lighton?";
  isLightOn = false;
  apiUrl = 'http://192.168.0.104/';
  constructor(private http: HttpClient) { }
  toggleLight() {
    console.log('Toggling light...');
    if (this.isLightOn) {
      this.isLightOn = false;
      console.log("Light off");
      this.param = "lightoff?";
    }else{
      this.isLightOn = true;
      console.log("Light on");
      this.param = "lighton?";
    }
    const url = `${this.apiUrl}${this.param}`;
    this.http.get(url)
      .subscribe();
  }
}
