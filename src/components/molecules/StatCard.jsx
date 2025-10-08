import React from "react";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ title, value, icon, trend, color = "primary" }) => {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    error: "bg-error/10 text-error",
    info: "bg-info/10 text-info",
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <ApperIcon
                name={trend.direction === "up" ? "TrendingUp" : "TrendingDown"}
                size={16}
                className={
                  trend.direction === "up" ? "text-success" : "text-error"
                }
              />
              <span
                className={`text-sm font-medium ${
                  trend.direction === "up" ? "text-success" : "text-error"
                }`}
              >
                {trend.value}
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <ApperIcon name={icon} size={24} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;