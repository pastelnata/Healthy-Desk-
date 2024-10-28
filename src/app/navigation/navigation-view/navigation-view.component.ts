import { Component, EventEmitter, Output } from '@angular/core';
import { NavigationModule } from '../navigation.module';

@Component({
  selector: 'app-navigation-view',
  templateUrl: './navigation-view.component.html',
  styleUrl: './navigation-view.component.css'
})
export class NavigationViewComponent {

  @Output() toggleAccountVisibility = new EventEmitter<void>();

  accountClicked() {
    this.toggleAccountVisibility.emit();
  }

}
