import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { authGuard } from './services/auth.guard';
import { MyticketComponent } from './pages/myticket/myticket.component';


export const routes: Routes = [
  
  {
    path: '',
    component: HomeComponent,
    canActivate: [authGuard],
  },
  {
    path: 'alltickets',
    loadComponent:()=> import("./pages/myticket/myticket.component").then((m)=> m.MyticketComponent),
    canActivate: [authGuard],
  },

  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: 'signup',
    component: SignupComponent,
  },

  {
    path: 'newticket',
    loadComponent:()=> import("./pages/newticket/newticket.component").then((m)=> m.NewticketComponent),
    canActivate: [authGuard],
  },

  {
    path: 'ticket/:id',
    loadComponent:()=> import("./pages/ticketcontrol/ticketcontrol.component").then((m)=>m.TicketcontrolComponent),
    canActivate: [authGuard],
  },

  {
    path: 'profile',
     loadComponent:()=> import("./pages/profile/profile.component").then((m)=>m.ProfileComponent),
    canActivate: [authGuard],
  },
  {
    path: 'owntickets',
    loadComponent:()=> import("./pages/owntickts/owntickts.component").then((m)=>m.OwnticktsComponent),
    canActivate: [authGuard],
  },

  {
    path: 'ticket/:id/history',
    loadComponent:()=> import("./pages/history/history.component").then((m)=>m.HistoryComponent),
    canActivate: [authGuard],
  },

  {
    path: '**',
    component: MyticketComponent,
    canActivate: [authGuard],
  },
];
