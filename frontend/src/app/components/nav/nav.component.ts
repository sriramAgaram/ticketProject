import {  Component} from '@angular/core';
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
export class NavComponent  {
  constructor(
    public dataService: DataService,
    private router: Router,
  ) {}

  isOpen = false;
  sideBarIsOpen = false;
  isLoggedIn: boolean = false;

  profileController() {
    this.sideBarIsOpen  = false
    this.isOpen = !this.isOpen;
  }

  sidebarController() {
    this.isOpen=false
   this.sideBarIsOpen = !this.sideBarIsOpen
  }

  user = this.dataService.user;

  logoutUser() {
    this.dataService.logout();
    this.isOpen = false;
    this.router.navigate(['/login']);
    this.sideBarIsOpen=false
  }

  navigate(path:string){
    if (path) {
    this.router.navigate([`/${path}`]);
    this.sideBarIsOpen = false;
    this.isOpen=false
  }
  }

 
}
