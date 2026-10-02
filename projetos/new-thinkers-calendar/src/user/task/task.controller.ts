import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskService } from './task.service';

@Controller('users/:userId/tasks')
export class TaskController {

    constructor(
        private taskService: TaskService
    ) {}


    @Get()
    findTasks(@Param('userId') userId: string) {
        return this.taskService.findTasks(userId);
    }

    @Post()
    createTask(@Param('userId') userId: string, @Body() createTaskDto: CreateTaskDto) {
        return this.taskService.createTask(createTaskDto, userId);
    }

    @Put(':id')
    updateTask(@Param('userId') userId: string, @Param('id') id: string, @Body() createTaskDto: CreateTaskDto) {
        return this.taskService.updateTask(userId, id, createTaskDto);
    }

    @Delete(':id') 
    deleteTask(@Param('id') id: string, @Param('userId') userId: string) {
        return this.taskService.deleteTask(id, userId);
    }
}
