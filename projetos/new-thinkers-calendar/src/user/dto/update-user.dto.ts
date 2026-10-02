import { IsNumberString, IsString, IsEmail, Length } from 'class-validator';

export class UpdateUserDto {
    @IsEmail(undefined, { message: 'O email deve ter o formato correto' })
    email: string;

    @IsNumberString()
    @Length(11, 11)
    phone: string;
}