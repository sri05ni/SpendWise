import React, { useState } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Row,
  Col,
  Alert
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";


function IncomeForm() {
  const navigate = useNavigate();

  const [income, setIncome] = useState({
    title: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    description: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setIncome({
      ...income,
      [e.target.name]: e.target.value
    });
  };

  // Submit income
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/income/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            ...income,
            amount: Number(income.amount)
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add income");
      }

      navigate("/income");

    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
       <div className="income-page">
    <Container className="income-form-container py-4">
     

      <Card className="income-form-card shadow-sm bg-info">
        <Card.Body className="p-4">

          {/* Heading */}
          <div className="income-form-heading mb-4">
            <h3>Add New Income</h3>
            <p>Record your earnings and track your income</p>
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="danger">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>

            {/* Income Title */}
            <Form.Group className="mb-3">
              <Form.Label>Income Title</Form.Label>

              <Form.Control
                type="text"
                name="title"
                placeholder="e.g. Monthly Salary"
                value={income.title}
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
                    value={income.amount}
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
                  <Form.Label>Income Category</Form.Label>

                  <Form.Select
                    name="category"
                    value={income.category}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select category</option>
                    <option value="Salary">Salary</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Business">Business</option>
                    <option value="Investment">Investment</option>
                    <option value="Rental">Rental Income</option>
                    <option value="Gift">Gift</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>

            </Row>

            {/* Date */}
            <Form.Group className="mb-3">
              <Form.Label>Date Received</Form.Label>

              <Form.Control
                type="date"
                name="date"
                value={income.date}
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
                value={income.description}
                onChange={handleChange}
              />
            </Form.Group>

            {/* Buttons */}
            <div className="income-form-actions">

              <Button
                variant="btn btn-secondary"
                onClick={() => navigate("/dashboard")}
                disabled={loading}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="income-save-btn"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Income"}
              </Button>

            </div>

          </Form>

        </Card.Body>
      </Card>

    </Container>
    </div>
  );
}

export default IncomeForm;