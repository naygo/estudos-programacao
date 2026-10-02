import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageThreeComponent } from './page-three.component';

@Component({
  selector: 'app-page-two',
  standalone: true,
  imports: [CommonModule, RouterModule, PageThreeComponent],
  template: `
    <p routerLink="page-two">page-two works!</p>
    <app-page-three [template]="otherTemplate"></app-page-three>

    <ng-template #otherTemplate let-data>
      <div style="background-color: cornflowerblue; width: 300px">
        <p>Other Beautiful Title</p>
        <small>other cool text redered with template outlet</small>

        <p>{{ data.title }}</p>
        <p>{{ data.year }}</p>
        <p>{{ data.rating }}</p>
      </div>
    </ng-template>
  `,
  styles: [],
})
export class PageTwoComponent {}
