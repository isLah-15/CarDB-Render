import { Request, Response } from "express";

import { createPaymentService, deletePaymentService, getAllPaymentService, getPaymentById, updatePaymentService } from "./payment.service";

// Create a new payment
export const createPaymentController = async (req: Request, res: Response) => {
    try {
        const payment = req.body;

        // Convert the payment date to a date object if provided
        if (payment.paymentDate) {
            payment.paymentDate = new Date(payment.paymentDate);
        }

        const newPayment =  await createPaymentService(payment);
        if (newPayment) {
            return res.status(201).json({ message: "Payment created successfully", data: newPayment });
        } else {
            return res.status(400).json({ message: "Failed to create payment" });
        }

    }catch (error: any) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }

};

// Get all payments
export const getAllPaymentsController = async (req: Request, res: Response) => {
    try {
        const payments = await getAllPaymentService();
        if (payments.length === 0) {
            return res.status(404).json({ message: "No payments found" });
        }
        return res.status(200).json({ message: "Payments retrieved successfully", data: payments });
    } catch (error: any) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

//Get a payment by id
export const getPaymentByIdController = async (req: Request, res: Response) => {
    try {
        const paymentId = parseInt(req.params.id);
        if(isNaN(paymentId)){
        return res.status(400).json({message: "Invalid ID"})
        }

        const payment = await getPaymentById(paymentId);
        console.log("mmmmmmmmmmmmmmmmmmmmmmm", payment)
        if (payment == "Payment not found") {
            return res.status(404).json({message: "Payment not found"});
        }

        return res.status(200).json({data: payment});

    } catch (error: any) {
        return res.status(500).json({error: error.message});
    };
};

// Update a payment by id
export const updatePaymentController = async (req: Request, res: Response) => {
    try {
        const paymentId = parseInt(req.params.id);
        if(isNaN(paymentId)) {
            return res.status(400).json({ message: "Invalid payment ID" });
        }

        const payment = req.body;

        // Convert the payment date to a date object if provided
        if (payment.paymentDate) {
            payment.paymentDate = new Date(payment.paymentDate);
        };

        //Check if the payment exists
        const existingPayment = await getPaymentById(paymentId);
        if (!existingPayment) {
            return res.status(404).json({ message: "Payment not found" });
        };

        //Check if the payment ID is provided in the request body
        if (!payment.paymentId) {
            return res.status(400).json({ message: "Payment ID is required" });
        };

        //check if the payment ID in the request body matches the payment ID in the URL
        if (payment.paymentId !== paymentId) {
            return res.status(400).json({ message: "Payment ID in request body does not match URL" });
        };

        // Update the payment
        payment.paymentId = paymentId; // Ensure the payment ID is set for the update


        const updatedPayment = await updatePaymentService(paymentId, payment);
        if (updatedPayment) {
            return res.status(200).json({ message: "Payment updated successfully", data: updatedPayment });
        } else {
            return res.status(400).json({ message: "Failed to update payment" });
        }

    } catch (error: any) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Delete a payment by id
export const deletePaymentController = async (req: Request, res: Response) => {
    try {
        const paymentId = parseInt(req.params.id);
        if(isNaN(paymentId)) {
            return res.status(400).json({ message: "Invalid payment ID" });
        }

        const existingPayment = await getPaymentById(paymentId);
        if (!existingPayment) {
            return res.status(404).json({ message: "Payment not found" });
        };

        const deleted = await deletePaymentService(paymentId);
        if (deleted == "Payment not found") {
            return res.status(404).json({message: "Payment not found"})
        } res.sendStatus(204).json({ message: "Payment deleted successfully" });

    } catch (error: any) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
