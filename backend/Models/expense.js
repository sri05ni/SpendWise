const mongoose = require("mongoose");
const expenseSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
        "Food",
        "Transport",
        "Shopping",
        "Bills",
        "Health",
        "Education",
        "Entertainment",
        "Other"
    ]
},
  date: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
  },
});

const expense = mongoose.model("expense", expenseSchema);
module.exports = expense;
