import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsViewComponent } from './analytics-view/analytics-view.component';
import { NavigationModule } from '../navigation/navigation.module';
import { ChartModule } from 'angular-highcharts';

@NgModule({
  declarations: [
    AnalyticsViewComponent,
  ],
  imports: [
    CommonModule,
    NavigationModule,
    ChartModule
  ]
})
export class AnalyticsModule { }
export class AppModule {}
