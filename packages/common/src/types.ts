import {z} from 'zod';

export const createUserSchema = z.object({
  username: z.string().min(3).max(20),
  name: z.string(),
  password: z.string().min(6).max(20),
})  

export const SigninSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6).max(20),
});

export const createRoomSchema = z.object({
  roomName: z.string().min(4).max(8),
});