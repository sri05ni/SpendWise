const Expense = require("../Models/expense");
const mongoose = require("mongoose");

// GET ALL EXPENSES OF LOGGED-IN USER
exports.getExpenses = async (req, res) => {
    try {
        const { category } = req.query;

        const filter = {
            user: req.userId
        };

        if (category && category !== "All") {
            filter.category = category;
        }

        const expenses = await Expense.find(filter)
            .sort({ date: -1 });

        res.status(200).json(expenses);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// ADD NEW EXPENSE
exports.createExpense = async (req, res) => {
    try {
        const {
            title,
            amount,
            category,
            date,
            description
        } = req.body;

        // Validate required fields
        if (!title || !category || amount === undefined ||
            amount === null || amount === "") {
            return res.status(400).json({
                message: "Please provide all required fields"
            });
        }

        if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
            return res.status(400).json({
                message: "Amount must be greater than zero"
            });
        }

        // Create expense and assign logged-in user
        const expense = await Expense.create({
            user: req.userId,
            title: title.trim(),
            amount: Number(amount),
            category,
            date: date || Date.now(),
            description: description || ""
        });

        res.status(201).json({
            message: "Expense added successfully",
            expense
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};


// UPDATE EXPENSE
exports.updateExpense = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid expense ID"
            });
        }

        const {
            title,
            amount,
            category,
            date,
            description
        } = req.body;

        const updates = {};

        // Update only the allowed fields
        if (title !== undefined) {
            if (!title.trim()) {
                return res.status(400).json({
                    message: "Title cannot be empty"
                });
            }
            updates.title = title.trim();
        }

        if (amount !== undefined) {
            if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
                return res.status(400).json({
                    message: "Amount must be greater than zero"
                });
            }
            updates.amount = Number(amount);
        }

        if (category !== undefined) {
            updates.category = category;
        }

        if (date !== undefined) {
            updates.date = date;
        }

        if (description !== undefined) {
            updates.description = description;
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: "No valid fields provided for update"
            });
        }

        // Find and update only the owner's expense
        const expense = await Expense.findOneAndUpdate(
            {
                _id: id,
                user: req.userId
            },
            { $set: updates },
            {
                new: true,
                runValidators: true
            }
        );

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.status(200).json({
            message: "Expense updated successfully",
            expense
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};


// DELETE EXPENSE
exports.deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid expense ID"
            });
        }

        // Delete only if the expense belongs to logged-in user
        const expense = await Expense.findOneAndDelete({
            _id: id,
            user: req.userId
        });

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.status(200).json({
            message: "Expense deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// GET EXPENSE SUMMARY
exports.getExpenseSummary = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.userId);

        const now = new Date();

        const startOfMonth = new Date(
            now.getFullYear(),
            now.getMonth(),
            1
        );

        const nextMonth = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            1
        );

        // Calculate total expenses
        const totalResult = await Expense.aggregate([
            {
                $match: { user: userId }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);

        // Calculate current month's expenses
        const monthlyResult = await Expense.aggregate([
            {
                $match: {
                    user: userId,
                    date: {
                        $gte: startOfMonth,
                        $lt: nextMonth
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]);

        // Calculate category-wise expenses
        const categories = await Expense.aggregate([
            {
                $match: { user: userId }
            },
            {
                $group: {
                    _id: "$category",
                    total: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Count total transactions
        const count = await Expense.countDocuments({
            user: req.userId
        });

        res.status(200).json({
            total: totalResult[0]?.total || 0,
            monthlyTotal: monthlyResult[0]?.total || 0,
            count,
            categories
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};