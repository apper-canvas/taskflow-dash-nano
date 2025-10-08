import React from "react";
import Badge from "@/components/atoms/Badge";

const StatusBadge = ({ status, type = "project" }) => {
  const projectStatuses = {
    planning: { variant: "default", label: "Planning" },
    active: { variant: "success", label: "Active" },
    "on-hold": { variant: "warning", label: "On Hold" },
    completed: { variant: "primary", label: "Completed" },
  };

  const taskStatuses = {
    todo: { variant: "default", label: "To Do" },
    in_progress: { variant: "warning", label: "In Progress" },
    in_review: { variant: "primary", label: "In Review" },
    completed: { variant: "success", label: "Completed" },
  };

  const priorityLevels = {
    low: { variant: "default", label: "Low" },
    medium: { variant: "warning", label: "Medium" },
    high: { variant: "error", label: "High" },
  };

  let config;
  if (type === "project") {
    config = projectStatuses[status];
  } else if (type === "priority") {
    config = priorityLevels[status];
  } else {
    config = taskStatuses[status];
  }

  if (!config) return null;

  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export default StatusBadge;