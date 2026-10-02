import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { User } from '../user.model';
import { Task } from './task.model';
import { CreateTaskDto } from '../dto/create-task.dto';

@Injectable()
export class TaskService {
    
    constructor(
        @InjectModel(Task)
        private taskModel: typeof Task,

        @InjectModel(User)
        private userModel: typeof User
    ) {}
    
    private async findUser(userId: string) {
        const user = await this.userModel.findOne({ 
            where: { id: userId } 
        });       

        if(!user)
            throw new NotFoundException('Usuário não encontrado');
    }

    private async findTask(id: string) {
        const task = await this.taskModel.findOne({
            where: { id }
        });

        if(!task)
            throw new NotFoundException('Tarefa não encontrada');
    }

    findTasks(userId: string) {
        return this.taskModel.findAll({ where: { userId } });
    }

    async createTask(createTaskDto: CreateTaskDto, userId: string) {
        await this.findUser(userId);
        
        const date = new Date(createTaskDto.date).getTime();        

        const tasks = {
            userId,
            description: createTaskDto.description,
            date,           
        }
        
        console.log(tasks);

        return this.taskModel.create(tasks);
    }

    async updateTask(userId: string, id: string, createTaskDto: CreateTaskDto) {
        
        await this.findUser(userId);
        await this.findTask(id);

        return this.taskModel.update(createTaskDto, { where: { id } });
    }

    async deleteTask(id: string, userId: string) {
        
        await this.findUser(userId);
        await this.findTask(id);

        return this.taskModel.destroy({ where: { id } });
    }
}
