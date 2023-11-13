import { Types } from 'mongoose';
import { IProfile } from './profile.interface';
import { Profile } from './profile.model';

export const ProfileService = {
  getProfile: async (id: string): Promise<IProfile | null> => {
    const profile = await Profile.findOne({ _id: new Types.ObjectId(id) });
    return profile;
  },

  updateProfile: async (id: string, profileData: IProfile): Promise<void> => {
    await Profile.findByIdAndUpdate(id, profileData);
  },
};
