import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserInfo } from './info';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-template',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forms-template.component.html',
  styles: [''],
})
export class FormsTemplateComponent {
  userInfo: UserInfo = {
    name: '',
    email: '',
    age: 12,
  };

  search = '';

  onSubmitForm(form: NgForm) {
    console.log(form.value);
    form.reset();
  }
}
