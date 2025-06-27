import { ApiError } from "./apiError.js";
import { BAD_REQUEST } from "./apiResponseCode.js";
import { convertToCron } from "./utilities.js";
import cron from 'node-cron';


const schedulePost = (task, inputs, scheduleTime) => {
  try {
    const cronExpression = convertToCron(scheduleTime);
    
    // Schedule the task using node-cron
    const scheduledTask = cron.schedule(cronExpression, async () => {
      try {
        await task(inputs);
        console.log(`Task executed successfully at ${new Date().toISOString()}`);
        // Destroy the task after execution (since it's a one-time schedule)
        scheduledTask.destroy();
      } catch (error) {
        console.error(`Error executing scheduled task: ${error.message}`);
        throw new ApiError(BAD_REQUEST, `Error executing scheduled task: ${error.message}`)
      }
    }, {
      scheduled: true,
      timezone: 'UTC' // Adjust timezone as needed
    });

    console.log(`Task scheduled for ${scheduleTime} with cron expression: ${cronExpression}`);
    return scheduledTask; 
  } catch (error) {
    throw new ApiError(400, `Failed to schedule task: ${error.message}`);
  }
};
export default schedulePost;