import z from "zod";

export const createPatientValidationSchema = z.object({
  name: z.string({ required_error: "Name is required" }).min(1),
  email: z.string().email("Please provide a valid email address"),
  age: z.number().int().positive(),
  phone: z.string(),
  address: z.string(),
  condition: z.string(),
});

export const updatePatientValidationSchema = z.object({
  name: z.string({ required_error: "Name is required" }).min(1).optional(),
  email: z.string().email("Please provide a valid email address").optional(),
  age: z.number().int().positive().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  condition: z.string().optional(),
});
