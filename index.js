require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDb = require('./database');

const app = express();

const PORT = process.env.PORT || 8080;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(PORT, async () => {
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  await connectDb();

  app.get('/', (req, res) => {
    return res.status(200).json({ message: 'OK' });
  });

  console.log(
    `Server running on port http://localhost:${PORT} in ${NODE_ENV} mode`
  );
});
