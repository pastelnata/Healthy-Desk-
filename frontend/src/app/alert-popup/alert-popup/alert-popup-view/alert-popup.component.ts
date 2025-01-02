import { Component, OnInit } from '@angular/core';
import { AlertPopupService } from '../../alert-popup.service';
@Component({
  selector: 'app-alert-popup',
  templateUrl: './alert-popup.component.html',
  styleUrl: './alert-popup.component.css'
})
export class AlertPopupComponent implements OnInit {
  showPopup = false;

  constructor(private alertService: AlertPopupService) { }

  ngOnInit(): void {
    this.startPopupTimer();
  }

  startPopupTimer(): void {
      //Timer for popup
      setTimeout(() => {
        this.showPopup = true;
        this.sendAlert1(); //Here depending on user settings the alert sound should be playied
        // this.sendAlert2();
        // this.sendAlert3();

      }, 1000) //Display popup after x amount of sec
  }

  onAccept(): void {
    this.showPopup = false;
    console.log("Accepted");
    this.startPopupTimer();
  }

  onDeny(): void {
    this.showPopup = false;
    console.log("Denied");
    this.startPopupTimer();
  }

  sendAlert1() {
    const currentAlertSount = "soft";
    this.alertService.sendAlert(currentAlertSount);
  }

  sendAlert2() {
    const currentAlertSount = "medium";
    this.alertService.sendAlert(currentAlertSount);
  }
  sendAlert3() {
    const currentAlertSount = "hard";
    this.alertService.sendAlert(currentAlertSount);
  }

}