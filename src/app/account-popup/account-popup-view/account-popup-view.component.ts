import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-account-popup-view',
  templateUrl: './account-popup-view.component.html',
  styleUrls: ['./account-popup-view.component.css']
})
export class AccountPopupViewComponent {
  @Output() close = new EventEmitter<void>();

  onClose() {
    this.close.emit();
  }
}