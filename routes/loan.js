import LoanRequest from "../models/Loan.js";
import express from "express";
import sendResponse from "../helpers/utilityFunctions.js";


const router = express.Router();

router.get("/get", async (req, res) => {
    const tasks = await LoanRequest.find({ userId: req.user._id });
    sendResponse(res, 200, tasks, true, "Task found successfully")

})
router.post('/loan-requests', async (req, res) => {
    try {
        const {
            category,
            subcategory,
            desiredLoan,
            deposit,
            loanAmount,
            monthlyPayment,
            period,
            guarantors,
            documents,
            appointment,
            tokenNumber,
            qrCode,
        } = req.body;


        //   console.log(maxLoanAmount, depositAmount, paymentPeriod)
        //   const monthlyInstallment = maxLoanAmount - depositAmount / paymentPeriod * 12;
        // Create a new loan request instance
        const newLoanRequest = new LoanRequest({
            userId: req.user._id,
            category,
            subcategory,
            maxLoanAmount: desiredLoan,
            depositAmount: deposit,
            paymentPeriod: period,
            monthlyInstallment: monthlyPayment,
            remainingAmount: loanAmount,
            guarantors,
            documents,
            appointment,
            tokenNumber,
            qrCode,
        });

        // Save to database
        await newLoanRequest.save();

        // Respond with success message
        res.status(201).json({ message: 'Loan request added successfully.', loanRequest: newLoanRequest });
    } catch (error) {
        res.status(500).json({ message: 'Error adding loan request.', error: error.message });
    }
});




// router.put("/:id", async (req, res) => {
//     const { id } = req.params;
//     const { task } = req.body;
//     console.log(id, task)
//     const editedtask = await Task.findByIdAndUpdate(id, { task: task });
//     if (!task) {
//         res.status(400).json({
//             msg: "task not found successfully",
//             error: false,
//             data: undefined
//         })
//     } else {

//         res.status(200).json({
//             msg: "tasks edited successfully",
//             error: false,
//             data: editedtask
//         })
//     }

// })


// router.delete("/:id", async (req, res) => {
//     const { id } = req.params;
//     const task = await Task.findByIdAndDelete(id);
//     const tasks = await Task.find({ createdBy: req.user._id });
//     if (!task) {
//         res.status(400).json({
//             msg: "task not found successfully",
//             error: false,
//             data: null
//         })
//     } else {

//         res.status(200).json({
//             msg: "tasks deleted successfully",
//             error: false,
//             data: tasks
//         })
//     }

// })

export default router