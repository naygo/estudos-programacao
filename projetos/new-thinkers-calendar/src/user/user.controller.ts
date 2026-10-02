import { Body, Controller, Param, Post, Put, Get, Delete, Query } from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindUsersDto } from './dto/find-users.dto';

@Controller('users')
export class UserController {

    constructor(
        private userService: UserService,
    ) {}
    
   @Get()
    findUser(@Query() findUsersDto: FindUsersDto) {
        return this.userService.findUsers(findUsersDto);
    }

    @Post()
    createUser(@Body() createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

    @Put(':id')
    updateUser(@Body() updateUserDto: UpdateUserDto, @Param('id') id:string) {
        return this.userService.updateUser(id, updateUserDto);
    }

    @Delete(':id')
    async deleteUser(@Param('id') id: string): Promise<number> {
        return await this.userService.deleteUser(id);
    }
    
}
