import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { DataService } from '../../data.service';
import { CommonModule } from '@angular/common';
import { HomeComponent } from '../../pages/home/home.component';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, HomeComponent],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent implements OnInit {
  constructor(
    public dataService: DataService,
    private router: Router,
    private cdf: ChangeDetectorRef
  ) {}

  isOpen = false;
  sideBarIsOpen = true;
  isLoggedIn: boolean = false;

  profileController() {
    this.isOpen = !this.isOpen;
  }

  sidebarController() {
    return (this.sideBarIsOpen = !this.sideBarIsOpen);
  }

  user = this.dataService.user;

  logoutUser() {
    this.dataService.logout();
    this.isOpen = false;
    this.router.navigate(['/login']);
  }

  ngOnInit(): void {
    // const user = this.dataService.islogged().subscribe({
    //   next: (data: any) => {
    //     const loggedUser = data.result;
    //     this.user = loggedUser[0];
    //     console.log(loggedUser);
    //     this.dataService.setUser(this.user);
    //     this.cdf.detectChanges();
    //   },
    //   error: (err) => {
    //     console.error(err);
    //   },
    // });
  }
}
