import { ApiError } from "./ApiError.js";
import bcrypt from "bcrypt"
import otpGenerator from "otp-generator";
import jwt from "jsonwebtoken"
import CryptoJS from "crypto-js";

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

const Hashed_Password = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    throw error
  }
}

const comparePasswordUsingBcrypt = async (password, hashedPassword) => {
  return bcrypt.compareSync(password, hashedPassword)
}

const isEmail = (value) => {
  let re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(value).toLowerCase());
}

const isPhone = (value) => {
  let intRegex = /[0-9 -()+]+$/;
  return intRegex.test(value);
}


const comparePasswordAndConfirmpassword = (password, confirmPassword) => {
  if (password === confirmPassword) {
    return true;
  } else {
    return false;
  }
}

const generateOTP = () => {
  return otpGenerator.generate(6, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
}

const generateAccessToken = async (user, role) => {
  return jwt.sign({
    _id: user._id,
    email: user.email,
    role: role
  }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY })
}

const generateRefershToken = async (user, role) => {
  return jwt.sign({
    _id: user._id,
    role: role
  }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY })
}

const setSecureCookies = (res, accessToken, refreshToken) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 2 * 60 * 60 * 1000, // 2 hours
    path: '/',
  });

  // Refresh token in separate httpOnly cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    path: '/',
  });
}

const clearAuthCookies = (res) => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });
}

const jwtVerify = async (token) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
}

const jwtVerifyForRefreshToken = async (token) => {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
}

const getPagination = (query, total) => {
  const page = parseInt(query.page || 1, 10);
  const limit = parseInt(query.limit || 10, 10);
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip,
    total,
    totalPages: Math.ceil(total / limit),
  };
};


const encryptToken = (token) => {
  const ciphertext = CryptoJS.AES.encrypt(token, process.env.CRYPTO_SECRET_KEY).toString();
  return ciphertext;
}

const decryptToken = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.CRYPTO_SECRET_KEY);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}


// const isEmail = async (value) => {
//   // Step 1: Basic email format validation
//   let re =
//     /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//   if (!re.test(String(value).toLowerCase())) {
//     return { isValid: false, message: "Invalid email format" };
//   }

//   // Step 2: Check for temporary email domains
//   const tempEmailDomains = [
//     "yopmail.com",
// "tempmail.com",
// "mailinator.com",
// "10minutemail.com",
// "guerrillamail.com",
// "disposabl.email",
// "sharklasers.com",
// "getnada.com",
// "temp-mail.org",
// "throwawaymail.com",
// "maildrop.cc",
// "fakeinbox.com",
// "tempmailaddress.com",
// "trashmail.com",
// "mintemail.com",
// "tempail.com",
// "burnermail.io",
// "inboxbear.com",
// "mailnesia.com",
// "dropmail.me",
// "spambox.us",
// "tempinbox.com",
// "mailcatch.com",
// "discard.email",
// "fakemailgenerator.com"
//   ];

//   const domain = value.split("@")[1].toLowerCase();
//   if (tempEmailDomains.includes(domain)) {
//     return { isValid: false, message: "Temporary email addresses are not allowed" };
//   }

//   // Step 3: Simulate DNS lookup (placeholder for server-side or API-based DNS check)
//   async function simulateDNSCheck(domain) {
//     // In a real implementation, use an API like Google DNS or a third-party service
//     // For demo, assume domains in tempEmailDomains fail, others pass
//     return !tempEmailDomains.includes(domain);
//   }

//   const dnsValid = await simulateDNSCheck(domain);
//   if (!dnsValid) {
//     return { isValid: false, message: "Invalid or non-existent email domain" };
//   }

//   return { isValid: true, message: "Email is valid" };
// };

// // Example usage
// async function testEmailValidation() {
//   const emails = ["as@gmail.com", "as@yopmail.com", "invalid@nonexistent.com"];
//   for (const email of emails) {
//     const result = await isEmail(email);
//     console.log(`Email: ${email}, Result: ${result.message}`);
//   }
// }

// testEmailValidation();
export {
  convertToCron, Hashed_Password, isEmail, generateAccessToken,
  generateRefershToken, jwtVerify, jwtVerifyForRefreshToken, comparePasswordUsingBcrypt,
  generateOTP, getPagination, setSecureCookies, clearAuthCookies, encryptToken, decryptToken,
};
