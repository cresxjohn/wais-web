import { ReactNode } from "react";

interface BudgetCategoryProps {
  name: string;
  spent: number;
  budget: number;
  icon: ReactNode;
  color: string;
  onClick?: () => void;
}

export function BudgetCategory({
  name,
  spent,
  budget,
  icon,
  color,
  onClick,
}: BudgetCategoryProps) {
  const percentage = (spent / budget) * 100;

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 cursor-pointer hover:shadow-sm transition-shadow"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-50 rounded-lg">{icon}</div>
        <div>
          <p className="font-medium text-gray-900 text-sm">{name}</p>
          <p className="text-xs text-gray-500">
            ₱{spent.toLocaleString()} of ₱{budget.toLocaleString()}
          </p>
        </div>
      </div>
      <div className="text-right">
        <div
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            percentage > 90
              ? "bg-red-100 text-red-600"
              : percentage > 75
              ? "bg-yellow-100 text-yellow-600"
              : "bg-green-100 text-green-600"
          }`}
        >
          {percentage.toFixed(0)}%
        </div>
      </div>
    </div>
  );
}
