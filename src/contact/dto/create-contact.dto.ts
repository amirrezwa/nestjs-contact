import { ApiProperty } from '@nestjs/swagger';

export class CreateContactDto {
  @ApiProperty({
    example: 'firstName',
    description: 'Unique identifier for the invoice',
  })
  firstName: string;

  @ApiProperty({
    example: 'lastName',
    description: 'Unique identifier for the invoice',
  })
  lastName: string;

  @ApiProperty({
    example: 'email@gmail.com',
    description: 'Unique identifier for the invoice',
  })
  email?: string;

  @ApiProperty({
    example: '09123456789',
    description: 'Unique identifier for the invoice',
  })
  phone: string;

  @ApiProperty({
    example: 'address',
    description: 'Unique identifier for the invoice',
  })
  address?: string;

  @ApiProperty({
    example: 'userId',
    description: 'Unique identifier for the invoice',
  })
  userId: number;

}
