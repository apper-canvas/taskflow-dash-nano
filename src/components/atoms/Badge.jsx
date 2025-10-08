import React from "react";
import { cn } from "@/utils/cn";

const Badge = ({ variant = "default", children, className }) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    error: "bg-error/10 text-error",
    admin: "bg-blue-100 text-blue-800",
    manager: "bg-purple-100 text-purple-800",
    member: "bg-green-100 text-green-800",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;