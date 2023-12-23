import express, { json, urlencoded } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import logger from 'morgan';

const app = express();

import errorMiddleware from './middleWare/error.js';

import router from './routes/index.js';

app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(logger('dev'));

app.use('/api/', router);

//Middleware for error
app.use(errorMiddleware);

export default app;
