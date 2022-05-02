import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'Chile',
    description: 'The firstname of the User',
  })
  firstname: string;

  @ApiProperty({
    example: 'Chile',
    description: 'The lastname of the User',
  })
  lastname: string;

  @ApiProperty({
    example: 18,
    description: 'The year of the Country',
  })
  year: number;

  @ApiProperty({
    example: true,
    description: 'true:Active, false:Inactive',
  })
  isActive: boolean;
}
