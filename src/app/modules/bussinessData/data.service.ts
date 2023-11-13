import { IBusinessHealth } from './data.interface';
import BusinessHealthModel from './data.model';

export const BusinessHealthService = {
  getBusinessHealths: async (): Promise<IBusinessHealth[]> => {
    const businessHealths = await BusinessHealthModel.find();
    return businessHealths;
  },

  getBusinessHealth: async (id: string): Promise<IBusinessHealth | null> => {
    const businessHealth = await BusinessHealthModel.findOne({ _id: id });
    return businessHealth;
  },

  createBusinessHealth: async (
    businessHealthData: IBusinessHealth
  ): Promise<void> => {
    const businessHealth = new BusinessHealthModel(businessHealthData);
    await businessHealth.save();
  },

  updateBusinessHealth: async (
    id: string,
    businessHealthData: IBusinessHealth
  ): Promise<void> => {
    await BusinessHealthModel.findByIdAndUpdate(id, businessHealthData);
  },

  deleteBusinessHealth: async (id: string): Promise<void> => {
    await BusinessHealthModel.findByIdAndDelete(id);
  },
};
