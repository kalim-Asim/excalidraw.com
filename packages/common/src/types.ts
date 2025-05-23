import {z} from 'zod';

export const createUserSchema = z.object({
  email: z.string().email().min(3).max(20),
  username: z.string().min(4).max(20),
  password: z.string().min(6).max(20),
})  

export const SigninSchema = z.object({
  email: z.string().email().min(3).max(20),
  password: z.string().min(6).max(20),
});

export const createRoomSchema = z.object({
  roomName: z.string().min(4).max(8),
});