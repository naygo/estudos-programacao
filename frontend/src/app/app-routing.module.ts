import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './views/home/home.component'
import { AnimeCrudComponent } from './views/anime-crud/anime-crud.component'
import { AnimeCreateComponent } from './components/anime/anime-create/anime-create.component';
import { AnimeUpdateComponent } from './components/anime/anime-update/anime-update.component';
import { AnimeDeleteComponent } from './components/anime/anime-delete/anime-delete.component';

const routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: "animes",
    component: AnimeCrudComponent
  },
  {
    path: "animes/create",
    component: AnimeCreateComponent
  },
  {
    path: "animes/update/:id",
    component: AnimeUpdateComponent
  },
  {
    path: "animes/delete/:id",
    component: AnimeDeleteComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
