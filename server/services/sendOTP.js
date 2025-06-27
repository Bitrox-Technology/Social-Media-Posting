import { sendEmail } from "../utils/mail.js";
import { adminTemplate, userTemplate } from "../utils/templates.js";

const sendOtp = async (to, code) => {
  const subject = "Verify Your Account - Transform Your Social Media with AI";
  const template = userTemplate(code)
  const html = template
  await sendEmail(to, subject, html);
};

const sendOtpForAdmin = async (to, code) => {
  const subject = "Verify Your SocialAI Admin Account";
  const template = adminTemplate(code)
  const html = template(code);
  await sendEmail(to, subject, html);
};

export { sendOtp, sendOtpForAdmin };