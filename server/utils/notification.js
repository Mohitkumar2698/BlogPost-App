import { Notification } from "../models/notification.js";

export const createNotification = async ({
  userId,
  actorId,
  actorUsername,
  type,
  message,
  blogId = null,
  commentId = null,
}) => {
  if (!userId || !actorId || userId.toString() === actorId.toString()) {
    return null;
  }

  return Notification.create({
    userId,
    actorId,
    actorUsername,
    type,
    message,
    blogId,
    commentId,
  });
};
