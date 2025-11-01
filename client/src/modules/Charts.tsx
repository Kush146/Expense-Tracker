import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import type { Transaction } from "../services/api";

const COLORS = [
  "#6366F1",
  "#22C55E",
  "#F43F5E",
  "#0EA5E9",
  "#F59E0B",
  "#A78BFA",
  "#14B8A6",
  "#84CC16",
];

export function Charts({
  transactions,
  variant,
}: {
  transactions: Transaction[];
  variant: "bar" | "pie";
}) {
  const totals = useMemo(() => {
    const inc = transactions
      .filter((t) => t.type === "income")
      .reduce((s, t) => s + t.amount, 0);
    const exp = transactions
      .filter((t) => t.type === "expense")
      .reduce((s, t) => s + t.amount, 0);
    return { inc, exp };
  }, [transactions]);

  if (variant === "bar") {
    const barData = [
      { name: "Income", value: totals.inc, fill: "#22C55E" }, // green-500
      { name: "Expense", value: totals.exp, fill: "#F43F5E" }, // rose-500
    ];
    return (
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" name="Amount">
              {barData.map((e, idx) => (
                <Cell key={idx} fill={e.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  const pieData = useMemo(() => {
    const byCat: Record<string, number> = {};
    transactions.forEach((t) => {
      byCat[t.category] = (byCat[t.category] || 0) + t.amount;
    });
    return Object.entries(byCat).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            outerRadius={110}
            label
          >
            {pieData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
