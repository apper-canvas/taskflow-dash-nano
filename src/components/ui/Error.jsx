import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <div className="bg-red-50 rounded-full p-4 mb-4">
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Something went wrong
      </h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        {message || "An unexpected error occurred. Please try again."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <ApperIcon name="RefreshCw" size={18} />
          Try Again
        </button>
      )}
    </div>
  );
};

export default Error;