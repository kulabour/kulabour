import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    create(@Body() createUserDto: any) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    findAll() {
        return this.usersService.findAll();
    }

    @Get(':mobile')
    findOne(@Param('mobile') mobile: string) {
        return this.usersService.findByMobile(mobile);
    }

    @Post(':id/fcm-token')
    // @UseGuards(JwtAuthGuard) // TODO: Uncomment when integrated with mobile auth
    updateFcm(@Param('id') id: string, @Body('token') token: string) {
        return this.usersService.updateFcmToken(id, token);
    }
}
