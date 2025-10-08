import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ title, message, action, icon = "Inbox" }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="bg-gray-50 rounded-full p-4 mb-4">
        <ApperIcon name={icon} className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title || "No data found"}
      </h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {message || "Get started by creating your first item."}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          {action.icon && <ApperIcon name={action.icon} size={18} />}
          {action.label}
        </button>
      )}
    </div>
  );
};

export default Empty;