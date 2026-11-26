import React, { useState, useEffect } from "react";
import {
    Container,
    Card,
    Table,
    Button,
    Spinner,
    Alert,
    Modal,
    Form,
    InputGroup,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Income() {
    const navigate = useNavigate();

    const [income, setIncome] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // EDIT STATE
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedIncome, setSelectedIncome] = useState(null);
    const [editLoading, setEditLoading] = useState(false);

    // FETCH INCOME
    const fetchIncome = async () => {
        try {
            const token = sessionStorage.getItem("token");

            const response = await API.get("/api/income/", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setIncome(response.data);
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to fetch income"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIncome();
    }, []);

    // TOTAL INCOME
    const totalIncome = income.reduce(
        (total, item) => total + Number(item.amount),
        0
    );

    // FORMAT CURRENCY
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        }).format(amount);
    };

    // FORMAT DATE
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // OPEN EDIT MODAL
    const handleEdit = (item) => {
        setSelectedIncome({
            ...item,
            date: item.date
                ? new Date(item.date).toISOString().split("T")[0]
                : "",
        });

        setShowEditModal(true);
    };

    // CLOSE EDIT MODAL
    const handleCloseEdit = () => {
        setShowEditModal(false);
        setSelectedIncome(null);
    };

    // HANDLE EDIT INPUT
    const handleEditChange = (e) => {
        const { name, value } = e.target;

        setSelectedIncome((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // UPDATE INCOME
    const handleUpdateIncome = async (e) => {
        e.preventDefault();

        setEditLoading(true);
        setError("");

        try {
            const token = sessionStorage.getItem("token");

            await API.put(
                `/api/income/${selectedIncome._id}`,
                {
                    title: selectedIncome.title,
                    amount: Number(selectedIncome.amount),
                    category: selectedIncome.category,
                    date: selectedIncome.date,
                    description: selectedIncome.description,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            handleCloseEdit();
            await fetchIncome();
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to update income"
            );
        } finally {
            setEditLoading(false);
        }
    };

    // DELETE INCOME
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this income transaction?"
        );

        if (!confirmDelete) return;

        try {
            const token = sessionStorage.getItem("token");

            await API.delete(`/api/income/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            await fetchIncome();
        } catch (err) {
            setError(
                err.response?.data?.message || "Failed to delete income"
            );
        }
    };

    return (
        <Container className="income-page py-4">

            {/* HEADER */}
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

            {/* ERROR MESSAGE */}
            {error && (
                <Alert
                    variant="danger"
                    dismissible
                    onClose={() => setError("")}
                >
                    {error}
                </Alert>
            )}

            {/* TOTAL INCOME CARD */}
            <Card className="income-total-card mb-4">
                <Card.Body>
                    <p>Total Income</p>
                    <h2>{formatCurrency(totalIncome)}</h2>
                    <span>{income.length} transactions recorded</span>
                </Card.Body>
            </Card>

            {/* INCOME TABLE */}
            <Card className="income-table-card">
                <Card.Body>

                    <h5 className="mb-3">Income Transactions</h5>

                    {loading ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" />
                        </div>
                    ) : income.length === 0 ? (
                        <div className="income-empty-state text-center py-5">
                            <h5>No income records yet</h5>

                            <p>
                                Start by adding your first income transaction.
                            </p>

                            <Button
                                onClick={() => navigate("/add-income")}
                                className="income-add-btn"
                            >
                                Add Your First Income
                            </Button>
                        </div>
                    ) : (
                        <div className="table-responsive">

                            <Table
                                hover
                                responsive
                                className="income-table align-middle"
                            >
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Category</th>
                                        <th>Date</th>
                                        <th>Description</th>
                                        <th className="text-end">Amount</th>
                                        <th className="text-center">Actions</th>
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

                                            {/* ACTION BUTTONS */}
                                            <td className="text-center">
                                                <div className="d-flex gap-2 justify-content-center">

                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        onClick={() => handleEdit(item)}
                                                    >
                                                        ✏️ Edit
                                                    </Button>

                                                    <Button
                                                        variant="outline-danger"
                                                        size="sm"
                                                        onClick={() => handleDelete(item._id)}
                                                    >
                                                        🗑️ Delete
                                                    </Button>

                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>

                        </div>
                    )}

                </Card.Body>
            </Card>

            {/* EDIT INCOME MODAL */}
            <Modal
                show={showEditModal}
                onHide={handleCloseEdit}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Edit Income</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {selectedIncome && (
                        <Form onSubmit={handleUpdateIncome}>

                            {/* TITLE */}
                            <Form.Group className="mb-3">
                                <Form.Label>Income Title</Form.Label>

                                <Form.Control
                                    type="text"
                                    name="title"
                                    value={selectedIncome.title || ""}
                                    onChange={handleEditChange}
                                    required
                                />
                            </Form.Group>

                            {/* AMOUNT */}
                            <Form.Group className="mb-3">
                                <Form.Label>Amount</Form.Label>

                                <InputGroup>
                                    <InputGroup.Text>₹</InputGroup.Text>

                                    <Form.Control
                                        type="number"
                                        name="amount"
                                        value={selectedIncome.amount || ""}
                                        onChange={handleEditChange}
                                        min="1"
                                        required
                                    />
                                </InputGroup>
                            </Form.Group>

                            {/* CATEGORY */}
                            <Form.Group className="mb-3">
                                <Form.Label>Category</Form.Label>

                                <Form.Control
                                    type="text"
                                    name="category"
                                    value={selectedIncome.category || ""}
                                    onChange={handleEditChange}
                                    required
                                />
                            </Form.Group>

                            {/* DATE */}
                            <Form.Group className="mb-3">
                                <Form.Label>Date</Form.Label>

                                <Form.Control
                                    type="date"
                                    name="date"
                                    value={selectedIncome.date || ""}
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
                                    value={selectedIncome.description || ""}
                                    onChange={handleEditChange}
                                />
                            </Form.Group>

                            {/* BUTTONS */}
                            <div className="d-flex justify-content-end gap-2">

                                <Button
                                    variant="secondary"
                                    onClick={handleCloseEdit}
                                    disabled={editLoading}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    disabled={editLoading}
                                >
                                    {editLoading
                                        ? "Saving..."
                                        : "Save Changes"}
                                </Button>

                            </div>

                        </Form>
                    )}
                </Modal.Body>
            </Modal>

        </Container>
    );
}

export default Income;