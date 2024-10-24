import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeViewComponent } from './home-view/home-view.component';
import { NavigationModule } from '../navigation/navigation.module';

@NgModule({
  declarations: [
    HomeViewComponent,
  ],
  imports: [
    CommonModule,
    NavigationModule
  ]
})
export class HomeModule { }
