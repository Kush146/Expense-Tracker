import React, { useState } from "react";

type Props = {
  categories: string[];
  onChange: (v: {
    type?: string;
    category?: string;
    startDate?: string;
    endDate?: string;
  }) => void;
};

export function Filters({ categories, onChange }: Props) {
  const [type, setType] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  function emit(
    next: Partial<{
      type: string;
      category: string;
      startDate: string;
      endDate: string;
    }>
  ) {
    const merged = { type, category, startDate, endDate, ...next };
    onChange({
      type: merged.type || undefined,
      category: merged.category || undefined,
      startDate: merged.startDate || undefined,
      endDate: merged.endDate || undefined,
    });
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label className="label" htmlFor="f-type">
          Type
        </label>
        <select
          id="f-type"
          className="input"
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            emit({ type: e.target.value });
          }}
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div className="space-y-1">
        <label className="label" htmlFor="f-category">
          Category
        </label>
        <select
          id="f-category"
          className="input"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            emit({ category: e.target.value });
          }}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="label" htmlFor="f-start">
            Start date
          </label>
          <input
            id="f-start"
            type="date"
            className="input"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
              emit({ startDate: e.target.value });
            }}
          />
        </div>
        <div className="space-y-1">
          <label className="label" htmlFor="f-end">
            End date
          </label>
          <input
            id="f-end"
            type="date"
            className="input"
            value={endDate}
            onChange={(e) => {
              setEndDate(e.target.value);
              emit({ endDate: e.target.value });
            }}
          />
        </div>
      </div>

      <button
        className="btn w-full border border-slate-300 hover:bg-slate-50"
        onClick={() => {
          setType("");
          setCategory("");
          setStartDate("");
          setEndDate("");
          onChange({});
        }}
      >
        Clear
      </button>
    </div>
  );
}
