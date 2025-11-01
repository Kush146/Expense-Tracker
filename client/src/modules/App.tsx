import React, { useMemo, useState } from "react";
import {
  useAddTransactionMutation,
  useDeleteTransactionMutation,
  useGetSummaryQuery,
  useGetTransactionsQuery,
} from "../services/api";
import { Filters } from "./Filters";
import { TransactionForm } from "./TransactionForm";
import { SummaryCards } from "./SummaryCards";
import { Charts } from "./Charts";
import { ThemeToggle } from "./ThemeToggle"; // ⬅️ added

export default function App() {
  const [filters, setFilters] = useState<{
    type?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
  }>({});
  const { data: transactions = [], isFetching } =
    useGetTransactionsQuery(filters);
  const { data: summary, isFetching: fetchingSummary } = useGetSummaryQuery();
  const [addTransaction, { isLoading: saving }] = useAddTransactionMutation();
  const [deleteTransaction, { isLoading: deleting }] =
    useDeleteTransactionMutation();

  const categories = useMemo(
    () => Array.from(new Set(transactions.map((t) => t.category))),
    [transactions]
  );

  return (
    <div className="mx-auto max-w-7xl p-6 lg:p-8 space-y-8">
      {/* Header (updated) */}
      <header className="flex items-center justify-between">
        <h1 className="text-4xl font-black tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-300">
            Expense Tracker
          </span>
        </h1>
        <ThemeToggle />
      </header>

      {/* Summary */}
      <section className="grid gap-5 md:grid-cols-3">
        {fetchingSummary ? (
          <>
            <div className="card h-24 skeleton" />
            <div className="card h-24 skeleton" />
            <div className="card h-24 skeleton" />
          </>
        ) : (
          <SummaryCards
            income={summary?.income || 0}
            expense={summary?.expense || 0}
            balance={summary?.balance || 0}
          />
        )}
      </section>

      {/* Body */}
      <section className="grid gap-8 lg:grid-cols-3">
        {/* Left rail */}
        <div className="space-y-6 lg:col-span-1">
          <div className="card">
            <div className="card-body">
              <h2 className="mb-4 text-xl font-semibold">Add Transaction</h2>
              <TransactionForm onSubmit={addTransaction} saving={saving} />
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h2 className="mb-4 text-xl font-semibold">Filters</h2>
              <Filters onChange={setFilters} categories={categories} />
            </div>
          </div>
        </div>

        {/* Right content */}
        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="card-muted">
              <div className="card-body">
                <h3 className="mb-3 font-semibold">Income vs Expense</h3>
                <Charts transactions={transactions} variant="bar" />
              </div>
            </div>
            <div className="card-muted">
              <div className="card-body">
                <h3 className="mb-3 font-semibold">By Category (sum)</h3>
                <Charts transactions={transactions} variant="pie" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Transactions</h2>
                {deleting && <span className="muted">Deleting…</span>}
              </div>

              {isFetching ? (
                <div className="space-y-2">
                  <div className="h-10 skeleton" />
                  <div className="h-10 skeleton" />
                  <div className="h-10 skeleton" />
                </div>
              ) : transactions.length === 0 ? (
                <p className="muted">
                  No transactions yet. Add one on the left.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b bg-slate-50 text-left font-semibold text-slate-700">
                      <tr>
                        <th className="py-2 pr-2">Date</th>
                        <th className="py-2 pr-2">Description</th>
                        <th className="py-2 pr-2">Category</th>
                        <th className="py-2 pr-2">Type</th>
                        <th className="py-2 pr-2 text-right">Amount</th>
                        <th className="py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map((t) => (
                        <tr key={t._id} className="border-b last:border-0">
                          <td className="py-2 pr-2">
                            {new Date(t.date).toLocaleDateString()}
                          </td>
                          <td className="py-2 pr-2">{t.description}</td>
                          <td className="py-2 pr-2">{t.category}</td>
                          <td className="py-2 pr-2">
                            <span
                              className={`chip ${t.type === "income" ? "chip-ok" : "chip-warn"}`}
                            >
                              {t.type}
                            </span>
                          </td>
                          <td className="py-2 pr-2 text-right font-semibold tabular-nums">
                            {t.amount.toFixed(2)}
                          </td>
                          <td className="py-2 pr-0 text-right">
                            <button
                              className="text-rose-600 hover:underline"
                              onClick={() => t._id && deleteTransaction(t._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
