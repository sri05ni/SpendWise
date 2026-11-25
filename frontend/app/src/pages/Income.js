import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Table,
  Button,
  Spinner,
  Alert
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Income() {
  const navigate = useNavigate();

  const [income, setIncome] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchIncome = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const response = await fetch(
        "http://localhost:5000/api/income/",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch income");
      }

      setIncome(data);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  const totalIncome = income.reduce(
    (total, item) => total + Number(item.amount),
    0
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <Container className="income-page py-4">

      {/* Header */}
      <div className="income-page-header mb-4">
        <div>
          <h2>Income</h2>
          <p>Manage and track all your earnings</p>
        </div>

        <Button
          className="income-add-btn"
          onClick={() => navigate("/add-income")}
        >
          + Add Income
        </Button>
      </div>

      {/* Total Income Card */}
      <Card className="income-total-card mb-4">
        <Card.Body>
          <p>Total Income</p>
          <h2>{formatCurrency(totalIncome)}</h2>
          <span>{income.length} transactions recorded</span>
        </Card.Body>
      </Card>

      {/* Income Table */}
      <Card className="income-table-card">

        <Card.Body>

          <h5 className="mb-3">Income Transactions</h5>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : error ? (
            <Alert variant="danger">{error}</Alert>
          ) : income.length === 0 ? (
            <div className="income-empty-state text-center py-5">
              <h5>No income records yet</h5>
              <p>Start by adding your first income transaction.</p>

              <Button
                onClick={() => navigate("/add-income")}
                className="income-add-btn"
              >
                Add Your First Income
              </Button>
            </div>
          ) : (
            <div className="table-responsive">

              <Table hover responsive className="income-table align-middle">

                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Description</th>
                    <th className="text-end">Amount</th>
                  </tr>
                </thead>

                <tbody>
                  {income.map((item) => (
                    <tr key={item._id}>
                      <td className="fw-semibold">
                        {item.title}
                      </td>

                      <td>
                        <span className="income-category">
                          {item.category}
                        </span>
                      </td>

                      <td>
                        {formatDate(item.date)}
                      </td>

                      <td>
                        {item.description || "-"}
                      </td>

                      <td className="text-end income-amount">
                        +{formatCurrency(item.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </Table>

            </div>
          )}

        </Card.Body>

      </Card>

    </Container>
  );
}

export default Income;