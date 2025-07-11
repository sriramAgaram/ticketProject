import { Component, Input } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-barcharts',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './barcharts.component.html',
  styleUrl: './barcharts.component.css'
})
export class BarchartsComponent {

@Input() chartData!: ChartData<'bar'>;


 barChartType: ChartType = 'bar';

 

  barChartOptions: ChartOptions = {
  responsive: true,
  maintainAspectRatio: false, // << KEY TO MAKE HEIGHT WORK
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
          color: '#4B5563',
      }
    }
  },
  scales: {
    x: {
      ticks: {
         color: '#4B5563',
        maxRotation: 45,
        minRotation: 45
      }
    },
    y: {
      ticks: {
        color: '#ccc',
      },
      beginAtZero: true
    }
  }
};
}
