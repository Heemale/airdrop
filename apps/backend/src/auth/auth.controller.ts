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
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

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
  @Post('sign/up')
  async signUp(@Body() signUpDto: SignUpDto) {
    const { username, password } = signUpDto;
    await this.authService.signUp(username, password);
    return 'success';
  }

  @HttpCode(HttpStatus.OK)
  @Post('sign/in')
  async signIn(@Body() signInDto: SignInDto) {
    const { username, password } = signInDto;
    return await this.authService.signIn(username, password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@User() user: typeof User) {
    return user;
  }
}
