import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { DataService } from '../../data.service';
import { ShortenPipe } from '../../Pipe/shorten.pipe';
import { Subject, throttleTime } from 'rxjs';
import { sharedUi } from '../../shared/shared-ui';

@Component({
  selector: 'app-myticket',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterModule, ShortenPipe ,...sharedUi],
  templateUrl: './myticket.component.html',
  styleUrl: './myticket.component.css',
})
export class MyticketComponent implements OnInit {
  pervPage$ = new Subject <void>();
  nextPage$ = new Subject <void>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private dataservice: DataService,
  ) {
    this.pervPage$.pipe(throttleTime(1000)).subscribe(() => {
      if (this.page > 1) {
        this.page--;
        this.loadtickets();
      }
    });

    this.nextPage$.pipe(throttleTime(1000)).subscribe(() => {
      this.page++, this.loadtickets();
    });
  }

  ticketList: any = [];
  fullTicketList: any[] = [];
  user: any = [];
  limit: number = 10;
  page: number = 1;
  loading:boolean = false

  allStatuses: string[] = [
    'Open',
    'Pending',
    'Closed',
    'On Progress',
    'Fulfilled',
  ];
  selectedStatuses: string[] = [];

  onStatusChange(event: Event) {
    const checkBox = event.target as HTMLInputElement;
    const value = checkBox.value;

    if (checkBox.checked) {
      this.selectedStatuses.push(value);
    } else {
      this.selectedStatuses = this.selectedStatuses.filter((v) => v !== value);
    }

    console.log(this.selectedStatuses);

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

  goToTicket(id: number) {
    this.router.navigate(['/ticket', id]);
  }

  getTickets(limit: number = 1, page: number = 10) {
    return this.http.get(
      `${environment.apiUrl}/api/getticket?limit=${limit}&page=${page}`
    );
  }

  loadtickets() {
    
    this.getTickets(this.limit, this.page).subscribe({
      next: (data: any) => {
        this.loading=true
        console.log(data.result);
        this.fullTicketList = data.result;
        this.ticketList = data.result;
         this.loading=false
      },
      error: (err) => {
        console.error(err);
      },
    });
   
  }

  nextPage(){
    this.nextPage$.next();  
  }

  prevPage(){
  this.pervPage$.next();
  }


  ngOnInit(): void {
   
    this.dataservice.islogged().subscribe({
      next: (data: any) => {
         this.loading=true
        this.user = data.result[0];
        console.log(`user from my ticket`, this.user);
        this.dataservice.setUser(this.user);
       
        this.loading=false
      },
      error(err) {
        console.log(`error From auth User in my ticket Component :`, err);
      },
    });

    
    console.log('getticket is calling without Headers');

    this.loadtickets();
  }
}
