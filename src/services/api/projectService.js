import projectsData from "../mockData/projects.json";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let projects = [...projectsData];

const projectService = {
  async getAll() {
    await delay(300);
    return [...projects];
  },

  async getById(id) {
    await delay(200);
    const project = projects.find((p) => p.Id === parseInt(id));
    if (!project) throw new Error("Project not found");
    return { ...project };
  },

  async getByManager(managerId) {
    await delay(300);
    return projects
      .filter((p) => p.managerId === parseInt(managerId))
      .map((p) => ({ ...p }));
  },

  async getByMember(memberId) {
    await delay(300);
    return projects
      .filter((p) => p.teamMembers.includes(parseInt(memberId)))
      .map((p) => ({ ...p }));
  },

  async getByStatus(status) {
    await delay(300);
    return projects.filter((p) => p.status === status).map((p) => ({ ...p }));
  },

  async create(projectData) {
    await delay(400);
    const maxId = projects.reduce((max, p) => (p.Id > max ? p.Id : max), 0);
    const newProject = {
      Id: maxId + 1,
      ...projectData,
      teamMembers: projectData.teamMembers || [],
      createdAt: new Date().toISOString(),
    };
    projects.push(newProject);
    return { ...newProject };
  },

  async update(id, projectData) {
    await delay(300);
    const index = projects.findIndex((p) => p.Id === parseInt(id));
    if (index === -1) throw new Error("Project not found");
    projects[index] = { ...projects[index], ...projectData };
    return { ...projects[index] };
  },

  async delete(id) {
    await delay(300);
    const index = projects.findIndex((p) => p.Id === parseInt(id));
    if (index === -1) throw new Error("Project not found");
    projects.splice(index, 1);
    return { success: true };
  },

  async addTeamMember(projectId, memberId) {
    await delay(300);
    const index = projects.findIndex((p) => p.Id === parseInt(projectId));
    if (index === -1) throw new Error("Project not found");
    if (!projects[index].teamMembers.includes(parseInt(memberId))) {
      projects[index].teamMembers.push(parseInt(memberId));
    }
    return { ...projects[index] };
  },

  async removeTeamMember(projectId, memberId) {
    await delay(300);
    const index = projects.findIndex((p) => p.Id === parseInt(projectId));
    if (index === -1) throw new Error("Project not found");
    projects[index].teamMembers = projects[index].teamMembers.filter(
      (id) => id !== parseInt(memberId)
    );
    return { ...projects[index] };
  },
};

export default projectService;