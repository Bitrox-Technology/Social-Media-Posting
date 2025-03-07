import { ApiError } from "./ApiError.js";
const convertToCron = (scheduleTime) => {
  const date = new Date(scheduleTime);
  if (isNaN(date.getTime()))
    throw new ApiError(400, "Invalid schedule time format");

  const minute = date.getMinutes();
  const hour = date.getHours();
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are 0-based in JS

  // Cron format: "minute hour day month *"
  return `${minute} ${hour} ${day} ${month} *`;
};

export { convertToCron };
