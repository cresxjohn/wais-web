import { Plus } from "lucide-react";
import { ReactNode } from "react";

interface AccountCardProps {
  icon: ReactNode;
  name: string;
  bank: string;
  amount: string;
  negative?: boolean;
  onClick?: () => void;
}

export function AccountCard({
  icon,
  name,
  bank,
  amount,
  negative = false,
  onClick,
}: AccountCardProps) {
  return (
    <div
      onClick={onClick}
      className="flex flex-col justify-between min-w-80 max-w-80 h-48 bg-gray-100 rounded-xl p-6 hover:bg-gray-200 transition-all cursor-pointer"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-white rounded-lg">{icon}</div>
        <span className="font-medium text-lg text-gray-900">{name}</span>
      </div>
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
          <span>{bank}</span>
        </div>
        <div
          className={`text-2xl font-medium ${
            negative ? "text-red-600" : "text-gray-900"
          }`}
        >
          {amount}
        </div>
      </div>
    </div>
  );
}

interface AddAccountCardProps {
  onClick?: () => void;
}

export function AddAccountCard({ onClick }: AddAccountCardProps) {
  return (
    <div
      onClick={onClick}
      className="flex-shrink-0 w-80 bg-gray-100 rounded-xl p-6 hover:bg-gray-200 transition-all cursor-pointer flex items-center justify-center"
    >
      <div className="text-center">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mx-auto mb-3">
          <Plus className="w-5 h-5 text-gray-500" />
        </div>
        <span className="text-gray-700 font-medium text-sm">
          Add another account
        </span>
      </div>
    </div>
  );
}
