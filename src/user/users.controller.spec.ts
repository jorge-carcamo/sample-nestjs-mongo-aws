import {
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const httpExcepion = new HttpException(
  {
    message: 'error',
  },
  HttpStatus.NO_CONTENT,
);

const internalServerError = new InternalServerErrorException('error');

describe('User Controller', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([
              {
                id: 'uuid1',
                firstname: 'Rodrigo',
                lastname: 'Rodriguez',
                year: 19,
                isActive: true,
              },
              {
                id: 'uuid2',
                firstname: 'Juan',
                lastname: 'Perez',
                year: 33,
                isActive: true,
              },
              {
                id: 'uuid3',
                firstname: 'Hernan',
                lastname: 'Hernandez',
                year: 24,
                isActive: false,
              },
            ]),
            findOne: jest.fn().mockImplementation((id: string) =>
              Promise.resolve({
                id: 'uuid1',
                firstname: 'Rodrigo',
                lastname: 'Rodriguez',
                year: 19,
                isActive: true,
              }),
            ),
            create: jest.fn().mockImplementation((user: CreateUserDto) =>
              Promise.resolve({
                id: 'uuid1',
                firstname: 'Rodrigo',
                lastname: 'Rodriguez',
                year: 19,
                isActive: true,
              }),
            ),
            update: jest.fn().mockImplementation((user: UpdateUserDto) =>
              Promise.resolve({
                id: 'uuid1',
                firstname: 'Rodrigo',
                lastname: 'Rodriguez',
                year: 19,
                isActive: true,
              }),
            ),
            remove: jest.fn().mockResolvedValue({ deleted: true }),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('findAll', () => {
    it('should get an array of users', () => {
      expect(usersController.findAll()).resolves.toEqual([
        {
          id: 'uuid1',
          firstname: 'Rodrigo',
          lastname: 'Rodriguez',
          year: 19,
          isActive: true,
        },
        {
          id: 'uuid2',
          firstname: 'Juan',
          lastname: 'Perez',
          year: 33,
          isActive: true,
        },
        {
          id: 'uuid3',
          firstname: 'Hernan',
          lastname: 'Hernandez',
          year: 24,
          isActive: false,
        },
      ]);
    });
  });

  describe('findOne', () => {
    it('should get a single user', () => {
      expect(usersController.findOne('uuid1')).resolves.toEqual({
        id: 'uuid1',
        firstname: 'Rodrigo',
        lastname: 'Rodriguez',
        year: 19,
        isActive: true,
      });
    });
  });

  describe('findOneException', () => {
    it('should get a Exception', async () => {
      jest.spyOn(usersService, 'findOne').mockRejectedValue(httpExcepion);
      await expect(usersController.findOne('uuid1')).rejects.toEqual(
        httpExcepion,
      );
    });
  });

  describe('create', () => {
    it('should create a new user', () => {
      const newUserDTO: CreateUserDto = {
        firstname: 'Rodrigo',
        lastname: 'Rodriguez',
        year: 19,
        isActive: true,
      };
      expect(usersController.create(newUserDTO)).resolves.toEqual({
        id: 'uuid1',
        ...newUserDTO,
      });
    });
  });

  describe('createError', () => {
    it('should get a Error', async () => {
      const newUserDTO: CreateUserDto = {
        firstname: 'Rodrigo',
        lastname: 'Rodriguez',
        year: 19,
        isActive: true,
      };
      jest.spyOn(usersService, 'create').mockRejectedValue(internalServerError);
      await expect(usersController.create(newUserDTO)).rejects.toEqual(
        internalServerError,
      );
    });
  });

  describe('update', () => {
    it('should update a new user', () => {
      const updUserDTO: CreateUserDto = {
        firstname: 'Rodrigo',
        lastname: 'Rodriguez',
        year: 19,
        isActive: true,
      };
      expect(usersController.update('uuid1', updUserDTO)).resolves.toEqual({
        id: 'uuid1',
        ...updUserDTO,
      });
    });
  });

  describe('updateError', () => {
    it('should get a Error', async () => {
      const updUserDTO: CreateUserDto = {
        firstname: 'Rodrigo',
        lastname: 'Rodriguez',
        year: 19,
        isActive: true,
      };
      jest.spyOn(usersService, 'update').mockRejectedValue(internalServerError);
      await expect(usersController.update('uuid1', updUserDTO)).rejects.toEqual(
        internalServerError,
      );
    });
  });

  describe('remove', () => {
    it('should return that it deleted a user', () => {
      expect(usersController.remove('a uuid that exists')).resolves.toEqual({
        deleted: true,
      });
    });
    it('should return that it did not delete a user', () => {
      const deleteSpy = jest
        .spyOn(usersService, 'remove')
        .mockResolvedValueOnce({ deleted: false });
      expect(
        usersController.remove('a uuid that does not exist'),
      ).resolves.toEqual({ deleted: false });
      expect(deleteSpy).toBeCalledWith('a uuid that does not exist');
    });
  });

  describe('removeError', () => {
    it('should get a Error', async () => {
      jest.spyOn(usersService, 'remove').mockRejectedValue(internalServerError);
      await expect(
        usersController.remove('a uuid that does not exist'),
      ).rejects.toEqual(internalServerError);
    });
  });
});
