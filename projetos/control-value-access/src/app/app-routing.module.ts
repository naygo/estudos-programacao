import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValueAccessorComponent } from './value-accessor/value-accessor.component';

const routes: Routes = [
  { path: '', component: ValueAccessorComponent }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
