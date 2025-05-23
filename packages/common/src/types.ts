import {z} from 'zod';

export const createUserSchema = z.object({
  email: z.string().email(),
  username: z.string().min(4).max(20),
  password: z.string().min(6).max(20),
})  

export const SigninSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(20),
});

export const createRoomSchema = z.object({
  slug: z.string().min(3).max(10),
});