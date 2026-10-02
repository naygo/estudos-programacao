import { inject, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { FormsTemplateComponent } from './forms-playground/template/forms-template.component';
import { PageOneComponent } from './test-pages/page-one.component';
import { PageThreeComponent } from './test-pages/page-three.component';
import { PageTwoComponent } from './test-pages/page-two.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [() => inject(AuthService).isAuthenticated$],
    resolve: {
      user: () => inject(AuthService).authUser$,
    },
    children: [
      { path: 'page-one', component: PageOneComponent },
      { path: 'page-two', component: PageTwoComponent },
      { path: 'page-three', component: PageThreeComponent },
    ],
  },
  {
    path: 'forms',
    component: FormsTemplateComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
