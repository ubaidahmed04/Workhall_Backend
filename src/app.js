const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { env } = require('./config/env');
const logger = require('./config/logger');
const responseFormatter = require('./middleware/response.middleware');
const notFoundHandler = require('./middleware/notFound.middleware');
const errorHandler = require('./middleware/errorHandler.middleware');
const v1Routes = require('./routes');

const app = express();
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.set('trust proxy', 1);

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));

app.use(
  morgan('combined', {
    stream: {
      write: (line) => logger   .http(line.trim()),
    },
  }),
);

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(responseFormatter);

app.use('/uploads', express.static(path.join(process.cwd(), env.UPLOAD_DIR)));

const basePath = `/api/${env.API_VERSION}`;
app.use(basePath, v1Routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
