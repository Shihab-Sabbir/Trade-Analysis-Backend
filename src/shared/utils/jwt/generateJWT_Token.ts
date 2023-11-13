import jwt, { SignOptions } from 'jsonwebtoken';
import { IUser } from '../../../app/modules/auth/auth.interface';

export const generateJWT_Token = (
  dbUser: Partial<IUser>,
  secret_key: string,
  expire_time: string
) => {
  const token = jwt.sign(
    {
      email: dbUser?.email,
      role: dbUser?.role,
    },
    secret_key,
    {
      expiresIn: expire_time,
    }
  );
  return token;
};
