const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
    getExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    getExpenseSummary
} = require("../controllers/expenseController");

router.use(protect);

router.get("/summary", getExpenseSummary);
router.get("/", getExpenses);
router.post("/", createExpense);
router.put("/:id", updateExpense);
router.delete("/:id", deleteExpense);

module.exports = router;