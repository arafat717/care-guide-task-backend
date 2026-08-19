import { Types } from "mongoose";

export interface IPatient {
  _id?: string;
  name: string;
  email: string;
  age?: number;
  phone?: string;
  condition?: string;
  appointmentDate: Date;
  address?: string;
  doctor: Types.ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}
