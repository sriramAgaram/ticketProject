import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quill-editor',
  standalone: true,
  imports: [CommonModule , FormsModule ],
  templateUrl: './quill-editor.component.html',
  styleUrl: './quill-editor.component.css'
})
export class QuillEditorComponent {
content=""
}
