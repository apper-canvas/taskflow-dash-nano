import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Select from "@/components/atoms/Select";
import KanbanBoard from "@/components/organisms/KanbanBoard";
import CreateTaskModal from "@/components/organisms/CreateTaskModal";
import TaskDetailModal from "@/components/organisms/TaskDetailModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import taskService from "@/services/api/taskService";
import projectService from "@/services/api/projectService";
import userService from "@/services/api/userService";

const Tasks = ({ currentUser }) => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [tasksData, projectsData, usersData] = await Promise.all([
        currentUser.role === "member"
          ? taskService.getByAssignee(currentUser.Id)
          : taskService.getAll(),
        currentUser.role === "admin"
          ? projectService.getAll()
          : currentUser.role === "project_manager"
          ? projectService.getByManager(currentUser.Id)
          : projectService.getByMember(currentUser.Id),
        userService.getAll(),
      ]);

      setTasks(tasksData);
      setProjects(projectsData);
      setUsers(usersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;
    const matchesProject =
      projectFilter === "all" || task.projectId === parseInt(projectFilter);
    return matchesSearch && matchesPriority && matchesProject;
  });

  const canCreateTask = currentUser.role === "admin" || currentUser.role === "project_manager";

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Tasks</h1>
          <p className="text-gray-600">
            Track and manage tasks across all your projects
          </p>
        </div>
        {canCreateTask && (
          <Button onClick={() => setCreateModalOpen(true)}>
            <ApperIcon name="Plus" size={20} />
            New Task
          </Button>
        )}
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
            />
          </div>
          <Select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="md:w-48"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
          <Select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="md:w-48"
          >
            <option value="all">All Projects</option>
            {projects.map((project) => (
              <option key={project.Id} value={project.Id}>
                {project.title}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <Empty
          title="No tasks found"
          message={
            searchQuery || priorityFilter !== "all" || projectFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Get started by creating your first task"
          }
          icon="CheckSquare"
          action={
            canCreateTask
              ? {
                  label: "Create Task",
                  onClick: () => setCreateModalOpen(true),
                  icon: "Plus",
                }
              : null
          }
        />
      ) : (
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <KanbanBoard
            tasks={filteredTasks}
            users={users}
            projects={projects}
            onTaskClick={setSelectedTask}
            onTaskUpdate={loadData}
          />
        </div>
      )}

      <CreateTaskModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={loadData}
        currentUser={currentUser}
      />

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

export default Tasks;