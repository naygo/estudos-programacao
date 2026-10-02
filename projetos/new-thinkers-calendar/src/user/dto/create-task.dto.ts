import { IsString, IsDate, IsDateString } from 'class-validator';
export class CreateTaskDto {
    
    @IsString()
    description: string;

    @IsDateString()
    date: Date;
}