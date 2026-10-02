import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-page-one',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <p [routerLink]="'page-one'" routerLinkActive="router-link-active" >page-one works!</p>

    <div *ngFor="let user of users$ | async">
      <p>{{ user.name }}</p>
    </div>
  `,
  styles: [],
})
export class PageOneComponent {
  users$ = inject(ActivatedRoute).data.pipe(map(({ user }) => user));
}
