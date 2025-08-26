import {
  Controller,
  Get,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '../guards/auth.guard';
import { UserId } from '../decorators/userId.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  signup(@Body() SignupDto: SignupDto) {
    return this.authService.signUp(SignupDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() LoginDto: LoginDto) {
    return this.authService.login(LoginDto);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Get('profile')
  getProfile(@UserId() userId: string) {
    return this.authService.getProfile(userId);
  }
}
