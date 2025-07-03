import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css',
})
export class HistoryComponent implements OnInit {
  constructor(private http: HttpClient, private router: Router) {}

  route = inject(ActivatedRoute);

  historyList:any[] = [];

  ticketId = this.route.snapshot.paramMap.get('id');

  ngOnInit(): void {
    this.http
      .get(`${environment.apiUrl}/api/gettickethistory/${this.ticketId}`)
      .subscribe({
        next: (data: any) => {
          console.log('Data from history Component', data);
          this.historyList = data.result;
        },
        error: (err) => {
          console.error(`Error from ticketHistory component :`, err);
        },
      });
  }
}
