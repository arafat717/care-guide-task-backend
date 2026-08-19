import { model, Schema } from "mongoose";
import { IUser, Role } from "./user.interface";



const userSchema = new Schema<IUser>({
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
        enum: Object.values(Role),
        default: Role.ADMIN,
        type: String,
    },
    phone: { type: String },
}, { timestamps: true, versionKey: false });


export const User = model<IUser>('User', userSchema);