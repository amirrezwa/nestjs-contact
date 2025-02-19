import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from './enums/role.enum';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(user: { username: string; password: string }) {
    // In a real application, validate user credentials here
    // For demo purposes, we'll just check if username and password are provided
    if (user.username && user.password) {
      // For demo purposes, we'll assign some roles
      const roles = [Role.USER];
      if (user.username === 'admin') {
        roles.push(Role.ADMIN);
      }

      const payload = {
        username: user.username,
        sub: 1,
        roles: roles,
      };

      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    return null;
  }
} 