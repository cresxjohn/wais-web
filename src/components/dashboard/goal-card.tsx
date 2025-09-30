import { ReactNode } from "react";

interface GoalCardProps {
  title: string;
  current: number;
  target: number;
  icon: ReactNode;
  color: string;
  onClick?: () => void;
}

export function GoalCard({
  title,
  current,
  target,
  icon,
  color,
  onClick,
}: GoalCardProps) {
  const progress = (current / target) * 100;

  return (
    <div
      onClick={onClick}
      className={`${color} rounded-xl p-4 border border-gray-100 cursor-pointer hover:shadow-sm transition-shadow`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-white rounded-lg">{icon}</div>
        <h3 className="font-medium text-gray-900 text-sm">{title}</h3>
      </div>
      <div className="mb-2">
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>₱{current.toLocaleString()}</span>
          <span>₱{target.toLocaleString()}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
      <p className="text-xs text-gray-600">{progress.toFixed(0)}% complete</p>
    </div>
  );
}
