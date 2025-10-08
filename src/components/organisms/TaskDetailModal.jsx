import React, { useState, useEffect } from "react";
import Modal from "@/components/organisms/Modal";
import Button from "@/components/atoms/Button";
import Textarea from "@/components/atoms/Textarea";
import Avatar from "@/components/atoms/Avatar";
import StatusBadge from "@/components/molecules/StatusBadge";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";
import { format, formatDistanceToNow } from "date-fns";
import commentService from "@/services/api/commentService";

const TaskDetailModal = ({ isOpen, onClose, task, project, assignee, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [users, setUsers] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!task) return;
      setLoading(true);
      try {
        const taskComments = await commentService.getByTask(task.Id);
        setComments(taskComments);
        
        const userService = (await import("@/services/api/userService")).default;
        const allUsers = await userService.getAll();
        setUsers(allUsers);
      } catch (error) {
        console.error("Failed to load comments:", error);
      } finally {
        setLoading(false);
      }
    };
    if (isOpen && task) {
      loadData();
    }
  }, [isOpen, task]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const comment = await commentService.create({
        taskId: task.Id,
        userId: currentUser.Id,
        content: newComment,
      });
      setComments([...comments, comment]);
      setNewComment("");
      toast.success("Comment added successfully!");
    } catch (error) {
      toast.error("Failed to add comment");
      console.error(error);
    }
  };

  if (!task) return null;

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== "completed";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Task Details"
      size="lg"
    >
      <div className="space-y-6">
        <div>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {task.title}
              </h3>
              <div className="flex items-center gap-3">
                <StatusBadge status={task.status} type="task" />
                <StatusBadge status={task.priority} type="priority" />
              </div>
            </div>
          </div>

          <p className="text-gray-700 mb-6">{task.description}</p>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-2">
                  Project
                </label>
                <div className="flex items-center gap-2">
                  <ApperIcon name="Folder" size={18} className="text-gray-500" />
                  <span className="text-gray-900">{project?.title || "N/A"}</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 block mb-2">
                  Assigned To
                </label>
                {assignee ? (
                  <div className="flex items-center gap-2">
                    <Avatar src={assignee.avatar} alt={assignee.name} size="sm" />
                    <span className="text-gray-900">{assignee.name}</span>
                  </div>
                ) : (
                  <span className="text-gray-500">Unassigned</span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-2">
                  Due Date
                </label>
                <div className={`flex items-center gap-2 ${isOverdue ? "text-error" : "text-gray-900"}`}>
                  <ApperIcon name="Calendar" size={18} />
                  <span>{format(new Date(task.dueDate), "MMM dd, yyyy")}</span>
                  {isOverdue && <span className="text-xs font-medium">Overdue</span>}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 block mb-2">
                  Created
                </label>
                <div className="flex items-center gap-2 text-gray-900">
                  <ApperIcon name="Clock" size={18} />
                  <span>
                    {formatDistanceToNow(new Date(task.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Comments</h4>
          
          <div className="space-y-4 mb-4 max-h-[300px] overflow-y-auto">
            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              </div>
            ) : comments.length > 0 ? (
              comments.map((comment) => {
                const commentUser = users.find((u) => u.Id === comment.userId);
                return (
                  <div key={comment.Id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                    {commentUser && (
                      <Avatar src={commentUser.avatar} alt={commentUser.name} size="sm" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          {commentUser?.name || "Unknown User"}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{comment.content}</p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500 py-4">No comments yet</p>
            )}
          </div>

          <div className="flex gap-3">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              rows={2}
            />
            <Button onClick={handleAddComment} size="sm" className="self-start">
              <ApperIcon name="Send" size={16} />
              Post
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TaskDetailModal;