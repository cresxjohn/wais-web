import { ReactNode } from "react";

interface GradientActionCardProps {
  title: string;
  icon: ReactNode;
  gradient: string;
  onClick?: () => void;
}

export function GradientActionCard({
  title,
  icon,
  gradient,
  onClick,
}: GradientActionCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-gradient-to-br ${gradient} rounded-xl p-5 text-white cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1 relative overflow-hidden flex items-start`}
    >
      <div className="relative z-10">
        <h4 className="font-semibold text-lg">{title}</h4>
      </div>

      <div className="absolute -right-3 -bottom-3 opacity-30">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
          <div className="scale-125 text-white">{icon}</div>
        </div>
      </div>
    </div>
  );
}
