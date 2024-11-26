import { Component } from '@angular/core';
import { AnalyticsModule } from '../analytics.module';
import { Chart } from 'angular-highcharts';
@Component({
  selector: 'app-analytics-view',
  templateUrl: './analytics-view.component.html', 
  styleUrl: './analytics-view.component.css'
  
})
export class AnalyticsViewComponent {
  
  monthNames: string[] = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  public curMonth: string;
  public prevMonth: string;
  public twoMonthsAgo: string;

  pieChart!: Chart;

  constructor() {
    const curDate = new Date();
    const curMonthIndex = curDate.getMonth();

    this.curMonth = this.monthNames[curMonthIndex];
    this.prevMonth = this.monthNames[(curMonthIndex - 1 + 12) % 12];
    this.twoMonthsAgo = this.monthNames[(curMonthIndex - 2 + 12) % 12];

  
    this.pieChart = new Chart({
      chart: {
        type: 'pie',
        backgroundColor: 'transparent'
      },
      title: {
        text: 'Time Spent:',
        style: {
          color: '#84C6DC',
          fontSize: '30px',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.15)'
        }
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          }
        }
      },
      series: [
        {
          type: 'pie',
          name: 'Time Distribution',
          data: [
            { name: 'Standing', y: 40, color: '#84C6DC' },
            { name: 'Sitting', y: 60, color: '#B3E0F3' }
          ]
        }
      ]
    });
  }
}



