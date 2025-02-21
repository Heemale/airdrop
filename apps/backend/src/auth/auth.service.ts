import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { create, getAdmin } from '@/admin/dao/admin.dao';
import { getRandomBetween } from '@/utils/random';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  register = async (username: string, password: string) => {
    const user = await getAdmin(username);

    if (user) {
      throw new HttpException('USER_REGISTERED.', HttpStatus.BAD_REQUEST);
    } else {
      try {
        const saltRounds = getRandomBetween(0, 10);
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);
        await create({
          username,
          password: passwordHash,
          salt,
        });
      } catch ({ message }) {
        throw new HttpException(
          'USER_CREATE_FAILED:${message}.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  };

  login = async (username: string, password: string) => {
    const user = await getAdmin(username);

    if (user) {
      const { id, password: storedHashedPassword, salt } = user;
      const hashedPassword = await bcrypt.hash(password, salt);
      const matched = storedHashedPassword === hashedPassword;

      if (matched) {
        const payload = { id, username };
        const accessToken = await this.jwtService.signAsync(payload);

        return {
          id,
          username,
          accessToken,
        };
      } else {
        throw new UnauthorizedException();
      }
    } else {
      throw new Error(`USER_NO_EXIST.`);
    }
  };
}
