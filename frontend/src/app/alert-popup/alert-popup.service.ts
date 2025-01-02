import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertPopupService {

  private showPopUpSubject = new Subject<boolean>();
  showPopUp$ = this.showPopUpSubject.asObservable();
  private alertResponse!: (value: boolean) => void;

  constructor() { }

  onAccept(): boolean {
    console.log("Accepted");
    this.hideAlert();
    this.alertResponse(true);
    return true;
  }

  onDeny(): boolean {
    console.log("Denied clicked");
    this.hideAlert();
    this.alertResponse(false);
    return false;
  }

  userChoice(choice: 'accept' | 'deny'): boolean {
    if (choice === 'accept') {
      this.onAccept();
    } else if (choice === 'deny') {
      this.onDeny();
    }
    this.hideAlert();
    return false;
  }

  displayAlert(): Promise<boolean> {
    console.log('DISPLAYING ALERT');
    this.showPopUpSubject.next(true);
    return new Promise((resolve) => {
      this.alertResponse = resolve;
    });
  }

  hideAlert() {
    this.showPopUpSubject.next(false);
  }
}
