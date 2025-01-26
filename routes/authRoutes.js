import express from "express";
import sendResponse from "../helpers/utilityFunctions.js";
import models from "../models/User.js";
import 'dotenv/config'
import Joi from 'joi';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';


const User = models.User;
const {AUTH_SECRET, senderEmail, senderKey } = process.env;
const router = express.Router();

const registerSchema = Joi.object({
    name: Joi.string().min(5).max(20).required(),
    email: Joi.string().email().required(),
    cnic: Joi.string().min(13).max(13).required(),
    // password: Joi.string().min(3).required(""),
    address: Joi.string().optional().allow(""),
    phoneNumber: Joi.string().optional().allow("")

})

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).required(),
})

router.post("/register",async (req,res) => {
    const {error, value} = registerSchema.validate(req.body);
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    const passwordLength = Math.floor(Math.random() * 4) + 6; // Random length between 6 and 8
    let password = '';
  
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }
    if (error) return sendResponse(res,400,null,true,error.message);

    const user = await User.findOne({email: value.email});

    if (user) return sendResponse(res,403,null,true,"User already exist");

    const hashPassword = await bcrypt.hash(password, 10);
    value.password = hashPassword

    let newUser = new User({... value});
    newUser = await newUser.save();
    // let verificationToken = jwt.sign({ 
    //     userId: newUser._id,
    //     email: newUser.email  }, AUTH_SECRET, { expiresIn: "1h" });
    sendEmail(req.body.email, password);

    sendResponse(res,201,newUser,false,"User Registered successfully");
})


router.post('/login', async (req, res) => {
    const { error, value } = loginSchema.validate(req.body);
    if (error) return sendResponse(res, 400, null, true, error.message)

    const user = await User.findOne({ email: value.email }).lean()
    if (!user) return sendResponse(res, 403, null, true, 'User is not Registered.')

    const isPasswordValid = await bcrypt.compare(value.password, user.password)
    if (!isPasswordValid) return sendResponse(res, 403, null, true, 'Invalid Credentials')

    delete user.password

    var token = jwt.sign({ ...user },AUTH_SECRET ,);

    sendResponse(res, 200, {
        token,
        user
    }, false, 'User Login Successfully')
})


const transporter= nodemailer.createTransport({
    service: "Gmail",
    auth : {
        user: senderEmail,
        pass: senderKey
    }
  })
  
  function sendEmail(recepientEmail, password) {
    console.log(recepientEmail, password);
    const mailOption = {
        from: senderEmail,
        to: recepientEmail,
        html: `
        <h1 style='color:green'>Hello World</h1>
        <p>Below is yours new Password for Login: 
                ${password}
        </p>
        `,
        subject: "Your Password For Login"
    }
    transporter.sendMail(mailOption, (err, passSent) => {
        if (err) return res.status(500).send({ error: err.message });
  
        res.status(200).send({ message: "Password generated Successfully" });
  
    });
  }
  
//   router.post("/verifyEmail", async (req,res) => {
//     const {token} = req.headers;
//     console.log(token)
//     try {
//         const verified = jwt.verify(token, AUTH_SECRET);
//         console.log(verified);
//         const update = await User.findByIdAndUpdate(verified.userId, {verifiedEmail: true});
//         console.log(update, 'Email Verified');
//         res.status(200).json({  // Change to 200
//             msg: "Email Verified",
//             error: false,
//         })
//     } catch (error) {
//         console.log(error);
//         res.status(400).json({  // Add error response
//             msg: "Verification failed",
//             error: true
//         });
//     }
// })
  
  router.post("/sendEmail", (req,res) => {
    const {recepientEmail, password} = req.body;
    console.log("email" ,recepientEmail)
    const mailOption = {
        from: senderEmail,
        to: recepientEmail,
        html: `
        <h1 style='color:green'>Hello World</h1>
        <p>Below is yours new Password for Login: 
                ${password}
        </p>
        `,
        subject: "Your Password For Login"
    }
    transporter.sendMail(mailOption, (err, passSent) => {
        if (err) return res.status(500).send({ error: err.message });
  
        res.status(200).send({ message: "Password generated Successfully" });
  
    });
  })
  

export default router