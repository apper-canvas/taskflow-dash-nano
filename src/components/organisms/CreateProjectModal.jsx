import React, { useState, useEffect } from "react";
import Modal from "@/components/organisms/Modal";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import { toast } from "react-toastify";
import projectService from "@/services/api/projectService";
import userService from "@/services/api/userService";

const CreateProjectModal = ({ isOpen, onClose, onSuccess, currentUser }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    managerId: "",
    status: "planning",
    startDate: "",
    endDate: "",
  });
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadManagers = async () => {
      try {
        const allUsers = await userService.getAll();
        const managerUsers = allUsers.filter(
          (u) => u.role === "project_manager" || u.role === "admin"
        );
        setManagers(managerUsers);
      } catch (error) {
        console.error("Failed to load managers:", error);
      }
    };
    if (isOpen) {
      loadManagers();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.managerId || !formData.startDate || !formData.endDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const newProject = await projectService.create({
        ...formData,
        managerId: parseInt(formData.managerId),
      });
      toast.success("Project created successfully!");
      onSuccess(newProject);
      onClose();
      setFormData({
        title: "",
        description: "",
        managerId: "",
        status: "planning",
        startDate: "",
        endDate: "",
      });
    } catch (error) {
      toast.error("Failed to create project");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Project"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Create Project"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Project Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter project title"
          required
        />

        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter project description"
          rows={4}
        />

        <Select
          label="Project Manager"
          value={formData.managerId}
          onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
          required
        >
          <option value="">Select a project manager</option>
          {managers.map((manager) => (
            <option key={manager.Id} value={manager.Id}>
              {manager.name} ({manager.role.replace("_", " ")})
            </option>
          ))}
        </Select>

        <Select
          label="Status"
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
        >
          <option value="planning">Planning</option>
          <option value="active">Active</option>
          <option value="on-hold">On Hold</option>
          <option value="completed">Completed</option>
        </Select>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
          />

          <Input
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            required
          />
        </div>
      </form>
    </Modal>
  );
};

export default CreateProjectModal;