import React, { useState } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Row,
  Col,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
// import "./ExpenseForm.css";

function ExpenseForm() {
  const navigate = useNavigate();

  const [expense, setExpense] = useState({
    title: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setExpense({
      ...expense,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const token = sessionStorage.getItem("token");

      const response = await API.post(
        "/api/expenses/",
        {
          ...expense,
          amount: Number(expense.amount),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Expense added successfully
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="expense-page">
      <Container className="expense-form-container py-4 rounded-4 ">
        <Card className="expense-form-card shadow-sm bg-secondary rounded-4">
          <Card.Body className="p-4">
            <div className="expense-form-heading mb-4">
              <h3>Add New Expense</h3>
              <p>Record and track your spending</p>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              {/* Title */}
              <Form.Group className="mb-3">
                <Form.Label>Expense Title</Form.Label>

                <Form.Control
                  type="text"
                  name="title"
                  placeholder="e.g. Grocery shopping"
                  value={expense.title}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Row>
                {/* Amount */}
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Amount (₹)</Form.Label>

                    <Form.Control
                      type="number"
                      name="amount"
                      placeholder="Enter amount"
                      value={expense.amount}
                      onChange={handleChange}
                      min="0.01"
                      step="0.01"
                      required
                    />
                  </Form.Group>
                </Col>

                {/* Category */}
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>

                    <Form.Select
                      name="category"
                      value={expense.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select category</option>
                      <option value="Food">Food</option>
                      <option value="Shopping">Shopping</option>
                      <option value="Transport">Transport</option>
                      <option value="Bills">Bills</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Education">Education</option>
                      <option value="Other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>

              {/* Date */}
              <Form.Group className="mb-3">
                <Form.Label>Date</Form.Label>

                <Form.Control
                  type="date"
                  name="date"
                  value={expense.date}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              {/* Description */}
              <Form.Group className="mb-4">
                <Form.Label>Description</Form.Label>

                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  placeholder="Add additional details..."
                  value={expense.description}
                  onChange={handleChange}
                />
              </Form.Group>

              {/* Buttons */}
              <div className="expense-form-actions">
                <Button
                  variant="btn btn-secondary"
                  onClick={() => navigate("/dashboard")}
                  disabled={loading}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  className="expense-save-btn"
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Expense"}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default ExpenseForm;
