import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { QuillEditorComponent } from '../../components/quill-editor/quill-editor.component';

@Component({
  selector: 'app-newticket',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, QuillEditorComponent],
  templateUrl: './newticket.component.html',
  styleUrl: './newticket.component.css',
})
export class NewticketComponent {
  constructor(private fb: FormBuilder, private http: HttpClient) {}
  previewUrl: string | ArrayBuffer | null = null; // holds live preview when file is selected
  selectedImageFile: File | null = null; // store new image file


  onImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedImageFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  reset() {
    return (this.previewUrl = '');
  }

  ticketForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(100)]],
    category: ['', Validators.required],
    contactInfo: ['', [Validators.required, Validators.maxLength(10)]],
    description: ['', [Validators.required, Validators.maxLength(500)]],
  });

  onSubmit() {
    console.log(this.ticketForm.value);

    const formData = new FormData();

    formData.append('title', this.ticketForm.get('title')?.value || '');
    formData.append('category', this.ticketForm.get('category')?.value || '');
    formData.append(
      'contactInfo',
      this.ticketForm.get('contactInfo')?.value || ''
    );
    formData.append(
      'description',
      this.ticketForm.get('description')?.value || ''
    );

    if (this.selectedImageFile) {
      formData.append('image', this.selectedImageFile);
    }

    this.http
      .post(`${environment.apiUrl}/api/createticket`, formData)
      .subscribe({
        next: (data: any) => {
          console.log(data);
          this.ticketForm.reset();
          this.previewUrl = '';
        },
        error: (err) => {
          console.error(`error from create Ticket : ${err}`);
        },
      });
  }
}
