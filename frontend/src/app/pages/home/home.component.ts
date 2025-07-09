import { Component, OnInit } from '@angular/core';
import { BarchartsComponent } from '../../components/barcharts/barcharts.component';
import { PiechartComponent } from '../../components/piechart/piechart.component';
import { HttpClient } from '@angular/common/http';
import { environment} from "../../../environments/environment";
import { ChartData } from 'chart.js';
import { sharedUi } from '../../shared/shared-ui';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [BarchartsComponent, PiechartComponent, ...sharedUi],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  constructor(private http: HttpClient) {}

  data: any[] = [];
  priorityData: any[] = [];
  alltickets: any[] = [];
  totalTickets: number = 0;
  totalPending: number = 0;
  loading = false;
  totalTodayUpdated : number = 0

  barchartData: ChartData<'bar'> = {
    labels: [],
    datasets: [],
  };

  pieChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [],
  };

  count = () => {

    const statusLabels = [
      'Open',
      'On Progress',
      'Pending',
      'Fulfilled',
      'Closed',
    ];

    const statusMap = new Map(this.data.map((d) => [d.status, d.statusCount]));

    console.log(this.data.map((d) => [d.status, d.statusCount]));

    const countss = statusLabels.map((status) => statusMap.get(status) || 0);

    this.barchartData = {
      labels: statusLabels,
      datasets: [
        {
          label: 'Ticket Count',
          data: countss,
          backgroundColor: [
            '#3B82F6',
            '#06B6D4',
            '#F59E0B',
            '#10B981',
            '#64748B',
          ],
        },
      ],
    };
  };

  priority = () => {


    const priorityLabels = ["Low" ,"Medium" ,"High", "Urgent"]

    const priorityMap = new Map(this.priorityData.map((p)=> [p.priority , p.priorityCount]));
    
    const countss = priorityLabels.map((priority)=> priorityMap.get(priority))

    priorityLabels.map((p)=> p)


    this.pieChartData = {
      labels: priorityLabels,
      datasets: [
        {
          label: 'Priority',
          data: countss,
          backgroundColor: [
            '#3B82F6',
            '#06B6D4',
            '#F59E0B',
            '#10B981',
            '#64748B',
          ],
        },
      ],
    };
  };

  ngOnInit(): void {
    this.http.get(`${environment.apiUrl}/api/getticket`).subscribe({
      next: (data: any) => {
        // this.loading = true;
        console.log(data);
        this.data = data.countAllSts;

        this.totalTickets = data.totalCount;
        this.totalPending = data.totalPending;
        this.alltickets = data.allTicketsforDashBoard;
        this.priorityData = data.countAllPriority;
        this.totalTodayUpdated = data.totalUpdated;
        this.count();
        this.priority();
        this.loading = false;
      },
      error(err) {
        console.log(err);
      },
    });
  }
}
