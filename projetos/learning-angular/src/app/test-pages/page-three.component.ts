import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Movie } from './interfaces';

@Component({
  selector: 'app-page-three',
  standalone: true,
  imports: [CommonModule, RouterModule, NgTemplateOutlet],
  template: `
    <p routerLink="page-three" style="color: red">page-three works!</p>

    <!-- declarative way to create an embedded view, here we can dynamically pass templates -->
    <ng-container
      [ngTemplateOutlet]="template || defaultTemplate"
      [ngTemplateOutletContext]="{ $implicit: data }"
    >
    </ng-container>
    <ng-template #defaultTemplate>
      <div style="background-color: bisque; width: 300px">
        <p>Beautiful Title</p>
        <small>cool text inside a embedded view</small>

        <p>{{ data.title }}</p>
        <p>{{ data.year }}</p>
        <p>{{ data.rating }}</p>
      </div>
    </ng-template>
  `,
})
export class PageThreeComponent {
  @Input() template: TemplateRef<Movie>;

  data: Movie = {
    title: 'The Matrix',
    year: 1999,
    rating: 8.7,
  };
  // imperative way to create an embedded view
  // @ViewChild('container', { read: ViewContainerRef }) container: ViewContainerRef;
  // @ViewChild('defaultTemplate') defaultTemplate: TemplateRef<any>;

  // ngAfterViewInit() {
  //   this.container.createEmbeddedView(this.defaultTemplate);
  // }
}
