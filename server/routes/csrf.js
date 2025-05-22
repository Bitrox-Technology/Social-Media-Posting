import { Router } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";
import { OK } from "../utils/apiResponseCode.js";
import i18n from "../utils/i18n.js";
const csrfRouter = Router()

csrfRouter.get('/csrf-token', (req, res) => {
  const csrfToken = res.locals.csrfToken;
  res.status(OK).json(new ApiResponse(OK, { csrfToken }, i18n.__("CSRF_TOKEN")));
})

export default csrfRouter