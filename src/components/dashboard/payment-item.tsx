import { ReactNode } from "react";

interface PaymentItemProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  amount: string;
  overdue?: boolean;
  onClick?: () => void;
}

export function PaymentItem({
  icon,
  title,
  subtitle,
  amount,
  overdue = false,
  onClick,
}: PaymentItemProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between py-3 hover:bg-gray-50 -mx-4 px-4 rounded-lg transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
          {icon}
        </div>
        <div>
          <div
            className={`font-medium ${
              overdue ? "text-red-600" : "text-gray-900"
            }`}
          >
            {title}
          </div>
          <div
            className={`text-sm ${overdue ? "text-red-600" : "text-gray-500"}`}
          >
            {subtitle}
          </div>
        </div>
      </div>
      <div className="text-right">
        <div
          className={`font-medium ${
            overdue ? "text-red-600" : "text-gray-900"
          }`}
        >
          {amount}
        </div>
      </div>
    </div>
  );
}
