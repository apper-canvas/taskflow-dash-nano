import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import TaskCard from "@/components/organisms/TaskCard";
import { toast } from "react-toastify";
import taskService from "@/services/api/taskService";

const KanbanBoard = ({ tasks, users, projects, onTaskClick, onTaskUpdate }) => {
  const [draggedTask, setDraggedTask] = useState(null);

  const columns = [
    { id: "todo", title: "To Do", icon: "Circle", color: "bg-gray-500" },
    { id: "in_progress", title: "In Progress", icon: "Clock", color: "bg-warning" },
    { id: "in_review", title: "In Review", icon: "Eye", color: "bg-primary" },
    { id: "completed", title: "Completed", icon: "CheckCircle2", color: "bg-success" },
  ];

  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (columnId) => {
    if (!draggedTask || draggedTask.status === columnId) {
      setDraggedTask(null);
      return;
    }

    try {
      const updatedTask = await taskService.updateStatus(draggedTask.Id, columnId);
      toast.success(`Task moved to ${columns.find((c) => c.id === columnId)?.title}`);
      if (onTaskUpdate) onTaskUpdate(updatedTask);
    } catch (error) {
      toast.error("Failed to update task status");
      console.error(error);
    }

    setDraggedTask(null);
  };

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {columns.map((column) => {
        const columnTasks = getTasksByStatus(column.id);
        return (
          <div
            key={column.id}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
            className="bg-gray-50 rounded-lg p-4 min-h-[500px]"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${column.color}/10`}>
                <ApperIcon name={column.icon} size={18} className={`${column.color.replace("bg-", "text-")}`} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-900">
                  {column.title}
                </h3>
                <p className="text-xs text-gray-500">{columnTasks.length} tasks</p>
              </div>
            </div>

            <div className="space-y-3">
              {columnTasks.map((task) => {
                const assignee = users?.find((u) => u.Id === task.assigneeId);
                const project = projects?.find((p) => p.Id === task.projectId);
                return (
                  <TaskCard
                    key={task.Id}
                    task={task}
                    assignee={assignee}
                    project={project}
                    onClick={() => onTaskClick && onTaskClick(task)}
                    onDragStart={() => handleDragStart(task)}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KanbanBoard;