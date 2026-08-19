import { z } from "zod";
import { Role } from "./doctor.interfce";

export const createDoctorValidationSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),

  email: z.string().email("Please provide a valid email address"),

  role: z
    .enum(Object.values(Role) as [string, ...string[]])
    .default(Role.DOCTOR),

  phone: z
    .string()
    .regex(
      /^(?:\+8801|01)[3-9]\d{8}$/,
      "Please provide a valid Bangladeshi phone number",
    ),
  specialization: z
    .string()
    .min(2, "Specialization is required")
    .max(100, "Specialization must not exceed 100 characters"),
});
