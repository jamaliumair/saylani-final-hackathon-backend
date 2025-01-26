import express from "express";
import cors from "cors";
import userRoutes from './routes/user.js'
import authRoutes from './routes/authRoutes.js'
import authenticateUser from './middleware/authenticateuser.js'
import loanRoutes from './routes/loan.js'
import mongoose from "mongoose";
import 'dotenv/config'
import morgan from "morgan";


const app = express();
app.use(express.json()); 
app.use(cors("*"));
app.use(morgan('dev'))
//connect to database

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err))

app.get("/", (req, res) => {
  res.send("hello world");
});


app.use('/user', userRoutes)
app.use('/auth', authRoutes)
app.use('/loan',authenticateUser, loanRoutes)


app.listen(process.env.PORT, () => console.log(`Server is running on PORT ${process.env.PORT}`));