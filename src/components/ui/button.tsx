import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
  asChild?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  onClick,
  className = "",
  asChild = false,
}: ButtonProps) {
  const baseClasses =
    "font-medium rounded-full transition-colors flex items-center gap-2";

  const variantClasses = {
    primary: "walz-button-primary",
    secondary: "walz-button-secondary",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700",
  };

  const sizeClasses = {
    sm: "px-4 py-1 text-sm",
    md: "px-6 py-2",
    lg: "px-8 py-3 text-lg",
  };

  // If asChild is true, return the children directly with classes applied
  if (asChild) {
    return (
      <div
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      >
        {children}
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
      {icon && icon}
    </button>
  );
}
