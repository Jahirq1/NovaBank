import React, { useEffect, useState } from 'react';
import { Card, Table, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { FiArrowUpRight, FiArrowDownLeft } from 'react-icons/fi';
import '../../../assets/scss/dashboard.scss';

const getUserId = () => localStorage.getItem('userId');

const VolixBankDashboard = () => {
  const [balance, setBalance]   = useState(0);
  const [income, setIncome]     = useState(0);
  const [expense, setExpense]   = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const userId = getUserId();
    if (!userId) return;

    /* ──────────────── 1. TRANSAKSIONET ──────────────── */
    axios
      .get(`http://localhost:5231/api/user/transactions/user/${userId}`)
      .then((res) => {
        // normalizo fusha që mund të vijnë me shkronjë të madhe
        const tx = res.data.map((t) => ({
          id:         t.id        ?? t.Id,
          date:       t.date      ?? t.Date,
          description:t.description ?? t.Note ?? 'Transfer',
          amount:     t.amount    ?? t.Amount
        }));

        /* Llogarit totalet */
        const totalIncome  = tx.filter((t) => t.amount > 0)
                               .reduce((s, t) => s + t.amount, 0);

        const totalExpense = tx.filter((t) => t.amount < 0)
                               .reduce((s, t) => s + Math.abs(t.amount), 0);

        setIncome(totalIncome);
        setExpense(totalExpense);
        setTransactions(tx.slice(0, 5)); // 5 të fundit
      })
      .catch((err) =>
        console.error('Gabim gjatë marrjes së transaksioneve:', err)
      );

    /* ──────────────── 2. BALANCA ──────────────── */
    axios
      .get(`http://localhost:5231/api/Users/balance/${userId}`)
      .then((res) => setBalance(res.data))
      .catch((err) =>
        console.error('Gabim gjatë marrjes së balancës:', err)
      );
  }, []);

  /* ──────────────── UI ──────────────── */
  return (
    <div className="volix-dashboard">
      <header className="dashboard-header">
        <div className="branding">
          <h1>NOVA Bank</h1>
          <div className="user-greeting">
            <p>Mirëmëngjes, menaxho financat tuaja</p>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        {/* Kartelat për totalet */}
        <Row>
          <Col md={4}>
            <Card className="summary-card balance">
              <Card.Body>
                <Card.Title>Total Balance</Card.Title>
                <Card.Text>{balance.toFixed(2)} €</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="summary-card income">
              <Card.Body>
                <Card.Title>Total Income</Card.Title>
                <Card.Text>{income.toFixed(2)} €</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="summary-card expense">
              <Card.Body>
                <Card.Title>Total Expense</Card.Title>
                <Card.Text>{expense.toFixed(2)} €</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Pesë transaksionet më të fundit */}
        <Row className="mt-4">
          <Col>
            <Card className="transactions">
              <Card.Header>
                <Card.Title>Recent Transactions</Card.Title>
              </Card.Header>
              <Card.Body>
                {transactions.length === 0 ? (
                  <p className="text-center">
                    Nuk ka transaksione.
                  </p>
                ) : (
                  <Table hover responsive>
                    <tbody>
                      {transactions.map((tx) => (
                        <tr key={tx.id}>
                          <td className="transaction-icon">
                            <span
                              className={`icon ${
                                tx.amount > 0 ? 'income' : 'expense'
                              }`}
                            >
                              {tx.amount > 0 ? (
                                <FiArrowDownLeft />
                              ) : (
                                <FiArrowUpRight />
                              )}
                            </span>
                          </td>
                          <td>
                            <div className="transaction-info">
                              <strong>{tx.description}</strong>
                              <small>
                                {new Date(tx.date).toLocaleString()}
                              </small>
                            </div>
                          </td>
                          <td
                            className={`amount ${
                              tx.amount > 0 ? 'text-success' : 'text-danger'
                            }`}
                          >
                            {tx.amount > 0 ? '+' : '-'}
                            {Math.abs(tx.amount).toFixed(2)} €
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </main>
    </div>
  );
};

export default VolixBankDashboard;
