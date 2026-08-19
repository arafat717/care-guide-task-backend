import { Types } from "mongoose";

export interface IAuthProvider {
    provider: 'google' | 'credentials';
    providerId: string;
}


export enum Role {
    ADMIN = 'ADMIN',
    DOCTOR = 'DOCTOR',
    PATIENT = 'PATIENT'
}

export interface IDoctor {
    _id?: Types.ObjectId,
    name: string;
    email: string;
    hospital: string;
    role: Role;
    phone?: string;
    specialization?: string;
}
