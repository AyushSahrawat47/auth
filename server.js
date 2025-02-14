import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.config.js';
import helmet from 'helmet';

const app = express();

//middlewares
app.use(cors());
app.use(helmet());
app.use(express.json());

//connecting DB
connectDB();
dotenv.config();

const PORT = process.env.PORT || 5000;

//importing routes
import authRoutes from './routes/auth.route.js';

//routes
app.use('/api/v1/auth', authRoutes);


app.listen(PORT, () => console.log(`Server started on port ${PORT}`));