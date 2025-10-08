const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const userService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "role_c" } },
          { field: { Name: "avatar_c" } },
          { field: { Name: "created_at_c" } }
        ]
      };
      
      const response = await apperClient.fetchRecords("user_c", params);
      
      if (!response.success) {
        console.error("Failed to fetch users:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "role_c" } },
          { field: { Name: "avatar_c" } },
          { field: { Name: "created_at_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById("user_c", parseInt(id), params);
      
      if (!response.success) {
        throw new Error(response.message || "User not found");
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  },

  async getByRole(role) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "name_c" } },
          { field: { Name: "email_c" } },
          { field: { Name: "role_c" } },
          { field: { Name: "avatar_c" } },
          { field: { Name: "created_at_c" } }
        ],
        where: [
          {
            FieldName: "role_c",
            Operator: "EqualTo",
            Values: [role]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords("user_c", params);
      
      if (!response.success) {
        console.error("Failed to fetch users by role:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching users by role:", error);
      return [];
    }
  },

  async create(userData) {
    try {
      const params = {
        records: [
          {
            Name: userData.name_c || userData.name,
            name_c: userData.name_c || userData.name,
            email_c: userData.email_c || userData.email,
            role_c: userData.role_c || userData.role || "member",
            avatar_c: userData.avatar_c || userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name_c || userData.name}`
          }
        ]
      };
      
      const response = await apperClient.createRecord("user_c", params);
      
      if (!response.success) {
        console.error("Failed to create user:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          throw new Error(result.message || "Failed to create user");
        }
        return result.data;
      }
      
      throw new Error("No result returned from create operation");
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  async update(id, userData) {
    try {
      const updateData = {
        Id: parseInt(id)
      };
      
      if (userData.name_c || userData.name) {
        updateData.Name = userData.name_c || userData.name;
        updateData.name_c = userData.name_c || userData.name;
      }
      if (userData.email_c || userData.email) {
        updateData.email_c = userData.email_c || userData.email;
      }
      if (userData.role_c || userData.role) {
        updateData.role_c = userData.role_c || userData.role;
      }
      if (userData.avatar_c || userData.avatar) {
        updateData.avatar_c = userData.avatar_c || userData.avatar;
      }
      
      const params = {
        records: [updateData]
      };
      
      const response = await apperClient.updateRecord("user_c", params);
      
      if (!response.success) {
        console.error("Failed to update user:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          throw new Error(result.message || "Failed to update user");
        }
        return result.data;
      }
      
      throw new Error("No result returned from update operation");
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord("user_c", params);
      
      if (!response.success) {
        console.error("Failed to delete user:", response.message);
        throw new Error(response.message);
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  },

  async changeRole(id, newRole) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            role_c: newRole
          }
        ]
      };
      
      const response = await apperClient.updateRecord("user_c", params);
      
      if (!response.success) {
        console.error("Failed to change user role:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          throw new Error(result.message || "Failed to change role");
        }
        return result.data;
      }
      
      throw new Error("No result returned from update operation");
    } catch (error) {
      console.error("Error changing user role:", error);
      throw error;
    }
  }
};

export default userService;