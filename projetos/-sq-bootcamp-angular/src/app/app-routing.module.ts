import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgendaComponent } from './agenda/agenda.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { TarefasComponent } from './tarefas/tarefas.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'agenda'
  },
  {
    path: 'agenda',
    component: AgendaComponent
  },
  {
    path: 'tarefas',
    component: TarefasComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
