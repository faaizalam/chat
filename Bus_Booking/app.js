import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from './config/connect.js';
import { PORT } from './config/config.js';
import userRoutes from './routes/user.js';
import busesRoutes from './routes/bus.js';
import ticketRoutes from './routes/ticket.js';
import { buildAdminJs } from './config/setup.js';

dotenv.config();

const app = express();

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/user', userRoutes);
app.use('/bus', busesRoutes);
app.use('/ticket', ticketRoutes);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
      .then(async data => {
        console.log('connected');
        await buildAdminJs(app);
      })
      .catch(err => {
        console.log(err.message);
      });

    app.listen({ port: PORT, host: '0.0.0.0' }, (err, addr) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`Server started on http://localhost:${PORT}/admin`);
      }
    });
  } catch (error) {
    console.log('Error Starting Server-->', error);
  }
};

start();
