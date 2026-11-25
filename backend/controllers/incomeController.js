const Income = require("../Models/income");
const mongoose = require("mongoose");

// GET ALL INCOME OF LOGGED-IN USER
exports.getIncome = async (req, res) => {
  try {
    const income = await Income.find({ user: req.userId })
      .sort({ date: -1 });

    res.status(200).json(income);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch income",
      error: error.message
    });
  }
};


// ADD NEW INCOME
exports.createIncome = async (req, res) => {
  try {
    const { title, amount, category, date, description } = req.body;

    if (!title || !amount || !category) {
      return res.status(400).json({
        message: "Title, amount and category are required"
      });
    }

    if (Number(amount) <= 0 || !Number.isFinite(Number(amount))) {
      return res.status(400).json({
        message: "Amount must be a valid positive number"
      });
    }

    const income = await Income.create({
      title,
      amount: Number(amount),
      category,
      date: date || Date.now(),
      description,
      user: req.userId
    });

    res.status(201).json({
      message: "Income added successfully",
      income
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to add income",
      error: error.message
    });
  }
};


// UPDATE INCOME
exports.updateIncome = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid income ID"
      });
    }

    const allowedFields = [
      "title",
      "amount",
      "category",
      "date",
      "description"
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (
      updates.amount !== undefined &&
      (!Number.isFinite(Number(updates.amount)) ||
        Number(updates.amount) <= 0)
    ) {
      return res.status(400).json({
        message: "Amount must be a valid positive number"
      });
    }

    if (updates.amount !== undefined) {
      updates.amount = Number(updates.amount);
    }

    const income = await Income.findOneAndUpdate(
      { _id: id, user: req.userId },
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    if (!income) {
      return res.status(404).json({
        message: "Income not found"
      });
    }

    res.status(200).json({
      message: "Income updated successfully",
      income
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to update income",
      error: error.message
    });
  }
};


// DELETE INCOME
exports.deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid income ID"
      });
    }

    const income = await Income.findOneAndDelete({
      _id: id,
      user: req.userId
    });

    if (!income) {
      return res.status(404).json({
        message: "Income not found"
      });
    }

    res.status(200).json({
      message: "Income deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to delete income",
      error: error.message
    });
  }
};