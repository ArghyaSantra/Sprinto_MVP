// Queue setup
import { Queue } from "bullmq";
import redis from "../config/redisClient.js";

const notificationQueue = new Queue("notifications", { connection: redis });

// Function to add jobs to the queue
export async function sendEmailNotification(email, message) {
  await notificationQueue.add("sendEmail", { email, message });
}

export default notificationQueue;
