import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../user.model';

import { TaskController } from './task.controller';
import { Task } from './task.model';
import { TaskService } from './task.service';

@Module({
  imports: [
    SequelizeModule.forFeature([Task]), 
    SequelizeModule.forFeature([User])
  ], 
  controllers: [TaskController], 
  providers: [TaskService],
})
export class TaskModule {}
