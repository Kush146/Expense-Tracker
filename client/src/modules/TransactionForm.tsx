import React, { useMemo, useState } from "react";
import { z } from "zod";
import type { Transaction } from "../services/api";

const schema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.number().positive(),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  date: z.string().min(1, "Date is required"),
});

type Props = {
  onSubmit: (t: Omit<Transaction, "_id">) => any;
  saving: boolean;
};

export function TransactionForm({ onSubmit, saving }: Props) {
  const today = useMemo(() => new Date().toISOString().substring(0, 10), []);
  const [form, setForm] = useState<Omit<Transaction, "_id">>({
    type: "expense",
    amount: 0,
    description: "",
    category: "",
    date: today,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(partial?: Partial<typeof form>) {
    const next = {
      ...form,
      ...partial,
      amount: Number((partial?.amount ?? form.amount) as number),
    };
    const res = schema.safeParse(next);
    const map: Record<string, string> = {};
    if (!res.success) {
      res.error.issues.forEach((i) => {
        if (i.path[0]) map[String(i.path[0])] = i.message;
      });
    }
    setErrors(map);
    return res.success;
  }

  function handleChange<K extends keyof typeof form>(
    key: K,
    value: (typeof form)[K]
  ) {
    const partial = { [key]: value } as Partial<typeof form>;
    setForm((f) => ({ ...f, ...partial }));
    validate(partial);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...form,
      amount: Number(form.amount),
      date: new Date(form.date).toISOString(),
    })
      .unwrap?.()
      .then(() => {
        setForm({
          type: "expense",
          amount: 0,
          description: "",
          category: "",
          date: today,
        });
        setErrors({});
      })
      .catch((e: any) =>
        alert(e?.data?.error ? JSON.stringify(e.data.error) : "Error saving")
      );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1">
        <label className="label" htmlFor="type">
          Type
        </label>
        <select
          id="type"
          value={form.type}
          onChange={(e) => handleChange("type", e.target.value as any)}
          className="input"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="label" htmlFor="amount">
          Amount
        </label>
        <input
          id="amount"
          type="number"
          min="0"
          step="0.01"
          className="input"
          placeholder="0.00"
          value={form.amount}
          onChange={(e) => handleChange("amount", Number(e.target.value))}
        />
        {errors.amount && (
          <p className="text-sm text-rose-600">{errors.amount}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="label" htmlFor="description">
          Description
        </label>
        <input
          id="description"
          className="input"
          placeholder="e.g., Groceries"
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
        {errors.description && (
          <p className="text-sm text-rose-600">{errors.description}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="label" htmlFor="category">
          Category
        </label>
        <input
          id="category"
          className="input"
          placeholder="e.g., Food"
          value={form.category}
          onChange={(e) => handleChange("category", e.target.value)}
        />
        {errors.category && (
          <p className="text-sm text-rose-600">{errors.category}</p>
        )}
      </div>

      <div className="space-y-1">
        <label className="label" htmlFor="date">
          Date
        </label>
        <input
          id="date"
          type="date"
          className="input"
          value={form.date}
          onChange={(e) => handleChange("date", e.target.value)}
        />
        {errors.date && <p className="text-sm text-rose-600">{errors.date}</p>}
      </div>

      <button
        disabled={saving || Object.keys(errors).length > 0}
        className="btn btn-primary w-full"
      >
        {saving ? "Saving…" : "Add"}
      </button>
    </form>
  );
}
