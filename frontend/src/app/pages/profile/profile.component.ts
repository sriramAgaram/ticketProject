import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  iseditMode = false;

  edit() {
    this.iseditMode = true;
  }

  isOpen = false;

  profile() {
    this.isOpen = !this.isOpen;
  }
}
