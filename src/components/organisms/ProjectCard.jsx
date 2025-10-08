import React from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import StatusBadge from "@/components/molecules/StatusBadge";
import ProgressBar from "@/components/molecules/ProgressBar";
import Button from "@/components/atoms/Button";
import { format } from "date-fns";

const ProjectCard = ({ project, manager, teamMembers, tasks }) => {
  const navigate = useNavigate();

  const completedTasks = tasks?.filter((t) => t.status === "completed").length || 0;
  const totalTasks = tasks?.length || 0;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {project.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {project.description}
          </p>
        </div>
        <StatusBadge status={project.status} type="project" />
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ApperIcon name="User" size={16} />
          <span>{manager?.name || "Unassigned"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ApperIcon name="Calendar" size={16} />
          <span>
            {format(new Date(project.startDate), "MMM dd, yyyy")} -{" "}
            {format(new Date(project.endDate), "MMM dd, yyyy")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ApperIcon name="Users" size={16} className="text-gray-600" />
          <div className="flex -space-x-2">
            {teamMembers?.slice(0, 3).map((member) => (
              <Avatar
                key={member.Id}
                src={member.avatar}
                alt={member.name}
                size="sm"
                className="border-2 border-white"
              />
            ))}
            {teamMembers && teamMembers.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600">
                  +{teamMembers.length - 3}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-4">
        <ProgressBar value={progress} max={100} color="primary" />
        <p className="text-xs text-gray-500 mt-1">
          {completedTasks} of {totalTasks} tasks completed
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          variant="primary"
          onClick={() => navigate(`/projects/${project.Id}`)}
          className="flex-1"
        >
          <ApperIcon name="Eye" size={16} />
          View Details
        </Button>
      </div>
    </div>
  );
};

export default ProjectCard;