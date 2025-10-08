import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Avatar from "@/components/atoms/Avatar";
import StatusBadge from "@/components/molecules/StatusBadge";
import ProgressBar from "@/components/molecules/ProgressBar";
import TaskCard from "@/components/organisms/TaskCard";
import CreateTaskModal from "@/components/organisms/CreateTaskModal";
import TaskDetailModal from "@/components/organisms/TaskDetailModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { format } from "date-fns";
import projectService from "@/services/api/projectService";
import taskService from "@/services/api/taskService";
import userService from "@/services/api/userService";

const ProjectDetail = ({ currentUser }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [manager, setManager] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [projectData, tasksData, usersData] = await Promise.all([
        projectService.getById(id),
        taskService.getByProject(id),
        userService.getAll(),
      ]);

      setProject(projectData);
      setTasks(tasksData);
      setUsers(usersData);

      const projectManager = usersData.find((u) => u.Id === projectData.managerId);
      setManager(projectManager);

      const members = usersData.filter((u) =>
        projectData.teamMembers.includes(u.Id)
      );
      setTeamMembers(members);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (!project) return <Error message="Project not found" />;

  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const canManageProject =
    currentUser.role === "admin" || project.managerId === currentUser.Id;

  const tabs = [
    { id: "overview", label: "Overview", icon: "FileText" },
    { id: "tasks", label: "Tasks", icon: "CheckSquare" },
    { id: "team", label: "Team", icon: "Users" },
  ];

  return (
    <div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/projects")}
        className="mb-6"
      >
        <ApperIcon name="ArrowLeft" size={18} />
        Back to Projects
      </Button>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {project.title}
              </h1>
              <StatusBadge status={project.status} type="project" />
            </div>
            <p className="text-gray-600">{project.description}</p>
          </div>
          {canManageProject && (
            <Button onClick={() => setCreateTaskModalOpen(true)}>
              <ApperIcon name="Plus" size={20} />
              New Task
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">
              Project Manager
            </label>
            {manager && (
              <div className="flex items-center gap-2">
                <Avatar src={manager.avatar} alt={manager.name} size="md" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {manager.name}
                  </p>
                  <p className="text-xs text-gray-500">{manager.email}</p>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">
              Timeline
            </label>
            <div className="flex items-center gap-2 text-gray-900">
              <ApperIcon name="Calendar" size={18} />
              <span className="text-sm">
                {format(new Date(project.startDate), "MMM dd, yyyy")} -{" "}
                {format(new Date(project.endDate), "MMM dd, yyyy")}
              </span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600 block mb-2">
              Team Size
            </label>
            <div className="flex items-center gap-2 text-gray-900">
              <ApperIcon name="Users" size={18} />
              <span className="text-sm">{teamMembers.length} members</span>
            </div>
          </div>
        </div>

        <ProgressBar value={progress} max={100} color="primary" />
        <p className="text-xs text-gray-500 mt-1">
          {completedTasks} of {totalTasks} tasks completed
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="border-b border-gray-200">
          <div className="flex gap-4 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-primary text-primary font-semibold"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <ApperIcon name={tab.icon} size={18} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Project Details
                </h3>
                <div className="prose max-w-none text-gray-700">
                  {project.description}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <ApperIcon name="CheckSquare" size={20} className="text-primary" />
                    </div>
                    <span className="text-sm font-medium text-gray-600">Total Tasks</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-warning/10 rounded-lg">
                      <ApperIcon name="Clock" size={20} className="text-warning" />
                    </div>
                    <span className="text-sm font-medium text-gray-600">In Progress</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">
                    {tasks.filter((t) => t.status === "in_progress").length}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-success/10 rounded-lg">
                      <ApperIcon name="CheckCircle2" size={20} className="text-success" />
                    </div>
                    <span className="text-sm font-medium text-gray-600">Completed</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{completedTasks}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "tasks" && (
            <div>
              {tasks.length === 0 ? (
                <Empty
                  title="No tasks yet"
                  message="Create your first task to get started with this project"
                  icon="CheckSquare"
                  action={
                    canManageProject
                      ? {
                          label: "Create Task",
                          onClick: () => setCreateTaskModalOpen(true),
                          icon: "Plus",
                        }
                      : null
                  }
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tasks.map((task) => {
                    const assignee = users.find((u) => u.Id === task.assigneeId);
                    return (
                      <TaskCard
                        key={task.Id}
                        task={task}
                        assignee={assignee}
                        onClick={() => setSelectedTask(task)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "team" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Team Members ({teamMembers.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamMembers.map((member) => (
                  <div
                    key={member.Id}
                    className="bg-gray-50 rounded-lg p-4 flex items-center gap-3"
                  >
                    <Avatar src={member.avatar} alt={member.name} size="lg" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                      <p className="text-xs text-gray-400 mt-1 capitalize">
                        {member.role.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <CreateTaskModal
        isOpen={createTaskModalOpen}
        onClose={() => setCreateTaskModalOpen(false)}
        onSuccess={loadData}
        currentUser={currentUser}
        preselectedProject={project}
      />

      {selectedTask && (
        <TaskDetailModal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          task={selectedTask}
          project={project}
          assignee={users.find((u) => u.Id === selectedTask.assigneeId)}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default ProjectDetail;