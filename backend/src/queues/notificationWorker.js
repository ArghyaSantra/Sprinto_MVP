import { Worker } from "bullmq";
import redis from "../config/redisClient.js";

const notificationWorker = new Worker(
  "notifications",
  async (job) => {
    console.log(
      `Processing job ${job.id} - Sending email to ${job.data.email}`
    );
    // Simulate email sending (Replace with actual email service)
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(`✅ Email sent to ${job.data.email}: ${job.data.message}`);
  },
  { connection: redis }
);

notificationWorker.on("failed", (job, err) => {
  console.error(`❌ Job ${job.id} failed:`, err);
});

export default notificationWorker;
