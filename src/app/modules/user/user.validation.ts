import { Types } from "mongoose";
import { z } from "zod";

export const createUserSchema = z.object({
    name: z.string().min(2, "Name is required").max(100, "Name is too long"),
    email: z.string().email("Invalid email address"),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),
    phone: z.string().optional(),
    address: z.string().optional(),
});


export const isActiveEnum = z.enum([
    "ACTIVE",
    "INACTIVE",
    "BLOCKED",
]);

export const roleEnum = z.enum([
    "SUPER_ADMIN",
    "ADMIN",
    "USER",
    "GUIDE",
]);

const objectIdSchema = z
    .string()
    .refine((val) => Types.ObjectId.isValid(val), {
        message: "Invalid MongoDB ObjectId",
    });

export const authProviderSchema = z.object({
    provider: z.string().min(1),
    providerId: z.string().min(1),
});

export const updateUserSchema = z
    .object({
        name: z.string().min(1).optional(),
        password: z.string().min(6).optional(),
        role: roleEnum.optional(),
        phone: z.string().optional(),
        picture: z.string().url().optional(),
        address: z.string().optional(),
        isDeleted: z.boolean().optional(),
        isActive: isActiveEnum.optional(),
        isVerified: z.boolean().optional(),
        auths: z.array(authProviderSchema).optional(),
        booking: z.array(objectIdSchema).optional(),
        guides: z.array(objectIdSchema).optional(),
    })
    .strict();