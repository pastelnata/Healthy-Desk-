import { Component } from '@angular/core';
import { AlertModule } from '../alert.module';
import { AlertService } from '../alert.service';
@Component({
  selector: 'app-alert-view',
  templateUrl: './alert-view.component.html',
  styleUrl: './alert-view.component.css'
})
export class AlertViewComponent {
  constructor(private alertService: AlertService) { }
  
  currentAlertSount = "soft";

  sendAlert() {
    this.alertService.sendAlert(this.currentAlertSount).subscribe(
      (response: any) => {
        console.log('Success:', response);
      },
      (error: any) => {
        console.error('Error:', error);
      }
    );
  }
}
