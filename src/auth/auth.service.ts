import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { AuthDto } from './dtos/auth.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  //Validate user
  async validateUser(email: string, password: string): Promise<User> {
    const user: User = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    const isMatch: boolean = bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Password does not match');
    }
    return user;
  }

  //Login
  async login(user: AuthDto): Promise<any> {
    // Check if user exists
    const existingUser = await this.userService.findOneByEmail(user.email);
    if (!existingUser) {
      throw new BadRequestException('User does not exist');
    }

    //Match password
    const passwordMatches = bcrypt.compare(
      existingUser.password,
      user.password,
    );
    if (!passwordMatches)
      throw new BadRequestException('Password is incorrect');

    //get and update token
    const tokens = await this.getTokens(
      existingUser.email,
      existingUser.username,
    );
    await this.updateRefreshToken(existingUser.email, tokens.refreshToken);
    return tokens;
  }

  //Register
  async register(user: CreateUserDto): Promise<any> {
    // Check if user exists
    const existingUser = await this.userService.findOneByEmail(user.email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = { ...user, password: hashedPassword };
    await this.userService.createUser(newUser);

    //get and update token
    const tokens = await this.getTokens(newUser.email, newUser.username);
    await this.updateRefreshToken(newUser.email, tokens.refreshToken);
    return tokens;
  }

  //Update refresh token
  async updateRefreshToken(userId: string, refreshToken: string) {
    //hash refreshToken
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    //update with hashed refresh token
    await this.userService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  //Get tokens access token and refresh token
  async getTokens(userId: string, username: string) {
    //set secret key and expiration time
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: 'monsuperstrongpasswordaccess',
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
        },
        {
          secret: 'monsuperstrongpasswordrefresh',
          expiresIn: '7d',
        },
      ),
    ]);

    //return tokens
    return {
      accessToken,
      refreshToken,
    };
  }

  // Refreshing the tokens
  async refreshTokens(email: string, refreshToken: string) {
    //get user by email
    const user = await this.userService.findOneByEmail(email);

    //check if user or refresh token exists
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');

    //match refresh tokens
    const refreshTokenMatches = bcrypt.compare(user.refreshToken, refreshToken);
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    ////get and update token
    const tokens = await this.getTokens(user.email, user.username);
    await this.updateRefreshToken(user.email, tokens.refreshToken);
    return tokens;
  }
}
