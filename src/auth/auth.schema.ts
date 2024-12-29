import { z } from "zod";

export const registerSchema = z.object({
	username: z.string().nonempty(),
	email: z.string().email().nonempty(),
	password: z.string().min(6),
	avatar: z.string().optional(),
});

export const loginSchema = z.object({
	email: z.string().email().nonempty(),
	password: z.string().min(6),
});

export type RegisterDTO = z.infer<typeof registerSchema>;
export type LoginDTO = z.infer<typeof loginSchema>;
