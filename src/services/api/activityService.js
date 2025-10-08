import activitiesData from "../mockData/activities.json";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let activities = [...activitiesData];

const activityService = {
  async getAll() {
    await delay(300);
    return [...activities].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  },

  async getRecent(limit = 10) {
    await delay(300);
    return [...activities]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
  },

  async getByUser(userId) {
    await delay(300);
    return activities
      .filter((a) => a.userId === parseInt(userId))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .map((a) => ({ ...a }));
  },

  async getByEntity(entityType, entityId) {
    await delay(300);
    return activities
      .filter(
        (a) => a.entityType === entityType && a.entityId === parseInt(entityId)
      )
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .map((a) => ({ ...a }));
  },

  async create(activityData) {
    await delay(200);
    const maxId = activities.reduce((max, a) => (a.Id > max ? a.Id : max), 0);
    const newActivity = {
      Id: maxId + 1,
      ...activityData,
      timestamp: new Date().toISOString(),
    };
    activities.push(newActivity);
    return { ...newActivity };
  },
};

export default activityService;