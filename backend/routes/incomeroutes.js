const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  getIncome,
  createIncome,
  updateIncome,
  deleteIncome
} = require("../Controllers/incomeController");

// Protect all income routes
router.use(protect);

// Get all income
router.get("/", getIncome);

// Add income
router.post("/", createIncome);

// Update income
router.put("/:id", updateIncome);

// Delete income
router.delete("/:id", deleteIncome);

module.exports = router;