import { Component, Input } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-piechart',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './piechart.component.html',
  styleUrl: './piechart.component.css',
})
export class PiechartComponent {
  pieChartType: 'pie' = 'pie';

  @Input() pieData!: ChartData<'pie'>;

  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: '#4B5563',
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        enabled: true,
      },
    },
  };
}
