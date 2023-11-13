import { IUser } from "../auth/auth.interface";
import { User } from "../auth/auth.model";


export const UserService = {
  getUsers: async (): Promise<IUser[]> => {
    const users = await User.find();
    return users;
  },

  getUser: async (id: string): Promise<IUser | null> => {
    const user = await User.findOne({ id });
    return user;
  },

  updateUser: async (id: string, userData: IUser): Promise<void> => {
    await User.findOneAndUpdate({ id }, userData);
  },

  deleteUser: async (id: string): Promise<void> => {
    await User.findOneAndDelete({ id });
  },
};
