import React from "react";

export function SummaryCards({
  income,
  expense,
  balance,
}: {
  income: number;
  expense: number;
  balance: number;
}) {
  const Item = ({
    label,
    value,
    accent,
    sub,
  }: {
    label: string;
    value: number;
    accent: "ok" | "warn" | "info";
    sub?: string;
  }) => {
    const ring =
      accent === "ok"
        ? "ring-green-300"
        : accent === "warn"
          ? "ring-rose-300"
          : "ring-blue-300";
    const bar =
      accent === "ok"
        ? "bg-green-500"
        : accent === "warn"
          ? "bg-rose-500"
          : "bg-blue-500";
    const hint =
      accent === "ok"
        ? "text-green-700"
        : accent === "warn"
          ? "text-rose-700"
          : "text-blue-700";
    return (
      <div className={`card overflow-hidden ring-1 ${ring}`}>
        <div className={`h-1 w-full ${bar}`} />
        <div className="card-body">
          <div className="muted">{label}</div>
          <div className="text-3xl font-bold tabular-nums">
            {value.toFixed(2)}
          </div>
          {sub && <div className={`mt-1 text-xs ${hint}`}>{sub}</div>}
        </div>
      </div>
    );
  };

  return (
    <>
      <Item label="Income" value={income} accent="ok" />
      <Item label="Expense" value={expense} accent="warn" />
      <Item
        label="Balance"
        value={balance}
        accent="info"
        sub={balance >= 0 ? "You’re in the green" : "Negative balance"}
      />
    </>
  );
}
