import express from "express";
import cors from "cors";
import authRoutes from './routes/authRoutes.js'
import authenticateUser from './middleware/authenticateuser.js'
import loanRoutes from './routes/loan.js'
import mongoose from "mongoose";
import 'dotenv/config'
import morgan from "morgan";
import sendResponse from "./helpers/utilityFunctions.js";


const app = express();
app.use(express.json()); 
app.use(cors("*"));
app.use(morgan('dev'))
//connect to database

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err))


app.use('/auth', authRoutes)
app.use('/loan',authenticateUser, loanRoutes)

app.get("/", (req, res) => {
  res.send("Hello Umair");
});

app.use((req, res) => {
  sendResponse(res, 400, {}, true, "Page not found");
});

app.listen(process.env.PORT, () => console.log(`Server is running on PORT ${process.env.PORT}`));