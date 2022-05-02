import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Type,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './schemas/users.schema';
import { IUser } from './interfaces/users.interface';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @ApiResponse({
    status: 200,
    description: 'List all records',
  })
  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: 'Find a record by id',
  })
  @ApiResponse({
    status: 204,
    description: 'Record not found',
  })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id);
  }

  @ApiResponse({
    status: 201,
    description: 'Successfully created record',
  })
  @ApiResponse({
    status: 500,
    description: 'Record not created',
  })
  @Post()
  @HttpCode(201)
  async create(@Body() createUserDto: CreateUserDto): Promise<IUser> {
    return this.userService.create(createUserDto).catch((err) => {
      throw new HttpException(
        {
          message: err.message,
        },
        HttpStatus.NO_CONTENT,
      );
    });
  }

  @ApiResponse({
    status: 200,
    description: 'Successfully updated record',
  })
  @ApiResponse({
    status: 500,
    description: 'Record not updated',
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<IUser> {
    return this.userService.update(id, updateUserDto).catch((err) => {
      throw new InternalServerErrorException(err.message);
    });
  }

  @ApiResponse({
    status: 200,
    description: 'Successfully deleted record',
    schema: {
      type: 'object',
      properties: {
        deleted: {
          type: 'boolean',
          example: true,
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Record not deleted',
  })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ deleted: boolean }> {
    return this.userService.remove(id).catch((err) => {
      throw new InternalServerErrorException(err.message);
    });
  }
}
