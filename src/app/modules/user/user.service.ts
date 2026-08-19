/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { JwtPayload } from "jsonwebtoken";
import { IUser, Role } from "./user.interface";
import { User } from "./user.model";
import bcrypt from "bcryptjs";

const createUserIntoDb = async (payload: Partial<IUser>) => {
    const { email, password } = payload;

    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
        throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password!, 12);

    const user = await User.create({ email, password: hashedPassword});
    return user;
}


const getAllUsersIntoDb = async () => {
    const users = await User.find();
    return users;
}


//  user and guide can't update role, 
//  super admin role can't be updated 
//  admin can't update super admin role
//  only super admin and admin can update isActive, isDeleted, isVerified

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {
    const isUserExist = await User.findById(userId);
    if (!isUserExist) {
        throw new Error("User does not exist");
    }

    if (payload.role) {
        if (decodedToken.role === Role.ADMIN || decodedToken.role === Role.ADMIN) {
            throw new Error("You are not authorized");
        }

        if (payload.role === Role.ADMIN && decodedToken.role === Role.ADMIN) {
            throw new Error("You are not authorized");
        }
    }

   

    if (payload.password) {
        payload.password = await bcrypt.hash(payload.password, 12);
    }

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true });
    return newUpdatedUser;
}


export const userService = {
    createUserIntoDb,
    getAllUsersIntoDb,
    updateUser
};