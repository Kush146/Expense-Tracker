import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import { z } from 'zod';
import { Transaction } from './models/Transaction.js';
import { transactionBodySchema, transactionQuerySchema } from './validators/transaction.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: true }));
app.use(express.json());
app.use(morgan('dev'));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/expense_tracker';
const PORT = Number(process.env.PORT || 4000);

async function connectDB() {
  await mongoose.connect(MONGODB_URI);
  console.log('✅ MongoDB connected');
}
connectDB().catch((e) => {
  console.error('Mongo connection error', e);
  process.exit(1);
});

// Health
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Create
app.post('/api/transactions', async (req, res) => {
  try {
    const parsed = transactionBodySchema.parse(req.body);
    const created = await Transaction.create(parsed);
    res.status(201).json(created);
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.flatten() });
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Read (list + filters)
app.get('/api/transactions', async (req, res) => {
  try {
    const q = transactionQuerySchema.parse(req.query);
    const filter: any = {};
    if (q.type) filter.type = q.type;
    if (q.category) filter.category = q.category;
    if (q.startDate || q.endDate) {
      filter.date = {};
      if (q.startDate) filter.date.$gte = new Date(q.startDate);
      if (q.endDate) filter.date.$lte = new Date(q.endDate);
    }
    const items = await Transaction.find(filter).sort({ date: -1, createdAt: -1 });
    res.json(items);
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.flatten() });
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Read one
app.get('/api/transactions/:id', async (req, res) => {
  try {
    const it = await Transaction.findById(req.params.id);
    if (!it) return res.status(404).json({ error: 'Not found' });
    res.json(it);
  } catch {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update
app.put('/api/transactions/:id', async (req, res) => {
  try {
    const parsed = transactionBodySchema.parse(req.body);
    const it = await Transaction.findByIdAndUpdate(req.params.id, parsed, { new: true });
    if (!it) return res.status(404).json({ error: 'Not found' });
    res.json(it);
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.flatten() });
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete
app.delete('/api/transactions/:id', async (req, res) => {
  try {
    const it = await Transaction.findByIdAndDelete(req.params.id);
    if (!it) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Summary aggregate
app.get('/api/summary', async (_req, res) => {
  try {
    const [incomeAgg] = await Transaction.aggregate([
      { $match: { type: 'income' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const [expenseAgg] = await Transaction.aggregate([
      { $match: { type: 'expense' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    res.json({
      income: incomeAgg?.total || 0,
      expense: expenseAgg?.total || 0,
      balance: (incomeAgg?.total || 0) - (expenseAgg?.total || 0)
    });
  } catch {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// 404
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
