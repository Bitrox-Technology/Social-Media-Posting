import { configDotenv } from "dotenv";
import express, { Router } from "express";
import cors from "cors";
import router from "./routes/router.js";
import morgan from "morgan";
import helmet from "helmet";
import { ApiError } from "./utils/apiError.js";
import session from "express-session";
import path from "path";
import { fileURLToPath } from 'url';
import connectDB from "./config/db.js";
import Routers from "./routes/index.js";

// Get the equivalent of __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

configDotenv();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000" , 'http://localhost:5173'], 
    methods: ["GET", "POST", "PUT", "DELETE"], 
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, 
  })
);

morgan.format(
  "custom",
  ":method :url :status :res[content-length] - :response-time ms"
);
app.use(morgan("custom"));

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use(
  session({
    secret: "bitrox-secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use("/api/v1/user", Routers.userRouter);
app.use("/api/v1", router);

app.use(function (err, req, res, next) {
  console.error(err);
  const status = err.status || 400;
  if (err.message == "jwt expired" || err.message == "Authentication error") {
    res.status(401).send({ status: 401, message: err });
  }
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message,
      data: err.data,
      success: err.success,
      errors: err.errors,
    });
  } else if (err.Error)
    res.status(status).send({ status: status, message: err.Error });
  else if (err.message)
    res.status(status).send({ status: status, message: err.message });
  else res.status(status).send({ status: status, message: err.message });
});

connectDB().then(() => {
  app.listen((PORT), () => {
      console.log(`Server is running at port: ${PORT} `)
  })
}).catch((err) => [
  console.log("MongoDB connection failed!!!", err)
])
