const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const commentService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "task_id_c" } },
          { field: { Name: "user_id_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "created_at_c" } }
        ]
      };
      
      const response = await apperClient.fetchRecords("comment_c", params);
      
      if (!response.success) {
        console.error("Failed to fetch comments:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching comments:", error);
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "task_id_c" } },
          { field: { Name: "user_id_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "created_at_c" } }
        ]
      };
      
      const response = await apperClient.getRecordById("comment_c", parseInt(id), params);
      
      if (!response.success) {
        throw new Error(response.message || "Comment not found");
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching comment ${id}:`, error);
      throw error;
    }
  },

  async getByTask(taskId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "task_id_c" } },
          { field: { Name: "user_id_c" } },
          { field: { Name: "content_c" } },
          { field: { Name: "created_at_c" } }
        ],
        where: [
          {
            FieldName: "task_id_c",
            Operator: "EqualTo",
            Values: [parseInt(taskId)]
          }
        ]
      };
      
      const response = await apperClient.fetchRecords("comment_c", params);
      
      if (!response.success) {
        console.error("Failed to fetch comments by task:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching comments by task:", error);
      return [];
    }
  },

  async create(commentData) {
    try {
      const params = {
        records: [
          {
            Name: "Comment",
            task_id_c: parseInt(commentData.task_id_c || commentData.taskId),
            user_id_c: parseInt(commentData.user_id_c || commentData.userId),
            content_c: commentData.content_c || commentData.content
          }
        ]
      };
      
      const response = await apperClient.createRecord("comment_c", params);
      
      if (!response.success) {
        console.error("Failed to create comment:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          throw new Error(result.message || "Failed to create comment");
        }
        return result.data;
      }
      
      throw new Error("No result returned from create operation");
    } catch (error) {
      console.error("Error creating comment:", error);
      throw error;
    }
  },

  async update(id, commentData) {
    try {
      const params = {
        records: [
          {
            Id: parseInt(id),
            content_c: commentData.content_c || commentData.content
          }
        ]
      };
      
      const response = await apperClient.updateRecord("comment_c", params);
      
      if (!response.success) {
        console.error("Failed to update comment:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          throw new Error(result.message || "Failed to update comment");
        }
        return result.data;
      }
      
      throw new Error("No result returned from update operation");
    } catch (error) {
      console.error("Error updating comment:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord("comment_c", params);
      
      if (!response.success) {
        console.error("Failed to delete comment:", response.message);
        throw new Error(response.message);
      }
      
      return { success: true };
    } catch (error) {
      console.error("Error deleting comment:", error);
      throw error;
    }
  }
};
export default commentService;