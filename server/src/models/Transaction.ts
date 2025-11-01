import mongoose, { Schema } from 'mongoose';

export interface ITransaction {
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    type: { type: String, enum: ['income', 'expense'], required: true },
    amount: { type: Number, required: true, min: 0 },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    date: { type: Date, required: true }
  },
  { timestamps: true }
);

export const Transaction = mongoose.model<ITransaction>('Transaction', TransactionSchema);
