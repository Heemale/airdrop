import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { createAdmin, getAdmin, upsertAdmin } from '@/admin/dao/admin.dao';
import { getRandomBetween } from '@/utils/random';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  register = async (username: string, password: string) => {
    const user = await getAdmin(username);
    if (user) {
      throw new HttpException('USER_REGISTERED.', HttpStatus.BAD_REQUEST);
    }

    try {
      const saltRounds = getRandomBetween(0, 10);
      const salt = await bcrypt.genSalt(saltRounds);
      const passwordHash = await bcrypt.hash(password, salt);
      await createAdmin({
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
  };

  login = async (username: string, password: string) => {
    const user = await getAdmin(username);
    if (!user) {
      throw new Error(`USER_NO_EXIST.`);
    }

    const { id, password: storedHashedPassword, salt } = user;
    const hashedPassword = await bcrypt.hash(password, salt);
    const matched = storedHashedPassword === hashedPassword;
    if (!matched) {
      throw new UnauthorizedException();
    }

    const payload = { id, username };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      id,
      username,
      accessToken,
    };
  };

  changePassword = async (username: string, newPassword: string) => {
    const user = await getAdmin(username);
    if (!user) {
      throw new HttpException('USER_NOT_FOUND.', HttpStatus.NOT_FOUND);
    }

    try {
      const saltRounds = getRandomBetween(0, 10);
      const salt = await bcrypt.genSalt(saltRounds);
      const passwordHash = await bcrypt.hash(newPassword, salt);

      await upsertAdmin({
        username,
        password: passwordHash,
        salt,
      });
    } catch ({ message }) {
      throw new HttpException(
        `PASSWORD_UPDATE_FAILED: ${message}.`,
        HttpStatus.BAD_REQUEST,
      );
    }
  };
}
