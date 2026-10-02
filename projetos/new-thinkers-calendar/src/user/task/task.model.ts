import { BelongsTo, Column, ForeignKey, Model, Table, PrimaryKey, IsUUID, DataType, Default } from 'sequelize-typescript';
import { IsISO8601 } from 'class-validator';
import { User } from '../user.model';


@Table
export class Task extends Model {
  
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column
  readonly id: string;

  @Column
  description: string;

  @IsISO8601()
  @Column
  date: Date;

  @ForeignKey(() => User)
  @Column
  userId: string;

  @BelongsTo(() => User)
  user: User;
}
    