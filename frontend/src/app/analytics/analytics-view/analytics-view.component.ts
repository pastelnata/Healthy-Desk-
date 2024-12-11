import { Component, OnInit } from '@angular/core';
import { AnalyticsModule } from '../analytics.module';
import { Chart } from 'angular-highcharts';
import { AnalyticsService } from '../analytics.service';
import { Month } from '../../models/MonthModel';
@Component({
  selector: 'app-analytics-view',
  templateUrl: './analytics-view.component.html',
  styleUrl: './analytics-view.component.css',
})
export class AnalyticsViewComponent implements OnInit {
  curDate!: Date;
  prevMonthDate!: Date;
  twoMonthsDate!: Date;
  pieChart!: Chart;
  curMonth: string;
  prevMonth: string;
  twoMonthsAgo: string;

  monthNames: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  monthAnalytics: Month[] = [];

  constructor(private analyticsService: AnalyticsService) {
    this.curDate = new Date();
    const curMonthIndex = this.curDate.getMonth();

    this.curMonth = this.monthNames[curMonthIndex];
    this.prevMonth = this.monthNames[(curMonthIndex - 1 + 12) % 12];
    this.twoMonthsAgo = this.monthNames[(curMonthIndex - 2 + 12) % 12];
  }

  async ngOnInit() {
    this.createPieChart();
    this.getCurMonths();
    await this.analyticsService.getMonthAnalytics(this.curDate).subscribe({
      next: (response) => {
        this.monthAnalytics.push(response);
      },
    });
    await this.analyticsService
      .getMonthAnalytics(this.prevMonthDate)
      .subscribe({
        next: (response) => {
          this.monthAnalytics.push(response);
        },
      });
    await this.analyticsService
      .getMonthAnalytics(this.twoMonthsDate)
      .subscribe({
        next: (response) => {
          this.monthAnalytics.push(response);
        },
      });
  }

  getCurMonths() {
    // handles the case where the current month is January or February
    if (this.curDate.getMonth() === 0) {
      this.prevMonthDate.setFullYear(this.curDate.getFullYear() - 1);
      this.prevMonthDate.setMonth(11); // December
      this.twoMonthsDate.setFullYear(this.curDate.getFullYear() - 1);
      this.twoMonthsDate.setMonth(10); // November
    } else if (this.curDate.getMonth() === 1) {
      // February
      this.twoMonthsDate.setFullYear(this.curDate.getFullYear() - 1);
      this.twoMonthsDate.setMonth(11); // December
    } else {
      this.prevMonthDate = new Date(
        this.curDate.getFullYear(),
        this.curDate.getMonth() - 1,
        1
      );
      this.twoMonthsDate = new Date(
        this.curDate.getFullYear(),
        this.curDate.getMonth() - 2,
        1
      );
    }
  }

  createPieChart() {
    this.pieChart = new Chart({
      chart: {
        type: 'pie',
        backgroundColor: 'transparent',
      },
      title: {
        text: 'Time Spent:',
        style: {
          color: '#84C6DC',
          fontSize: '30px',
          fontWeight: 'bold',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.15)',
        },
      },
      credits: {
        enabled: false,
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
      },
      accessibility: {
        point: {
          valueSuffix: '%',
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          },
        },
      },
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 600, // Adjust for smaller screens
            },
            chartOptions: {
              chart: {
                height: '60%', // Resize chart for small screens
              },
              title: {
                style: {
                  fontSize: '18px', // Adjust title size for small screens
                },
              },
              plotOptions: {
                pie: {
                  dataLabels: {
                    style: {
                      fontSize: '10px', // Adjust labels
                    },
                  },
                },
              },
            },
          },
        ],
      },
      series: [
        {
          type: 'pie',
          name: 'Time Distribution',
          data: [
            { name: 'Standing', y: 40, color: '#84C6DC' },
            { name: 'Sitting', y: 60, color: '#B3E0F3' },
          ],
        },
      ],
    });
  }
}
