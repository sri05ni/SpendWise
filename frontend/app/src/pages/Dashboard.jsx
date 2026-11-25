import React, { useEffect, useState } from "react";

import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Spinner,
} from "react-bootstrap";

import { useNavigate } from "react-router-dom";
import Loader from "./Loader";


const API_URL = "http://localhost:5000/api/expenses";

function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");

  // Income state
  const [income, setIncome] = useState([]);

  // Expense state
  const [expenses, setExpenses] = useState([]);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // FETCH INCOME AND EXPENSES
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = sessionStorage.getItem("token");

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [expenseResponse, incomeResponse] = await Promise.all([
          fetch(`${API_URL}/`, {
            headers,
          }),

          fetch("http://localhost:5000/api/income/", {
            headers,
          }),
        ]);

        const expenseData = await expenseResponse.json();
        const incomeData = await incomeResponse.json();

        if (!expenseResponse.ok) {
          throw new Error(
            expenseData.message || "Failed to fetch expenses"
          );
        }

        if (!incomeResponse.ok) {
          throw new Error(
            incomeData.message || "Failed to fetch income"
          );
        }

        setExpenses(expenseData);
        setIncome(incomeData);

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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

  // RECENT EXPENSES
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  // LOADING
  if (loading) {
    return (
      <div className="dashboard-loading ">
        {/* <Spinner animation="border" /> */}
        <Loader/>
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

          <Button onClick={() => window.location.reload()}>
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
              <b>Here's an overview of your financial activity.</b>
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
                  <span className="summary-icon ">💰</span>
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
                  <span className="summary-icon">📈</span>
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
                  <span className="summary-icon">💳</span>
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
                  <span className="summary-icon">🏦</span>
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
        variant="btn  btn-primary"
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
        variant={activeTab === "all" ? "info" : "outline-dark"}
        onClick={() => setActiveTab("all")}
      >
        All Transactions
      </Button>

      <Button
        variant={activeTab === "income" ? "success" : "outline-dark"}
        onClick={() => setActiveTab("income")}
      >
        Income
      </Button> 

      <Button
        variant={activeTab === "expense" ? "danger" : "outline-dark"}
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
      <Table responsive className="transaction-table table-info ">

        <thead>
          <tr>
            <th>Transaction</th>
            <th>Type</th>
            <th>Category</th>
            <th>Date</th>
            <th className="text-end">Amount</th>
          </tr>
        </thead>

        <tbody>

          {recentTransactions.map((item) => (

            <tr key={`${item.type}-${item._id}`}>

              {/* TITLE */}
              <td>
                <div className="transaction-name">

                  <span className="transaction-icon">
                    {item.type === "Income" ? "💰" : "💸"}
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
                {new Date(item.date).toLocaleDateString("en-IN")}
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

            </tr>

          ))}

        </tbody>

      </Table>

    )}

  </Card.Body>
</Card>

      </Container>

    </div>
    </>
  );
}

export default Dashboard;