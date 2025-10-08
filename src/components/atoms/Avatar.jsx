import React from "react";
import { cn } from "@/utils/cn";

const Avatar = ({ src, alt, size = "md", className }) => {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  return (
    <img
      src={src}
      alt={alt}
      className={cn(
        "rounded-full object-cover border-2 border-gray-200",
        sizes[size],
        className
      )}
    />
  );
};

export default Avatar;