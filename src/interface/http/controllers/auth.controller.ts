import {
  AuthResponseDto,
  GetMeUseCase,
  LoginDto,
  LoginUseCase,
  LogoutUseCase,
  RefreshTokenDto,
  RefreshTokenUseCase,
  SignupDto,
  SignupUseCase,
} from '@/application/auth';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser, Public } from '../decorators';
import { TokenPayload } from '@/domain/auth';
import { UserResponseDto } from '../../../application/user';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly getMeUseCase: GetMeUseCase,
    private readonly signupUseCase: SignupUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
  ) {}

  @Post('signup')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  async signup(@Body() dto: SignupDto): Promise<AuthResponseDto> {
    return this.signupUseCase.execute(dto);
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.loginUseCase.execute(dto);
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renew access token' })
  async refresh(@Body() dto: RefreshTokenDto): Promise<AuthResponseDto> {
    return this.refreshTokenUseCase.execute(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout - revoke the refresh token' })
  async logout(@Body() dto: RefreshTokenDto): Promise<void> {
    return this.logoutUseCase.execute(dto);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'returns authenticared user' })
  async me(@CurrentUser() user: TokenPayload): Promise<UserResponseDto> {
    return this.getMeUseCase.execute(user.sub);
  }
}
