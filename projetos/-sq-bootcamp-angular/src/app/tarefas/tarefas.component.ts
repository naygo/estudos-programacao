import { Component, OnInit } from '@angular/core';

import { Task } from '../services/models/task.model';
import { TaskService } from '../services/task.service';

@Component({
  selector: 'app-tarefas',
  templateUrl: './tarefas.component.html',
  styleUrls: ['./tarefas.component.scss']
})
export class TarefasComponent implements OnInit {

  allTasks: Task[] = [];

  constructor(
    private taskService: TaskService
  ) { }

  ngOnInit(): void {
    this.taskService.onUpdateTasks().subscribe(() => {
      this.init();
    });

    this.init();
  }

  private init(){
    this.listAllTasks();
  }

  listAllTasks() {
    this.taskService
      .listAllTask()
      .subscribe((response: Task[]) =>{
        this.allTasks = response;
      }
      );
  }

}
