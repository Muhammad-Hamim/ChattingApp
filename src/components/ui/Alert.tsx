import type { ReactNode } from "react";

interface AlertProps {
  children: ReactNode;
  variant?: "success" | "error" | "warning" | "info";
}

export const Alert = ({ children, variant = "info" }: AlertProps) => {
  const variants = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  const icons = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  return (
    <div className={`p-4 border rounded-lg ${variants[variant]}`}>
      <div className="flex items-center">
        <span className="mr-2 font-semibold">{icons[variant]}</span>
        {children}
      </div>
    </div>
  );
};
