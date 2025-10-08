import usersData from "../mockData/users.json";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let users = [...usersData];

const userService = {
  async getAll() {
    await delay(300);
    return [...users];
  },

  async getById(id) {
    await delay(200);
    const user = users.find((u) => u.Id === parseInt(id));
    if (!user) throw new Error("User not found");
    return { ...user };
  },

  async getByRole(role) {
    await delay(300);
    return users.filter((u) => u.role === role).map((u) => ({ ...u }));
  },

  async create(userData) {
    await delay(400);
    const maxId = users.reduce((max, u) => (u.Id > max ? u.Id : max), 0);
    const newUser = {
      Id: maxId + 1,
      ...userData,
      role: userData.role || "member",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    return { ...newUser };
  },

  async update(id, userData) {
    await delay(300);
    const index = users.findIndex((u) => u.Id === parseInt(id));
    if (index === -1) throw new Error("User not found");
    users[index] = { ...users[index], ...userData };
    return { ...users[index] };
  },

  async delete(id) {
    await delay(300);
    const index = users.findIndex((u) => u.Id === parseInt(id));
    if (index === -1) throw new Error("User not found");
    users.splice(index, 1);
    return { success: true };
  },

  async changeRole(id, newRole) {
    await delay(300);
    const index = users.findIndex((u) => u.Id === parseInt(id));
    if (index === -1) throw new Error("User not found");
    users[index].role = newRole;
    return { ...users[index] };
  },
};

export default userService;