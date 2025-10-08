import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import StatusBadge from "@/components/molecules/StatusBadge";
import { format } from "date-fns";

const TaskCard = ({ task, assignee, project, onClick, onDragStart, onDragEnd }) => {
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "completed";

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-sm font-semibold text-gray-900 flex-1 pr-2">
          {task.title}
        </h4>
        <StatusBadge status={task.priority} type="priority" />
      </div>

      <p className="text-xs text-gray-600 mb-3 line-clamp-2">
        {task.description}
      </p>

      <div className="space-y-2 mb-3">
        {project && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <ApperIcon name="Folder" size={14} />
            <span className="truncate">{project.title}</span>
          </div>
        )}
        <div className={`flex items-center gap-2 text-xs ${isOverdue ? "text-error" : "text-gray-500"}`}>
          <ApperIcon name="Calendar" size={14} />
          <span>{format(new Date(task.dueDate), "MMM dd, yyyy")}</span>
          {isOverdue && <span className="text-error font-medium">Overdue</span>}
        </div>
      </div>

      {assignee && (
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          <Avatar src={assignee.avatar} alt={assignee.name} size="sm" />
          <span className="text-xs text-gray-700 truncate">{assignee.name}</span>
        </div>
      )}
    </div>
  );
};

export default TaskCard;