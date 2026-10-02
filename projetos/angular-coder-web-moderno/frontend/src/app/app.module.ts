import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'

import { HomeComponent } from './views/home/home.component';
import { AnimeCrudComponent } from './views/anime-crud/anime-crud.component';
import { NavComponent } from './components/template/nav/nav.component'
import { FooterComponent } from './components/template/footer/footer.component';
import { HeaderComponent } from './components/template/header/header.component';
import { AnimeCreateComponent } from './components/anime/anime-create/anime-create.component'

import { RedDirective } from './directives/red.directive';

import { HttpClientModule } from '@angular/common/http';
import { AnimeReadComponent } from './components/anime/anime-read/anime-read.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { AnimeUpdateComponent } from './components/anime/anime-update/anime-update.component';
import { AnimeDeleteComponent } from './components/anime/anime-delete/anime-delete.component'


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NavComponent,
    HomeComponent,
    AnimeCrudComponent,
    AnimeCreateComponent,
    
    RedDirective,
    
    AnimeReadComponent,
    
    AnimeUpdateComponent,
    
    AnimeDeleteComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,

    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,

    HttpClientModule,

    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
