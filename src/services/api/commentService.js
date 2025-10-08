import commentsData from "../mockData/comments.json";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let comments = [...commentsData];

const commentService = {
  async getAll() {
    await delay(300);
    return [...comments];
  },

  async getById(id) {
    await delay(200);
    const comment = comments.find((c) => c.Id === parseInt(id));
    if (!comment) throw new Error("Comment not found");
    return { ...comment };
  },

  async getByTask(taskId) {
    await delay(300);
    return comments
      .filter((c) => c.taskId === parseInt(taskId))
      .map((c) => ({ ...c }));
  },

  async create(commentData) {
    await delay(400);
    const maxId = comments.reduce((max, c) => (c.Id > max ? c.Id : max), 0);
    const newComment = {
      Id: maxId + 1,
      ...commentData,
      createdAt: new Date().toISOString(),
    };
    comments.push(newComment);
    return { ...newComment };
  },

  async update(id, commentData) {
    await delay(300);
    const index = comments.findIndex((c) => c.Id === parseInt(id));
    if (index === -1) throw new Error("Comment not found");
    comments[index] = { ...comments[index], ...commentData };
    return { ...comments[index] };
  },

  async delete(id) {
    await delay(300);
    const index = comments.findIndex((c) => c.Id === parseInt(id));
    if (index === -1) throw new Error("Comment not found");
    comments.splice(index, 1);
    return { success: true };
  },
};

export default commentService;