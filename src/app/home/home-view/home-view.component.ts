import { Component } from '@angular/core';
import { HomeModule } from '../home.module';

@Component({
  selector: 'app-home-view',
  templateUrl: './home-view.component.html',
  styleUrl: './home-view.component.css'
})
export class HomeViewComponent {
  height: number = 50;
}
