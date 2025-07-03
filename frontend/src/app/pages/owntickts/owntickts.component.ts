import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { CommonModule, DatePipe } from '@angular/common';
import { ShortenPipe } from '../../Pipe/shorten.pipe';
import { Router } from '@angular/router';
import { DataService } from '../../data.service';
import { sharedUi } from '../../shared/shared-ui';

@Component({
  selector: 'app-owntickts',
  standalone: true,
  imports: [DatePipe, ShortenPipe, CommonModule , ...sharedUi],
  templateUrl: './owntickts.component.html',
  styleUrl: './owntickts.component.css',
})
export class OwnticktsComponent implements OnInit {
  selectedStatuses: any[] = [];
  fullTicketList: any[] = [];
  user: any = [];
  ticketList: any = [];
  loading:boolean = false

  allStatuses: string[] = [
    'Open',
    'Pending',
    'Closed',
    'On Progress',
    'Fulfilled',
  ];

  onStatusChange(event: Event) {
    const checkBox = event.target as HTMLInputElement;
    const value = checkBox.value;

    if (checkBox.checked) {
      this.selectedStatuses.push(value);
    } else {
      this.selectedStatuses = this.selectedStatuses.filter((v) => v !== value);
    }

    this.filterTasks();
  }

  filterTasks() {
    if (this.selectedStatuses.length === 0) {
      this.ticketList = this.fullTicketList;
    } else {
      this.ticketList = this.fullTicketList.filter((ticket) =>
        this.selectedStatuses.includes(ticket.status)
      );
    }
  }

  constructor(
    private http: HttpClient,
    private router: Router,
    private dataservice: DataService
  ) {}

  goToTicket(id: number) {
    this.router.navigate(['/ticket', id]);
  }

  ngOnInit(): void {
    this.dataservice.islogged().subscribe({
      next: (data: any) => {
        this.loading=true
        this.user = data.result[0];
       
        console.log(`user from my ticket`, this.user);
         this.loading=false
      },
      error(err) {
        console.log(`error From auth User in my ticket Component :`, err);
      },
    });

    this.http.get(`${environment.apiUrl}/api/assignedtickets`).subscribe({
      next: (data: any) => {
        this.loading=true
        this.fullTicketList = data.result;
        this.ticketList = data.result;
        this.loading=false
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
