import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    const variants = {
      primary: "bg-primary text-white hover:bg-primary/90",
      secondary: "bg-white text-secondary border border-gray-300 hover:bg-gray-50",
      danger: "bg-error text-white hover:bg-error/90",
      ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
      success: "bg-success text-white hover:bg-success/90",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;