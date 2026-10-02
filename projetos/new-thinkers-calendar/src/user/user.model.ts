import { Column, HasMany, Model, Table, PrimaryKey, IsUUID, Default, DataType } from 'sequelize-typescript';
import { Task } from './task/task.model';

@Table
export class User extends Model {

  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column
  readonly id: string;

  @Column
  name: string;

  @Column
  email: string;

  @Column
  password: string;

  @Column
  phone: string;

  @HasMany(() => Task)
  tasks: Task[];
}
