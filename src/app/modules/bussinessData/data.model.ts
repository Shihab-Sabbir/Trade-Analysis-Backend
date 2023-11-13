import { Schema, model, Model, Document } from 'mongoose';
import { IBusinessHealth, IFormData } from './data.interface';

interface IBusinessHealthDocument extends IBusinessHealth, Document {
  calculateCurrentRatio(): number;
  calculateQuickRatio(): number;
  calculateDebtToEquityRatio(): number;
  calculateNetProfitMargin(): number;
}

const DataSchema = new Schema<IFormData>(
  {
    assets: { type: Number, required: true },
    expenses: { type: Number, required: true },
    debts: { type: Number, required: true },
    income: { type: Number, required: true },
  },
  { _id: false }
);

const BusinessHealthSchema = new Schema<IBusinessHealthDocument>(
  {
    data: {
      type: DataSchema,
      required: true,
    },
    year: { type: String, required: true },
    month: { type: String, required: true },
    owner: { type: String },
    lastMonth: {
      type: DataSchema,
    },
    health: { type: String },
    currentRatio: { type: Number },
    quickRatio: { type: Number },
    debtToEquityRatio: { type: Number },
    netProfitMargin: { type: Number },
  },
  { timestamps: true }
);

BusinessHealthSchema.index({ year: 1, month: 1 }, { unique: true });

BusinessHealthSchema.pre<IBusinessHealthDocument>(
  'save',
  async function (next) {
    const currentDate = new Date(Number(this.year), Number(this.month));
    const owner = this.owner;
    let entryLength = await BusinessHealthModel.countDocuments();

    let lastMonthData = await BusinessHealthModel.findOne({
      year: this.year,
      month: (Number(this.month) - 1).toString(),
      owner: owner,
    });

    if (!lastMonthData) {
      let searchDate = new Date(currentDate);

      while (entryLength > -1 && !lastMonthData) {
        if (searchDate.getMonth() === 0) {
          searchDate.setFullYear(searchDate.getFullYear() - 1);
          searchDate.setMonth(11);
        } else {
          searchDate.setMonth(searchDate.getMonth() - 1);
        }
        console.log(
          {
            searchDate,
            year: searchDate.getFullYear().toString(),
            month: (searchDate.getMonth() + 1).toString(),
          },
          entryLength,
          lastMonthData
        );
        lastMonthData = await BusinessHealthModel.findOne({
          year: searchDate.getFullYear().toString(),
          month: (searchDate.getMonth() + 1).toString(),
          owner: owner,
        });

        entryLength--;
      }
    }

    if (lastMonthData) {
      this.lastMonth = {
        data: {
          assets: lastMonthData.data.assets,
          expenses: lastMonthData.data.expenses,
          debts: lastMonthData.data.debts,
          income: lastMonthData.data.income,
        },
        year: lastMonthData.year,
        month: lastMonthData.month,
        health: lastMonthData.health,
      };
    }

    // Calculate ratios
    const currentRatio = this.calculateCurrentRatio();
    const quickRatio = this.calculateQuickRatio();
    const debtToEquityRatio = this.calculateDebtToEquityRatio();
    const netProfitMargin = this.calculateNetProfitMargin();

    this.currentRatio = currentRatio;
    this.quickRatio = quickRatio;
    this.debtToEquityRatio = debtToEquityRatio;
    this.netProfitMargin = netProfitMargin;

    const scoreDebtToEquityRatio = (1 / (debtToEquityRatio + 1)) * 100;

    const overallHealthScore =
      currentRatio + quickRatio - scoreDebtToEquityRatio + netProfitMargin;

    this.health = Math.min(100, Math.max(0, overallHealthScore)).toFixed(2);

    next();
  }
);

BusinessHealthSchema.methods.calculateCurrentRatio = function (): number {
  return this.data.assets / this.data.debts;
};

BusinessHealthSchema.methods.calculateQuickRatio = function (): number {
  return (this.data.assets - this.data.expenses) / this.data.debts;
};

BusinessHealthSchema.methods.calculateDebtToEquityRatio = function (): number {
  return this.data.debts;
};

BusinessHealthSchema.methods.calculateNetProfitMargin = function (): number {
  return ((this.data.income - this.data.expenses) / this.data.income) * 100;
};

const BusinessHealthModel: Model<IBusinessHealthDocument> = model(
  'BusinessHealth',
  BusinessHealthSchema
);

export default BusinessHealthModel;
