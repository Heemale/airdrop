import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@/auth/auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ChangePasswordDto } from '@/auth/dto/change-password.dto';

export const User = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() signUpDto: RegisterDto) {
    const { username, password } = signUpDto;
    await this.authService.register(username, password);
    return 'success';
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() signInDto: LoginDto) {
    const { username, password } = signInDto;
    return await this.authService.login(username, password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    const { username, password } = changePasswordDto;
    return await this.authService.changePassword(username, password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@User() user: typeof User) {
    return user;
  }
}
