import React, { useEffect, useState } from "react";

import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Modal,
  Form,
  Alert,
} from "react-bootstrap";

import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

function Dashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("all");

  // INCOME STATE
  const [income, setIncome] = useState([]);

  // EXPENSE STATE
  const [expenses, setExpenses] = useState([]);

  // LOADING AND ERROR
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // EDIT MODAL
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");

  // EDIT FORM
  const [editForm, setEditForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
    description: "",
  });

  // FETCH DASHBOARD DATA
  const fetchDashboardData = async () => {
    try {
      const token = sessionStorage.getItem("token");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [expenseResponse, incomeResponse] = await Promise.all([
        API.get("/api/expenses/", { headers }),
        API.get("/api/income/", { headers }),
      ]);

      setExpenses(expenseResponse.data);
      setIncome(incomeResponse.data);
      setError("");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load dashboard data"
      );
    }
  };

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      await fetchDashboardData();
      setLoading(false);
    };

    loadDashboard();
  }, []);

  // TOTAL INCOME
  const totalIncome = income.reduce(
    (total, item) => total + Number(item.amount),
    0
  );

  // TOTAL EXPENSES
  const totalExpenses = expenses.reduce(
    (total, item) => total + Number(item.amount),
    0
  );

  // TOTAL BALANCE
  const balance = totalIncome - totalExpenses;

  // CURRENT MONTH AND YEAR
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  // MONTHLY INCOME
  const monthlyIncome = income
    .filter((item) => {
      const date = new Date(item.date);

      return (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    })
    .reduce((total, item) => total + Number(item.amount), 0);

  // MONTHLY EXPENSES
  const monthlyExpenses = expenses
    .filter((item) => {
      const date = new Date(item.date);

      return (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    })
    .reduce((total, item) => total + Number(item.amount), 0);

  // MONTHLY SAVINGS
  const monthlySavings = monthlyIncome - monthlyExpenses;

  // FORMAT CURRENCY
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  // CATEGORY SUMMARY
  const categorySummary = Object.values(
    expenses.reduce((acc, expense) => {
      const category = expense.category;

      if (!acc[category]) {
        acc[category] = {
          _id: category,
          total: 0,
          count: 0,
        };
      }

      acc[category].total += Number(expense.amount);
      acc[category].count += 1;

      return acc;
    }, {})
  );

  // LAST 6 MONTHS EXPENSE CHART
  const monthlyData = [];

  for (let i = 5; i >= 0; i--) {
    const date = new Date();

    date.setDate(1);
    date.setMonth(date.getMonth() - i);

    const month = date.getMonth();
    const year = date.getFullYear();

    const monthTotal = expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);

        return (
          expenseDate.getMonth() === month &&
          expenseDate.getFullYear() === year
        );
      })
      .reduce(
        (total, expense) => total + Number(expense.amount),
        0
      );

    monthlyData.push({
      month: date.toLocaleString("en-IN", {
        month: "short",
      }),
      amount: monthTotal,
    });
  }

  // MAXIMUM EXPENSE FOR CHART
  const maxExpense = Math.max(
    ...monthlyData.map((item) => item.amount),
    1
  );

  // LOADING
  if (loading) {
    return (
      <div className="dashboard-loading">
        <Loader />
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <Container className="mt-5">
        <Card className="p-4 text-center">
          <h5>Unable to load dashboard</h5>
          <p>{error}</p>

          <Button
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </Card>
      </Container>
    );
  }

  // COMBINE INCOME AND EXPENSES
  const allTransactions = [
    ...income.map((item) => ({
      ...item,
      type: "Income",
    })),

    ...expenses.map((item) => ({
      ...item,
      type: "Expense",
    })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  // FILTER TRANSACTIONS
  const filteredTransactions = allTransactions.filter((item) => {
    if (activeTab === "all") return true;

    return item.type.toLowerCase() === activeTab;
  });

  // RECENT TRANSACTIONS
  const recentTransactions = filteredTransactions.slice(0, 5);

  // OPEN EDIT MODAL
  const handleEdit = (item) => {
    setSelectedTransaction(item);

    setEditForm({
      title: item.title || "",
      amount: item.amount || "",
      category: item.category || "",
      date: item.date
        ? String(item.date).slice(0, 10)
        : "",
      description: item.description || "",
    });

    setEditError("");
    setShowEditModal(true);
  };

  // HANDLE EDIT FORM CHANGES
  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // UPDATE TRANSACTION
  const handleUpdateTransaction = async (e) => {
    e.preventDefault();

    if (!selectedTransaction) return;

    try {
      setEditLoading(true);
      setEditError("");

      const token = sessionStorage.getItem("token");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const endpoint =
        selectedTransaction.type === "Income"
          ? "/api/income/"
          : "/api/expenses/";

      const updatedData = {
        title: editForm.title,
        amount: Number(editForm.amount),
        category: editForm.category,
        date: editForm.date,
        description: editForm.description,
      };

      await API.put(
        `${endpoint}${selectedTransaction._id}`,
        updatedData,
        { headers }
      );

      // REFRESH DASHBOARD
      await fetchDashboardData();

      setShowEditModal(false);
      setSelectedTransaction(null);
    } catch (error) {
      setEditError(
        error.response?.data?.message ||
          "Failed to update transaction"
      );
    } finally {
      setEditLoading(false);
    }
  };

  // DELETE TRANSACTION
  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this ${item.type.toLowerCase()} transaction?`
    );

    if (!confirmed) return;

    try {
      const token = sessionStorage.getItem("token");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const endpoint =
        item.type === "Income"
          ? "/api/income/"
          : "/api/expenses/";

      await API.delete(
        `${endpoint}${item._id}`,
        { headers }
      );

      // REFRESH DASHBOARD
      await fetchDashboardData();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to delete transaction"
      );
    }
  };

  // DASHBOARD
  return (
    <>
      <div className="dashboard-page">
        <Container fluid className="dashboard-container">

          {/* WELCOME SECTION */}
          <div className="dashboard-welcome">
            <div>
              <h2>Welcome back! 👋</h2>

              <p>
                <b>
                  Here's an overview of your financial activity.
                </b>
              </p>
            </div>

            <Button
              className="dashboard-add-btn"
              onClick={() => navigate("/add-expense")}
            >
              + Add Expense
            </Button>
          </div>

          <br />

          {/* SUMMARY CARDS */}
          <Row className="g-4 mb-4 p-4 m-1">

            {/* TOTAL BALANCE */}
            <Col xs={12} md={6} xl={3}>
              <Card className="summary-card h-100">
                <Card.Body>
                  <div className="summary-top">
                    <span>Total Balance</span>
                    <span className="summary-icon">
                      💰
                    </span>
                  </div>

                  <h3>{formatCurrency(balance)}</h3>

                  <small>Income - expenses</small>
                </Card.Body>
              </Card>
            </Col>

            {/* TOTAL INCOME */}
            <Col xs={12} md={6} xl={3}>
              <Card className="summary-card h-100">
                <Card.Body>
                  <div className="summary-top">
                    <span>Total Income</span>
                    <span className="summary-icon">
                      📈
                    </span>
                  </div>

                  <h3>{formatCurrency(totalIncome)}</h3>

                  <small>
                    {income.length} income transactions
                  </small>
                </Card.Body>
              </Card>
            </Col>

            {/* TOTAL EXPENSES */}
            <Col xs={12} md={6} xl={3}>
              <Card className="summary-card h-100">
                <Card.Body>
                  <div className="summary-top">
                    <span>Total Expenses</span>
                    <span className="summary-icon">
                      💳
                    </span>
                  </div>

                  <h3>{formatCurrency(totalExpenses)}</h3>

                  <small>
                    {expenses.length} expense transactions
                  </small>
                </Card.Body>
              </Card>
            </Col>

            {/* MONTHLY SAVINGS */}
            <Col xs={12} md={6} xl={3}>
              <Card className="summary-card h-100">
                <Card.Body>
                  <div className="summary-top">
                    <span>This Month's Savings</span>
                    <span className="summary-icon">
                      🏦
                    </span>
                  </div>

                  <h3>{formatCurrency(monthlySavings)}</h3>

                  <small>
                    Monthly income minus expenses
                  </small>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* CHART AND CATEGORY SECTION */}
          <Row className="g-4 mb-4">

            {/* MONTHLY EXPENSE CHART */}
            <Col xs={12} lg={8}>
              <Card className="dashboard-card h-100">
                <Card.Body>
                  <div className="section-heading">
                    <div>
                      <h5>Expense Overview</h5>
                      <p>Your monthly spending activity</p>
                    </div>
                  </div>

                  <div className="expense-chart">
                    {monthlyData.map((item, index) => (
                      <div
                        className="chart-column"
                        key={index}
                      >
                        <div className="chart-bar-wrapper">
                          <div
                            className="dashboard-chart-bar"
                            style={{
                              height:
                                item.amount === 0
                                  ? "4px"
                                  : `${(item.amount / maxExpense) * 100}%`,
                            }}
                            title={formatCurrency(item.amount)}
                          />
                        </div>

                        <span>{item.month}</span>

                        <small>
                          {formatCurrency(item.amount)}
                        </small>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* CATEGORY SUMMARY */}
            <Col xs={12} lg={4}>
              <Card className="dashboard-card h-100">
                <Card.Body>
                  <div className="section-heading">
                    <div>
                      <h5>Categories</h5>
                      <p>Expense breakdown</p>
                    </div>
                  </div>

                  {categorySummary.length === 0 ? (
                    <p className="empty-message">
                      No expenses recorded yet.
                    </p>
                  ) : (
                    categorySummary.map((category, index) => (
                      <div
                        className="category-item"
                        key={index}
                      >
                        <div className="category-info">
                          <span>{category._id}</span>

                          <strong>
                            {formatCurrency(category.total)}
                          </strong>
                        </div>

                        <div className="category-progress">
                          <div
                            className="category-progress-fill"
                            style={{
                              width: `${
                                totalExpenses > 0
                                  ? (category.total / totalExpenses) * 100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    ))
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* RECENT TRANSACTIONS */}
          <Card className="dashboard-card transactions-card rounded-4">
            <Card.Body>

              {/* SECTION HEADER */}
              <div className="section-heading text-dark">
                <div>
                  <h5>Recent Transactions</h5>
                  <p>Manage your income and expenses</p>
                </div>

                <Button
                  variant="btn btn-primary"
                  size="sm"
                  onClick={() => navigate("/add-income")}
                >
                  + Add Income
                </Button>
              </div>

              <br />

              {/* TRANSACTION TABS */}
              <div className="transaction-tabs mb-3">
                <Button
                  variant={
                    activeTab === "all"
                      ? "info"
                      : "outline-dark"
                  }
                  onClick={() => setActiveTab("all")}
                >
                  All Transactions
                </Button>

                <Button
                  variant={
                    activeTab === "income"
                      ? "success"
                      : "outline-dark"
                  }
                  onClick={() => setActiveTab("income")}
                >
                  Income
                </Button>

                <Button
                  variant={
                    activeTab === "expense"
                      ? "danger"
                      : "outline-dark"
                  }
                  onClick={() => setActiveTab("expense")}
                >
                  Expenses
                </Button>
              </div>

              {/* EMPTY STATE */}
              {recentTransactions.length === 0 ? (
                <div className="empty-message">
                  <p>No transactions found.</p>
                </div>
              ) : (

                /* TRANSACTION TABLE */
                <Table
                  responsive
                  className="transaction-table table-info"
                >
                  <thead>
                    <tr>
                      <th>Transaction</th>
                      <th>Type</th>
                      <th>Category</th>
                      <th>Date</th>
                      <th className="text-end">Amount</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {recentTransactions.map((item) => (
                      <tr
                        key={`${item.type}-${item._id}`}
                      >

                        {/* TITLE */}
                        <td>
                          <div className="transaction-name">
                            <span className="transaction-icon">
                              {item.type === "Income"
                                ? "💰"
                                : "💸"}
                            </span>

                            <strong>{item.title}</strong>
                          </div>
                        </td>

                        {/* TYPE */}
                        <td>
                          <span
                            className={
                              item.type === "Income"
                                ? "transaction-type income-type"
                                : "transaction-type expense-type"
                            }
                          >
                            {item.type}
                          </span>
                        </td>

                        {/* CATEGORY */}
                        <td>{item.category}</td>

                        {/* DATE */}
                        <td>
                          {new Date(item.date).toLocaleDateString(
                            "en-IN"
                          )}
                        </td>

                        {/* AMOUNT */}
                        <td
                          className={`text-end ${
                            item.type === "Income"
                              ? "transaction-income"
                              : "transaction-expense"
                          }`}
                        >
                          {item.type === "Income" ? "+" : "-"}
                          {formatCurrency(item.amount)}
                        </td>

                        {/* ACTIONS */}
                        <td className="text-center">
                          <div className="d-flex gap-2 justify-content-center">

                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleEdit(item)}
                              title="Edit transaction"
                            >
                              ✏️
                            </Button>

                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete(item)}
                              title="Delete transaction"
                            >
                              🗑️
                            </Button>

                          </div>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>

        </Container>
      </div>

      {/* EDIT TRANSACTION MODAL */}
      <Modal
        show={showEditModal}
        onHide={() => {
          if (!editLoading) {
            setShowEditModal(false);
          }
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Edit {selectedTransaction?.type}
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleUpdateTransaction}>
          <Modal.Body>

            {editError && (
              <Alert variant="danger">
                {editError}
              </Alert>
            )}

            {/* TITLE */}
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>

              <Form.Control
                type="text"
                name="title"
                value={editForm.title}
                onChange={handleEditChange}
                placeholder="Transaction title"
                required
              />
            </Form.Group>

            {/* AMOUNT */}
            <Form.Group className="mb-3">
              <Form.Label>Amount (₹)</Form.Label>

              <Form.Control
                type="number"
                name="amount"
                value={editForm.amount}
                onChange={handleEditChange}
                placeholder="Enter amount"
                min="0.01"
                step="0.01"
                required
              />
            </Form.Group>

            {/* CATEGORY */}
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>

              <Form.Control
                type="text"
                name="category"
                value={editForm.category}
                onChange={handleEditChange}
                placeholder="Category"
                required
              />
            </Form.Group>

            {/* DATE */}
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>

              <Form.Control
                type="date"
                name="date"
                value={editForm.date}
                onChange={handleEditChange}
                required
              />
            </Form.Group>

            {/* DESCRIPTION */}
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>

              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={editForm.description}
                onChange={handleEditChange}
                placeholder="Add a description"
              />
            </Form.Group>

          </Modal.Body>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowEditModal(false)}
              disabled={editLoading}
            >
              Cancel
            </Button>

            <Button
              variant="primary"
              type="submit"
              disabled={editLoading}
            >
              {editLoading
                ? "Updating..."
                : "Save Changes"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default Dashboard;