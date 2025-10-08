import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import { formatDistanceToNow } from "date-fns";

const ActivityFeed = ({ activities, users }) => {
  const getActivityIcon = (entityType) => {
    switch (entityType) {
      case "project":
        return "Folder";
      case "task":
        return "CheckSquare";
      case "user":
        return "User";
      default:
        return "Activity";
    }
  };

  const getActivityColor = (entityType) => {
    switch (entityType) {
      case "project":
        return "text-primary";
      case "task":
        return "text-success";
      case "user":
        return "text-warning";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const user = users?.find((u) => u.Id === activity.userId);
        return (
          <div key={activity.Id} className="flex gap-3">
            {user && <Avatar src={user.avatar} alt={user.name} size="sm" />}
            <div className="flex-1">
              <div className="flex items-start gap-2">
                <ApperIcon
                  name={getActivityIcon(activity.entityType)}
                  size={16}
                  className={`mt-0.5 ${getActivityColor(activity.entityType)}`}
                />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{user?.name}</span>{" "}
                    {activity.action}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {formatDistanceToNow(new Date(activity.timestamp), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityFeed;