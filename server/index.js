import { configDotenv } from 'dotenv';
import express from 'express';
import cors from 'cors';
import router from './routes/router.js';
import morgan from 'morgan';
import helmet from 'helmet';  
import { ApiError } from './utils/ApiError.js';  

configDotenv()

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cors());

morgan.format('custom', ':method :url :status :res[content-length] - :response-time ms')
app.use(morgan('custom'))


app.use(helmet());
app.use(express.urlencoded({ extended: false }));

app.use(express.static("public"));

app.use("/api/v1", router)


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
            errors: err.errors
        });
    } else if (err.Error)
        res.status(status).send({ status: status, message: err.Error });
    else if (err.message)
        res.status(status).send({ status: status, message: err.message });
    else res.status(status).send({ status: status, message: err.message });
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});