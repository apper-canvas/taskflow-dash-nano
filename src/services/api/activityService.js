const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const activityService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "user_id_c" } },
          { field: { Name: "action_c" } },
          { field: { Name: "entity_type_c" } },
          { field: { Name: "entity_id_c" } },
          { field: { Name: "timestamp_c" } }
        ],
        orderBy: [
          {
            fieldName: "timestamp_c",
            sorttype: "DESC"
          }
        ]
      };
      
      const response = await apperClient.fetchRecords("activity_c", params);
      
      if (!response.success) {
        console.error("Failed to fetch activities:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities:", error);
      return [];
    }
  },

  async getRecent(limit = 10) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "user_id_c" } },
          { field: { Name: "action_c" } },
          { field: { Name: "entity_type_c" } },
          { field: { Name: "entity_id_c" } },
          { field: { Name: "timestamp_c" } }
        ],
        orderBy: [
          {
            fieldName: "timestamp_c",
            sorttype: "DESC"
          }
        ],
        pagingInfo: {
          limit: limit,
          offset: 0
        }
      };
      
      const response = await apperClient.fetchRecords("activity_c", params);
      
      if (!response.success) {
        console.error("Failed to fetch recent activities:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching recent activities:", error);
      return [];
    }
  },

  async getByUser(userId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "user_id_c" } },
          { field: { Name: "action_c" } },
          { field: { Name: "entity_type_c" } },
          { field: { Name: "entity_id_c" } },
          { field: { Name: "timestamp_c" } }
        ],
        where: [
          {
            FieldName: "user_id_c",
            Operator: "EqualTo",
            Values: [parseInt(userId)]
          }
        ],
        orderBy: [
          {
            fieldName: "timestamp_c",
            sorttype: "DESC"
          }
        ]
      };
      
      const response = await apperClient.fetchRecords("activity_c", params);
      
      if (!response.success) {
        console.error("Failed to fetch activities by user:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities by user:", error);
      return [];
    }
  },

  async getByEntity(entityType, entityId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "user_id_c" } },
          { field: { Name: "action_c" } },
          { field: { Name: "entity_type_c" } },
          { field: { Name: "entity_id_c" } },
          { field: { Name: "timestamp_c" } }
        ],
        where: [
          {
            FieldName: "entity_type_c",
            Operator: "EqualTo",
            Values: [entityType]
          },
          {
            FieldName: "entity_id_c",
            Operator: "EqualTo",
            Values: [parseInt(entityId)]
          }
        ],
        orderBy: [
          {
            fieldName: "timestamp_c",
            sorttype: "DESC"
          }
        ]
      };
      
      const response = await apperClient.fetchRecords("activity_c", params);
      
      if (!response.success) {
        console.error("Failed to fetch activities by entity:", response.message);
        return [];
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching activities by entity:", error);
      return [];
    }
  },

  async create(activityData) {
    try {
      const params = {
        records: [
          {
            Name: activityData.action_c || activityData.action || "Activity",
            user_id_c: parseInt(activityData.user_id_c || activityData.userId),
            action_c: activityData.action_c || activityData.action,
            entity_type_c: activityData.entity_type_c || activityData.entityType,
            entity_id_c: parseInt(activityData.entity_id_c || activityData.entityId)
          }
        ]
      };
      
      const response = await apperClient.createRecord("activity_c", params);
      
      if (!response.success) {
        console.error("Failed to create activity:", response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (!result.success) {
          throw new Error(result.message || "Failed to create activity");
        }
        return result.data;
      }
      
      throw new Error("No result returned from create operation");
    } catch (error) {
      console.error("Error creating activity:", error);
      throw error;
    }
  }
};

export default activityService;