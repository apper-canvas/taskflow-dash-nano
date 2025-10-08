const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const projectService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "manager_id_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "end_date_c" } },
          { field: { Name: "team_members_c" } },
          { field: { Name: "created_at_c" } }
        ]
      };
      
      const response = await apperClient.fetchRecords("project_c", params);
      
      if (!response.success) {
        console.error("Failed to fetch projects:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching projects:", error);
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
          { field: { Name: "manager_id_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "end_date_c" } },
          { field: { Name: "team_members_c" } },
          { field: { Name: "created_at_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById("project_c", parseInt(id), params);
      
      if (!response.success) {
        throw new Error(response.message || "Project not found");
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error);
      throw error;
    }
  },

  async getByManager(managerId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "manager_id_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "end_date_c" } },
          { field: { Name: "team_members_c" } },
          { field: { Name: "created_at_c" } }
        ],
        where: [
          {
            FieldName: "manager_id_c",
            Operator: "EqualTo",
            Values: [parseInt(managerId)]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords("project_c", params);
      
      if (!response.success) {
        console.error("Failed to fetch projects by manager:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching projects by manager:", error);
      return [];
    }
  },

  async getByMember(memberId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "description_c" } },
          { field: { Name: "manager_id_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "end_date_c" } },
          { field: { Name: "team_members_c" } },
          { field: { Name: "created_at_c" } }
        ]
      };
      
      const response = await apperClient.fetchRecords("project_c", params);
      
      if (!response.success) {
        console.error("Failed to fetch projects:", response.message);
        return [];
      }
      
      const allProjects = response.data || [];
      return allProjects.filter(p => {
        const teamMembers = p.team_members_c ? p.team_members_c.split(',').map(id => parseInt(id.trim())) : [];
        return teamMembers.includes(parseInt(memberId));
      });
    } catch (error) {
      console.error("Error fetching projects by member:", error);
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
          { field: { Name: "manager_id_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "start_date_c" } },
          { field: { Name: "end_date_c" } },
          { field: { Name: "team_members_c" } },
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
      
      const response = await apperClient.fetchRecords("project_c", params);
      
      if (!response.success) {
        console.error("Failed to fetch projects by status:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching projects by status:", error);
      return [];
    }
  },

  async create(projectData) {
    try {
      const params = {
        records: [
          {
            Name: projectData.title_c || projectData.title,
            title_c: projectData.title_c || projectData.title,
            description_c: projectData.description_c || projectData.description,
            manager_id_c: parseInt(projectData.manager_id_c || projectData.managerId),
            status_c: projectData.status_c || projectData.status || "planning",
            start_date_c: projectData.start_date_c || projectData.startDate,
            end_date_c: projectData.end_date_c || projectData.endDate,
            team_members_c: projectData.team_members_c || (projectData.teamMembers ? projectData.teamMembers.join(',') : "")
          }
        ]
      };
      
      const response = await apperClient.createRecord("project_c", params);
      
      if (!response.success) {
        console.error("Failed to create project:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          throw new Error(result.message || "Failed to create project");
        }
        return result.data;
      }
      
      throw new Error("No result returned from create operation");
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  },

  async update(id, projectData) {
    try {
      const updateData = {
        Id: parseInt(id)
      };
      
      if (projectData.title_c || projectData.title) {
        updateData.Name = projectData.title_c || projectData.title;
        updateData.title_c = projectData.title_c || projectData.title;
      }
      if (projectData.description_c || projectData.description) {
        updateData.description_c = projectData.description_c || projectData.description;
      }
      if (projectData.manager_id_c || projectData.managerId) {
        updateData.manager_id_c = parseInt(projectData.manager_id_c || projectData.managerId);
      }
      if (projectData.status_c || projectData.status) {
        updateData.status_c = projectData.status_c || projectData.status;
      }
      if (projectData.start_date_c || projectData.startDate) {
        updateData.start_date_c = projectData.start_date_c || projectData.startDate;
      }
      if (projectData.end_date_c || projectData.endDate) {
        updateData.end_date_c = projectData.end_date_c || projectData.endDate;
      }
      if (projectData.team_members_c !== undefined || projectData.teamMembers !== undefined) {
        updateData.team_members_c = projectData.team_members_c || (projectData.teamMembers ? projectData.teamMembers.join(',') : "");
      }
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord("project_c", params);
      
      if (!response.success) {
        console.error("Failed to update project:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          throw new Error(result.message || "Failed to update project");
        }
        return result.data;
      }
      
      throw new Error("No result returned from update operation");
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord("project_c", params);
      
      if (!response.success) {
        console.error("Failed to delete project:", response.message);
        throw new Error(response.message);
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  },

  async addTeamMember(projectId, memberId) {
    try {
      const project = await this.getById(projectId);
      const currentMembers = project.team_members_c ? project.team_members_c.split(',').map(id => id.trim()) : [];
      
      if (!currentMembers.includes(memberId.toString())) {
        currentMembers.push(memberId.toString());
        const params = {
          records: [
            {
              Id: parseInt(projectId),
              team_members_c: currentMembers.join(',')
            }
          ]
        };
        
        const response = await apperClient.updateRecord("project_c", params);
        
        if (!response.success) {
          console.error("Failed to add team member:", response.message);
          throw new Error(response.message);
        }
        
        if (response.results && response.results.length > 0) {
          const result = response.results[0];
          if (!result.success) {
            throw new Error(result.message || "Failed to add team member");
          }
          return result.data;
        }
      }
      
      return project;
    } catch (error) {
      console.error("Error adding team member:", error);
      throw error;
    }
  },

  async removeTeamMember(projectId, memberId) {
    try {
      const project = await this.getById(projectId);
      const currentMembers = project.team_members_c ? project.team_members_c.split(',').map(id => id.trim()) : [];
      const updatedMembers = currentMembers.filter(id => parseInt(id) !== parseInt(memberId));
      
      const params = {
        records: [
          {
            Id: parseInt(projectId),
            team_members_c: updatedMembers.join(',')
          }
        ]
      };
      
      const response = await apperClient.updateRecord("project_c", params);
      
      if (!response.success) {
        console.error("Failed to remove team member:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          throw new Error(result.message || "Failed to remove team member");
        }
        return result.data;
      }
      
      throw new Error("No result returned from update operation");
    } catch (error) {
      console.error("Error removing team member:", error);
      throw error;
    }
  }
};

export default projectService;