const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const taskService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "project_id_c" } },
          { field: { Name: "assignee_id_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "created_by_c" } },
          { field: { Name: "created_at_c" } }
        ]
      };
      
      const response = await apperClient.fetchRecords("task_c", params);
      
      if (!response.success) {
        console.error("Failed to fetch tasks:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error);
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "project_id_c" } },
          { field: { Name: "assignee_id_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "created_by_c" } },
          { field: { Name: "created_at_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById("task_c", parseInt(id), params);
      
      if (!response.success) {
        throw new Error(response.message || "Task not found");
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${id}:`, error);
      throw error;
    }
  },

  async getByProject(projectId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "project_id_c" } },
          { field: { Name: "assignee_id_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "created_by_c" } },
          { field: { Name: "created_at_c" } }
        ],
        where: [
          {
            FieldName: "project_id_c",
            Operator: "EqualTo",
            Values: [parseInt(projectId)]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords("task_c", params);
      
      if (!response.success) {
        console.error("Failed to fetch tasks by project:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks by project:", error);
      return [];
    }
  },

  async getByAssignee(assigneeId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "project_id_c" } },
          { field: { Name: "assignee_id_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "created_by_c" } },
          { field: { Name: "created_at_c" } }
        ],
        where: [
          {
            FieldName: "assignee_id_c",
            Operator: "EqualTo",
            Values: [parseInt(assigneeId)]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords("task_c", params);
      
      if (!response.success) {
        console.error("Failed to fetch tasks by assignee:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks by assignee:", error);
      return [];
    }
  },

  async getByStatus(status) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "project_id_c" } },
          { field: { Name: "assignee_id_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "created_by_c" } },
          { field: { Name: "created_at_c" } }
        ],
        where: [
          {
            FieldName: "status_c",
            Operator: "EqualTo",
            Values: [status]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords("task_c", params);
      
      if (!response.success) {
        console.error("Failed to fetch tasks by status:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks by status:", error);
      return [];
    }
  },

  async getByPriority(priority) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "project_id_c" } },
          { field: { Name: "assignee_id_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "due_date_c" } },
          { field: { Name: "created_by_c" } },
          { field: { Name: "created_at_c" } }
        ],
        where: [
          {
            FieldName: "priority_c",
            Operator: "EqualTo",
            Values: [priority]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords("task_c", params);
      
      if (!response.success) {
        console.error("Failed to fetch tasks by priority:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks by priority:", error);
      return [];
    }
  },

  async create(taskData) {
    try {
      const params = {
        records: [
          {
            Name: taskData.title_c || taskData.title,
            title_c: taskData.title_c || taskData.title,
            description_c: taskData.description_c || taskData.description,
            project_id_c: parseInt(taskData.project_id_c || taskData.projectId),
            assignee_id_c: parseInt(taskData.assignee_id_c || taskData.assigneeId),
            priority_c: taskData.priority_c || taskData.priority || "medium",
            status_c: taskData.status_c || taskData.status || "todo",
            due_date_c: taskData.due_date_c || taskData.dueDate,
            created_by_c: parseInt(taskData.created_by_c || taskData.createdBy)
          }
        ]
      };
      
      const response = await apperClient.createRecord("task_c", params);
      
      if (!response.success) {
        console.error("Failed to create task:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          throw new Error(result.message || "Failed to create task");
        }
        return result.data;
      }
      
      throw new Error("No result returned from create operation");
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  },

  async update(id, taskData) {
    try {
      const updateData = {
        Id: parseInt(id)
      };
      
      if (taskData.title_c || taskData.title) {
        updateData.Name = taskData.title_c || taskData.title;
        updateData.title_c = taskData.title_c || taskData.title;
      }
      if (taskData.description_c || taskData.description) {
        updateData.description_c = taskData.description_c || taskData.description;
      }
      if (taskData.project_id_c || taskData.projectId) {
        updateData.project_id_c = parseInt(taskData.project_id_c || taskData.projectId);
      }
      if (taskData.assignee_id_c || taskData.assigneeId) {
        updateData.assignee_id_c = parseInt(taskData.assignee_id_c || taskData.assigneeId);
      }
      if (taskData.priority_c || taskData.priority) {
        updateData.priority_c = taskData.priority_c || taskData.priority;
      }
      if (taskData.status_c || taskData.status) {
        updateData.status_c = taskData.status_c || taskData.status;
      }
      if (taskData.due_date_c || taskData.dueDate) {
        updateData.due_date_c = taskData.due_date_c || taskData.dueDate;
      }
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord("task_c", params);
      
      if (!response.success) {
        console.error("Failed to update task:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          throw new Error(result.message || "Failed to update task");
        }
        return result.data;
      }
      
      throw new Error("No result returned from update operation");
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord("task_c", params);
      
      if (!response.success) {
        console.error("Failed to delete task:", response.message);
        throw new Error(response.message);
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  },

  async updateStatus(id, status) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            status_c: status
          }
        ]
      };
      
      const response = await apperClient.updateRecord("task_c", params);
      
      if (!response.success) {
        console.error("Failed to update task status:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          throw new Error(result.message || "Failed to update status");
        }
        return result.data;
      }
      
      throw new Error("No result returned from update operation");
    } catch (error) {
      console.error("Error updating task status:", error);
      throw error;
    }
  },

  async reassign(id, assigneeId) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            assignee_id_c: parseInt(assigneeId)
          }
        ]
      };
      
      const response = await apperClient.updateRecord("task_c", params);
      
      if (!response.success) {
        console.error("Failed to reassign task:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          throw new Error(result.message || "Failed to reassign task");
        }
        return result.data;
      }
      
      throw new Error("No result returned from update operation");
    } catch (error) {
      console.error("Error reassigning task:", error);
      throw error;
    }
  }
};

export default taskService;