import express from 'express';
import mongoose from 'mongoose'
import cors from 'cors';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv'
import userRoutes from './routes/userRoutes.js'
import authRoutes from './routes/authRoutes.js'
import cookieParser from 'cookie-parser';

dotenv.config()

//initializing app
const app = express();

//middleware
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use((req, res, next) => {
    // const statusCode = err.statusCode || 500;
    // const message = err.message || 'Internal Server Error';
    // res.status(statusCode).json({
    //     success: false,
    //     statusCode,
    //     message,
    // });
    next();
})

//routes
app.use('/api/user', userRoutes)
app.use('/api/auth', authRoutes)


//database & port
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Database is connected!")
        app.listen(3000, () => {
            console.log("Server is running on port 3000!")        
        })
    })
    .catch( err => console.log(err));
