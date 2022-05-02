import { Document } from 'mongoose';

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  year: number;
  isActive: boolean;
}
