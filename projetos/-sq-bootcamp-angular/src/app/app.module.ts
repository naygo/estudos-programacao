import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AgendaComponent } from './agenda/agenda.component';
import { AgendaTaskComponent } from './agenda-task/agenda-task.component';
import { DialogAddTaskComponent } from './dialog-add-task/dialog-add-task.component';
import { TarefasComponent } from './tarefas/tarefas.component';
import { TaskService } from './services/task.service';

import { CoreModule } from './core';
import { FormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';

import { MaterialModule } from './material.module';

@NgModule({
  declarations: [
    AppComponent,
    AgendaComponent,
    AgendaTaskComponent,
    DialogAddTaskComponent,
    TarefasComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CoreModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-br' },
    TaskService
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
