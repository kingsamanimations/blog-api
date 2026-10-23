import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import routes from './src/routes/index.js';

const app = express();

const origins = (process.env.CORS_ORIGINS || 'http://localhost:8081').split(',');
app.use(cors({ origin: origins }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', routes.auth);
app.use('/posts', routes.posts);


// For catching all errors
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong'});
});

app.listen(process.env.PORT || 3000, () => 
  console.log(`API listening on port ${process.env.PORT || 3000}`),
);