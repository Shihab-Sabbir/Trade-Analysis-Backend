import { Schema, model } from 'mongoose';
import { IUser, IUserModel, LOCKED_REASON_ENUM } from './auth.interface';
import bcrypt from 'bcrypt';
import { BCRYPT_SALT_ROUNDS, DEFAULT_PASS } from '../../../config';
import { ENUM_USER_ROLE } from '../../../shared/enums/user';

const UserSchema = new Schema<IUser, {}, IUserModel>(
  {
    role: {
      type: String,
      enum: Object.values(ENUM_USER_ROLE),
      default: ENUM_USER_ROLE.USER,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    companyName: {
      type: String,
      required: true,
    },
    needsPasswordChange: {
      type: Boolean,
      default: false,
    },
    isLocked: {
      status: {
        type: Boolean,
        default: false,
      },
      reason: {
        type: String,
        enum: Object.values(LOCKED_REASON_ENUM),
      },
    },
    refreshToken: {
      type: [String],
    },
    invalidLoginAttemps: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.static(
  'isPasswordMatched',
  function isPasswordMatched(
    password: string | Buffer,
    savedPassword: string | Buffer
  ) {
    return bcrypt.compare(password, savedPassword as string);
  }
);

UserSchema.methods.getResponseFields = function () {
  const {
    firstName,
    lastName,
    role,
    contactNumber,
    email,
    department,
    companyName,
  } = this.toObject();
  const selectedData = {
    firstName,
    lastName,
    role,
    contactNumber,
    email,
    department,
    companyName,
  };
  return selectedData;
};

UserSchema.pre('save', async function (next) {
  const user = this;
  if (user.isNew) {
    const password = user.password || (DEFAULT_PASS as string);
    user.password = await bcrypt.hash(password, Number(BCRYPT_SALT_ROUNDS));
  }
  next();
});

export const User = model<IUser, IUserModel>('User', UserSchema);
