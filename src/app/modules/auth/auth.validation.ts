import { z } from 'zod';
import { ENUM_USER_ROLE } from '../../../shared/enums/user';

export const loginZodSchema = z.object({
  body: z
    .object({
      email: z.string({
        required_error: 'Email is required',
      }),
      password: z.string({
        required_error: 'Password is required',
      }),
      remember: z.boolean().optional(),
    })
    .strict(),
});

export const createUserZodSchema = z.object({
  body: z.object({
    id: z.string().optional(),
    role: z
      .enum([ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.USER, ENUM_USER_ROLE.MENTOR])
      .optional(),

    firstName: z.string(),
    lastName: z.string(),
    contactNumber: z.string().optional(),
    email: z.string().email(),
    password: z.string({ required_error: 'Password is required' }),
    companyName: z.string({ required_error: 'company is required' }),
  }),
});

export const refreshTokenZodSchema = z.object({
  cookies: z
    .object({
      refreshToken: z.string({
        required_error: 'Refresh token is required',
      }),
    })
    .strict(),
});

export const changePasswordZodSchema = z.object({
  body: z
    .object({
      oldPassword: z.string({
        required_error: 'Old password is required',
      }),
      newPassword: z.string({
        required_error: 'New password is required',
      }),
    })
    .strict(),
});
