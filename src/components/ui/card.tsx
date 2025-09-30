import { ReactNode } from "react";

interface CardProps {
  className?: string;
  children: ReactNode;
}

interface CardHeaderProps {
  className?: string;
  children: ReactNode;
}

interface CardTitleProps {
  className?: string;
  children: ReactNode;
}

interface CardDescriptionProps {
  className?: string;
  children: ReactNode;
}

interface CardContentProps {
  className?: string;
  children: ReactNode;
}

interface CardFooterProps {
  className?: string;
  children: ReactNode;
}

export function Card({ className = "", children }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className = "", children }: CardHeaderProps) {
  return <div className={`p-6 pb-0 ${className}`}>{children}</div>;
}

export function CardTitle({ className = "", children }: CardTitleProps) {
  return (
    <h3 className={`text-lg font-semibold text-gray-900 ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({
  className = "",
  children,
}: CardDescriptionProps) {
  return <p className={`text-sm text-gray-600 ${className}`}>{children}</p>;
}

export function CardContent({ className = "", children }: CardContentProps) {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>;
}

export function CardFooter({ className = "", children }: CardFooterProps) {
  return <div className={`p-6 pt-0 ${className}`}>{children}</div>;
}
