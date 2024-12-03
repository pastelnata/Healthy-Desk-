import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { LoginServiceService } from '../../login/login.service';

@Component({
  selector: 'app-account-popup-view',
  templateUrl: './account-popup-view.component.html',
  styleUrls: ['./account-popup-view.component.css']
})
export class AccountPopupViewComponent implements OnInit {

  ngOnInit(): void {
    this.username = this.loginService.getCurrentUsername();
    this.email = this.loginService.getEmail();
    this.isManager = this.loginService.getIsManager();
  }
  constructor(private loginService: LoginServiceService, private router: Router) { }

  username: string = '';
  email: string = '';
  isManager: boolean = false;

  gotoConnect() {
    this.router.navigate(['/connect']);
  }

  gotoLogin() {
    this.router.navigate(['/login']);
  }

  isLoggedIn() {
    return this.loginService.isLoggedIn();
  }

  logOut() {
    this.loginService.logOut();
  }

  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}