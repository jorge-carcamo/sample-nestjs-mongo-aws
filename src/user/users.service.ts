import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from './interfaces/users.interface';
import { User } from './schemas/users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User')
    private readonly userRepository: Model<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find().exec();
    /*return usersDocs.map((doc) => ({
      id: doc._id,
      firstname: doc.firstname,
      lastname: doc.lastname,
      year: doc.year,
      isActive: doc.isActive,
    }));*/
  }

  async findOne(id: string): Promise<User> {
    return await this.userRepository.findById({ _id: id }).exec();
    /*return {
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      year: user.year,
      isActive: user.isActive,
    };*/
  }

  async create(createUserDto: CreateUserDto): Promise<IUser> {
    return await this.userRepository.create(createUserDto);
    /*return {
      id: retUser._id,
      firstname: retUser.firstname,
      lastname: retUser.lastname,
      year: retUser.year,
      isActive: retUser.isActive,
    };*/
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<IUser> {
    return await this.userRepository
      .findByIdAndUpdate({ _id: id }, updateUserDto)
      .exec();
    /*return {
      id: foundUser._id,
      firstname: foundUser.firstname,
      lastname: foundUser.lastname,
      year: foundUser.year,
      isActive: foundUser.isActive,
    };*/
  }

  async remove(id: string): Promise<{ deleted: boolean; message?: string }> {
    try {
      await this.userRepository.findByIdAndRemove({ id });
      return { deleted: true };
    } catch (err) {
      return { deleted: false, message: err.message };
    }
  }
}
