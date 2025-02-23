import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class LoginDto {
  @ApiProperty({ example: 'john.doe', description: 'The username' })
  username: string;

  @ApiProperty({ example: 'password123', description: 'The password' })
  password: string;


@ApiProperty({ example: 'ADMIN', description: 'The password' })
  role: Role;
}
