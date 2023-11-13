import { ICalculatorData } from './calculator.interface';

export const businessHealthService = {
  getBusinessHealths: async (data: ICalculatorData): Promise<number> => {
    const { assets, income, expenses, debts } = data;
    const health =
      Number(assets) + Number(income) - Number(expenses) - Number(debts);
      console.log({health})
    return health;
  },
};
