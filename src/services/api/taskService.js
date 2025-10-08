import tasksData from "../mockData/tasks.json";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let tasks = [...tasksData];

const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find((t) => t.Id === parseInt(id));
    if (!task) throw new Error("Task not found");
    return { ...task };
  },

  async getByProject(projectId) {
    await delay(300);
    return tasks
      .filter((t) => t.projectId === parseInt(projectId))
      .map((t) => ({ ...t }));
  },

  async getByAssignee(assigneeId) {
    await delay(300);
    return tasks
      .filter((t) => t.assigneeId === parseInt(assigneeId))
      .map((t) => ({ ...t }));
  },

  async getByStatus(status) {
    await delay(300);
    return tasks.filter((t) => t.status === status).map((t) => ({ ...t }));
  },

  async getByPriority(priority) {
    await delay(300);
    return tasks.filter((t) => t.priority === priority).map((t) => ({ ...t }));
  },

  async create(taskData) {
    await delay(400);
    const maxId = tasks.reduce((max, t) => (t.Id > max ? t.Id : max), 0);
    const newTask = {
      Id: maxId + 1,
      ...taskData,
      createdAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, taskData) {
    await delay(300);
    const index = tasks.findIndex((t) => t.Id === parseInt(id));
    if (index === -1) throw new Error("Task not found");
    tasks[index] = { ...tasks[index], ...taskData };
    return { ...tasks[index] };
  },

  async delete(id) {
    await delay(300);
    const index = tasks.findIndex((t) => t.Id === parseInt(id));
    if (index === -1) throw new Error("Task not found");
    tasks.splice(index, 1);
    return { success: true };
  },

  async updateStatus(id, status) {
    await delay(300);
    const index = tasks.findIndex((t) => t.Id === parseInt(id));
    if (index === -1) throw new Error("Task not found");
    tasks[index].status = status;
    return { ...tasks[index] };
  },

  async reassign(id, assigneeId) {
    await delay(300);
    const index = tasks.findIndex((t) => t.Id === parseInt(id));
    if (index === -1) throw new Error("Task not found");
    tasks[index].assigneeId = parseInt(assigneeId);
    return { ...tasks[index] };
  },
};

export default taskService;