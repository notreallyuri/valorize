import { z } from "zod";

export const UserSchema = z.object({
  email: z.string().email(),
  cpf: z.string().length(11),
  password: z.string().min(8),
  name: z.string(),
});

export const UserUpdate = UserSchema.partial().extend({ id: z.string() });
export const LoginSchema = UserSchema.omit({ name: true });

export type UserSchema = z.infer<typeof UserSchema>;
export type LoginSchema = z.infer<typeof LoginSchema>;
export type UserUpdate = z.infer<typeof UserUpdate>;
