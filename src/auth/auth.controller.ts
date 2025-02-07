import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { AuthDto } from './dtos/auth.dto';
import { RefreshTokenGuard } from './guard/refreshToken.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //Refresh token
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    const userId = req['user'].sub;
    const refreshToken = req['user'].refreshToken;
    return this.authService.refreshTokens(userId, refreshToken);
  }

  //Login user
  @Post('login')
  async login(@Body() data: AuthDto) {
    return this.authService.login(data);
  }

  //Register user
  @Post('register')
  async register(@Body() registerBody: CreateUserDto) {
    return await this.authService.register(registerBody);
  }

  // @Post()
  // validateUser(@Body() user: { email: string; password: string }) {
  //   console.log(user);
  //   return this.authService.validateUser(user.email, user.password);
  // }
}
