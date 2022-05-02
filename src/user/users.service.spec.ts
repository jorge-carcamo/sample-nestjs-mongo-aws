import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model, Query } from 'mongoose';
import { UsersService } from './users.service';
import { createMock } from '@golevelup/ts-jest';
import { User } from './schemas/users.schema';
import { IUser } from './interfaces/users.interface';

const userDoc: any = {
  id: 'uuid1',
  firstname: 'Rodrigo',
  lastname: 'Rodriguez',
  year: 19,
  isActive: true,
};

const userDocArray = [
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
];

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: Model<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken('User'),
          useValue: {
            new: jest.fn().mockResolvedValue(userDoc),
            constructor: jest.fn().mockResolvedValue(userDoc),
            find: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            create: jest.fn(),
            findByIdAndRemove: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<Model<User>>(getModelToken('User'));
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all users', async () => {
    jest.spyOn(usersRepository, 'find').mockReturnValue({
      exec: jest.fn().mockResolvedValueOnce(userDocArray),
    } as any);
    const users = await usersService.findAll();
    expect(users).toEqual(userDocArray);
  });

  it('should findOne by id', async () => {
    jest.spyOn(usersRepository, 'findById').mockReturnValueOnce(
      createMock<Query<IUser, IUser>>({
        exec: jest.fn().mockResolvedValueOnce({
          id: 'uuid1',
          firstname: 'Rodrigo',
          lastname: 'Rodriguez',
          year: 19,
          isActive: true,
        }),
      }) as any,
    );
    const findMockUser = {
      id: 'uuid1',
      firstname: 'Rodrigo',
      lastname: 'Rodriguez',
      year: 19,
      isActive: true,
    };
    const foundUser = await usersService.findOne('uuid1');
    expect(foundUser).toEqual(findMockUser);
  });

  it('should insert a new user', async () => {
    jest.spyOn(usersRepository, 'create').mockImplementationOnce(() =>
      Promise.resolve({
        id: 'uuid1',
        firstname: 'Juan',
        lastname: 'Perez',
        year: 33,
        isActive: true,
      }),
    );
    const newUser = await usersService.create({
      firstname: 'Juan',
      lastname: 'Perez',
      year: 33,
      isActive: true,
    });
    expect(newUser).toEqual({
      id: 'uuid1',
      firstname: 'Juan',
      lastname: 'Perez',
      year: 33,
      isActive: true,
    });
  });

  it('should update a user successfully', async () => {
    jest.spyOn(usersRepository, 'findByIdAndUpdate').mockReturnValueOnce(
      createMock<Query<IUser, IUser>>({
        exec: jest.fn().mockResolvedValueOnce({
          id: 'uuid1',
          firstname: 'Juan',
          lastname: 'Perez',
          year: 33,
          isActive: true,
        }),
      }) as any,
    );
    const updatedUser = await usersService.update('uuid1', {
      firstname: 'Juan',
      lastname: 'Perez',
      year: 33,
      isActive: true,
    });
    expect(updatedUser).toEqual({
      id: 'uuid1',
      firstname: 'Juan',
      lastname: 'Perez',
      year: 33,
      isActive: true,
    });
  });

  it('should delete a user successfully', async () => {
    jest
      .spyOn(usersRepository, 'findByIdAndRemove')
      .mockResolvedValueOnce(true as any);
    expect(await usersService.remove('a bad id')).toEqual({ deleted: true });
  });

  it('should not delete a user', async () => {
    jest
      .spyOn(usersRepository, 'findByIdAndRemove')
      .mockRejectedValueOnce(new Error('Bad delete'));
    expect(await usersService.remove('a bad id')).toEqual({
      deleted: false,
      message: 'Bad delete',
    });
  });
});
