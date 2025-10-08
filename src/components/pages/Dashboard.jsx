import React, { useState, useEffect } from "react";
import StatCard from "@/components/molecules/StatCard";
import ActivityFeed from "@/components/organisms/ActivityFeed";
import KanbanBoard from "@/components/organisms/KanbanBoard";
import ProjectCard from "@/components/organisms/ProjectCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import TaskDetailModal from "@/components/organisms/TaskDetailModal";
import userService from "@/services/api/userService";
import projectService from "@/services/api/projectService";
import taskService from "@/services/api/taskService";
import activityService from "@/services/api/activityService";

const Dashboard = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);

  // Debug logging to verify currentUser structure
  useEffect(() => {
    console.log('Dashboard - currentUser:', currentUser);
    console.log('Dashboard - currentUser.role:', currentUser?.role);
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      loadData();
    }
  }, [currentUser]);
  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [usersData, projectsData, tasksData, activitiesData] = await Promise.all([
        userService.getAll(),
        currentUser.role === "admin"
          ? projectService.getAll()
          : currentUser.role === "project_manager"
          ? projectService.getByManager(currentUser.Id)
          : projectService.getByMember(currentUser.Id),
        currentUser.role === "member"
          ? taskService.getByAssignee(currentUser.Id)
          : taskService.getAll(),
        activityService.getRecent(10),
      ]);

      setUsers(usersData);
      setProjects(projectsData);
      setTasks(tasksData);
      setActivities(activitiesData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const renderAdminDashboard = () => {
    const adminCount = users.filter((u) => u.role === "admin").length;
    const managerCount = users.filter((u) => u.role === "project_manager").length;
    const memberCount = users.filter((u) => u.role === "member").length;
    const activeProjects = projects.filter((p) => p.status === "active").length;

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={users.length}
            icon="Users"
            color="primary"
          />
          <StatCard
            title="Active Projects"
            value={activeProjects}
            icon="Folder"
            color="success"
          />
          <StatCard
            title="Total Tasks"
            value={tasks.length}
            icon="CheckSquare"
            color="warning"
          />
          <StatCard
            title="Completed"
            value={tasks.filter((t) => t.status === "completed").length}
            icon="CheckCircle2"
            color="success"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Users by Role
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Admins</span>
                <span className="text-lg font-bold text-gray-900">{adminCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Project Managers</span>
                <span className="text-lg font-bold text-gray-900">{managerCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Members</span>
                <span className="text-lg font-bold text-gray-900">{memberCount}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activity
            </h3>
            <ActivityFeed activities={activities} users={users} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Projects</h3>
            <Button size="sm">
              <ApperIcon name="Plus" size={16} />
              New Project
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.slice(0, 3).map((project) => (
              <ProjectCard
                key={project.Id}
                project={project}
                manager={users.find((u) => u.Id === project.managerId)}
                teamMembers={users.filter((u) =>
                  project.teamMembers.includes(u.Id)
                )}
                tasks={tasks.filter((t) => t.projectId === project.Id)}
              />
            ))}
          </div>
        </div>
      </>
    );
  };

  const renderManagerDashboard = () => {
    const activeProjects = projects.filter((p) => p.status === "active").length;
    const completedTasks = tasks.filter((t) => t.status === "completed").length;
    const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length;

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="My Projects"
            value={projects.length}
            icon="Folder"
            color="primary"
          />
          <StatCard
            title="Active Projects"
            value={activeProjects}
            icon="Activity"
            color="success"
          />
          <StatCard
            title="In Progress"
            value={inProgressTasks}
            icon="Clock"
            color="warning"
          />
          <StatCard
            title="Completed"
            value={completedTasks}
            icon="CheckCircle2"
            color="success"
          />
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">My Projects</h3>
            <Button size="sm">
              <ApperIcon name="Plus" size={16} />
              New Project
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <ProjectCard
                key={project.Id}
                project={project}
                manager={users.find((u) => u.Id === project.managerId)}
                teamMembers={users.filter((u) =>
                  project.teamMembers.includes(u.Id)
                )}
                tasks={tasks.filter((t) => t.projectId === project.Id)}
              />
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Activity
          </h3>
          <ActivityFeed activities={activities} users={users} />
        </div>
      </>
    );
  };

  const renderMemberDashboard = () => {
    const todoTasks = tasks.filter((t) => t.status === "todo").length;
    const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length;
    const inReviewTasks = tasks.filter((t) => t.status === "in_review").length;
    const completedTasks = tasks.filter((t) => t.status === "completed").length;

    return (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="To Do"
            value={todoTasks}
            icon="Circle"
            color="primary"
          />
          <StatCard
            title="In Progress"
            value={inProgressTasks}
            icon="Clock"
            color="warning"
          />
          <StatCard
            title="In Review"
            value={inReviewTasks}
            icon="Eye"
            color="info"
          />
          <StatCard
            title="Completed"
            value={completedTasks}
            icon="CheckCircle2"
            color="success"
          />
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">My Tasks</h3>
          <KanbanBoard
            tasks={tasks}
            users={users}
            projects={projects}
            onTaskClick={setSelectedTask}
            onTaskUpdate={loadData}
          />
        </div>
      </>
    );
  };

return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {currentUser?.name || 'User'}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening with your projects today.
        </p>
      </div>

      {currentUser?.role === "admin" && renderAdminDashboard()}
      {currentUser?.role === "project_manager" && renderManagerDashboard()}
      {currentUser?.role === "member" && renderMemberDashboard()}
      {!currentUser?.role && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            Unable to determine user role. Please refresh the page or contact support.
          </p>
        </div>
      )}

      {selectedTask && (
        <TaskDetailModal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          task={selectedTask}
          project={projects.find((p) => p.Id === selectedTask.projectId)}
          assignee={users.find((u) => u.Id === selectedTask.assigneeId)}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default Dashboard;