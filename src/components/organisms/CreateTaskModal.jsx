import React, { useState, useEffect } from "react";
import Modal from "@/components/organisms/Modal";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import { toast } from "react-toastify";
import taskService from "@/services/api/taskService";
import projectService from "@/services/api/projectService";
import userService from "@/services/api/userService";

const CreateTaskModal = ({ isOpen, onClose, onSuccess, currentUser, preselectedProject = null }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: preselectedProject?.Id || "",
    assigneeId: "",
    priority: "medium",
    status: "todo",
    dueDate: "",
  });
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const allProjects = await projectService.getAll();
        let accessibleProjects = allProjects;

        if (currentUser.role === "project_manager") {
          accessibleProjects = allProjects.filter(
            (p) => p.managerId === currentUser.Id
          );
        }

        setProjects(accessibleProjects);

        const allUsers = await userService.getAll();
        const memberUsers = allUsers.filter((u) => u.role === "member");
        setMembers(memberUsers);
      } catch (error) {
        console.error("Failed to load data:", error);
      }
    };
    if (isOpen) {
      loadData();
      if (preselectedProject) {
        setFormData((prev) => ({ ...prev, projectId: preselectedProject.Id }));
      }
    }
  }, [isOpen, currentUser, preselectedProject]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.projectId || !formData.assigneeId || !formData.dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const newTask = await taskService.create({
        ...formData,
        projectId: parseInt(formData.projectId),
        assigneeId: parseInt(formData.assigneeId),
        createdBy: currentUser.Id,
      });
      toast.success("Task created successfully!");
      onSuccess(newTask);
      onClose();
      setFormData({
        title: "",
        description: "",
        projectId: preselectedProject?.Id || "",
        assigneeId: "",
        priority: "medium",
        status: "todo",
        dueDate: "",
      });
    } catch (error) {
      toast.error("Failed to create task");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Task"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create Task"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Task Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter task title"
          required
        />

        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter task description"
          rows={4}
        />

        <Select
          label="Project"
          value={formData.projectId}
          onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
          required
          disabled={preselectedProject !== null}
        >
          <option value="">Select a project</option>
          {projects.map((project) => (
            <option key={project.Id} value={project.Id}>
              {project.title}
            </option>
          ))}
        </Select>

        <Select
          label="Assign To"
          value={formData.assigneeId}
          onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
          required
        >
          <option value="">Select a team member</option>
          {members.map((member) => (
            <option key={member.Id} value={member.Id}>
              {member.name}
            </option>
          ))}
        </Select>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Priority"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>

          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="in_review">In Review</option>
            <option value="completed">Completed</option>
          </Select>
        </div>

        <Input
          label="Due Date"
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          required
        />
      </form>
    </Modal>
  );
};

export default CreateTaskModal;