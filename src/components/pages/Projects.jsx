import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Select from "@/components/atoms/Select";
import ProjectCard from "@/components/organisms/ProjectCard";
import CreateProjectModal from "@/components/organisms/CreateProjectModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import projectService from "@/services/api/projectService";
import userService from "@/services/api/userService";
import taskService from "@/services/api/taskService";

const Projects = ({ currentUser }) => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [createModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [projectsData, usersData, tasksData] = await Promise.all([
        currentUser.role === "admin"
          ? projectService.getAll()
          : currentUser.role === "project_manager"
          ? projectService.getByManager(currentUser.Id)
          : projectService.getByMember(currentUser.Id),
        userService.getAll(),
        taskService.getAll(),
      ]);

      setProjects(projectsData);
      setUsers(usersData);
      setTasks(tasksData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const canCreateProject = currentUser.role === "admin" || currentUser.role === "project_manager";

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
          <p className="text-gray-600">
            Manage and track all your projects in one place
          </p>
        </div>
        {canCreateProject && (
          <Button onClick={() => setCreateModalOpen(true)}>
            <ApperIcon name="Plus" size={20} />
            New Project
          </Button>
        )}
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
            />
          </div>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="md:w-48"
          >
            <option value="all">All Status</option>
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
          </Select>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <Empty
          title="No projects found"
          message={
            searchQuery || statusFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Get started by creating your first project"
          }
          icon="Folder"
          action={
            canCreateProject
              ? {
                  label: "Create Project",
                  onClick: () => setCreateModalOpen(true),
                  icon: "Plus",
                }
              : null
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
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
      )}

      <CreateProjectModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={loadData}
        currentUser={currentUser}
      />
    </div>
  );
};

export default Projects;