import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService } from '../../data.service';
import { sharedUi } from '../../shared/shared-ui';

@Component({
  selector: 'app-ticketcontrol',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe , RouterModule, RouterOutlet , ...sharedUi ],
  templateUrl: './ticketcontrol.component.html',
  styleUrl: './ticketcontrol.component.css',
})
export class TicketcontrolComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private router: Router,
    private dataService: DataService
  ) {}
  route = inject(ActivatedRoute);

  userId = this.route.snapshot.paramMap.get('id');

  user: any = [];

  result: any = [];

  adminUser = this.dataService.user

  loading:boolean = false

  displayFields = [
  { label: 'Category', name: 'category' },
  { label: 'Contact Info', name: 'contactInfo' },
  { label: 'Description', name: 'description' }
];



  navigate(){
    this.router.navigate([`ticket/${this.userId}/history`])
  }

  ticketUpdateForm = this.fb.group({
    authorName: ['', Validators.required],
    createdAt: ['', Validators.required],
    contactInfo: ['', Validators.required],
    category: ['', Validators.required],
    priority: ['', Validators.required],
    status: ['', Validators.required],
    assignedTo: ['', Validators.required],
    description: ['', Validators.required],
    assignedName: ['', Validators.required],
  });

  staffList: any = [];
  ngOnInit(): void {
    this.dataService.islogged().subscribe({

      next: (data: any) => {
       
        this.user = data.result[0];

        if (this.user.role === 'admin') {
          this.http.get(`${environment.apiUrl}/auth/getadmin`).subscribe({
            next: (data: any) => {
               this.loading=true
              console.log('all admin Data', data);
              this.staffList = data.result;
              this.loading=false
            },
            error(err) {
              console.error(`err from get all user in ticket Control ${err}`);
              
            },
          });
        }
      },
      error(err) {
        console.error(`err from logged user in ticket Control ${err}`);
      },
    });

    if (this.userId) {
      this.http
        .get(`${environment.apiUrl}/api/getsingleticket/${this.userId}`)
        .subscribe({
          next: (data: any) => {
            this.loading=true
            this.result = data.result[0];

            console.log('Single Tickets fetched success fully:', this.result);

            this.ticketUpdateForm.patchValue({
              authorName: this.result.authorName,
              createdAt: this.result.createdAt,
              contactInfo: this.result.contactInfo,
              category: this.result.category,
              priority: this.result.priority,
              status: this.result.status,
              assignedTo: this.result.assignedTo,
              description: this.result.description,
              assignedName: this.result.assignedName,
            });
            this.loading=false
          },
          error: (err) => {
            console.error(err);
          },
        });
    }
  }

  onSubmit() {
    this.http
      .put(
        `${environment.apiUrl}/api/updateticket/${this.userId}`,
        this.ticketUpdateForm.value
      )
      .subscribe({
        next: (data) => {
          this.loading=true
          console.log(data);
          this.loading=false
        },
        error(err) {
          console.error(`err from Update Ticket :`, err);
        },
      });
  }

  onCancel() {
    this.router.navigate(['/']);
  }
}
