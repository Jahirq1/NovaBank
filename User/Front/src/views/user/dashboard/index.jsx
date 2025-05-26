import React, { useEffect, useState } from 'react'; 
import { Card, Table, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { FiArrowUpRight, FiArrowDownLeft } from 'react-icons/fi';
import '../../../assets/scss/dashboard.scss';


const getUserSession = () => {
  return localStorage.getItem("userId"); // ose nga session storage
};
const VolixBankDashboard = () => {
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const userId = getUserSession();
    if (!userId) return;

    // Merr transaksionet për këtë user
    axios.get(`https://localhost:5001/api/Transactions/user/${userId}`)
      .then(res => {
        const data = res.data;

        // Llogarit income dhe expense
        const totalIncome = data
          .filter(t => t.receiverId === userId)
          .reduce((sum, t) => sum + t.amount, 0);

        const totalExpense = data
          .filter(t => t.senderId === userId)
          .reduce((sum, t) => sum + t.amount, 0);

        setTransactions(data.slice(0, 5));
        setIncome(totalIncome);
        setExpense(totalExpense);
      })
      .catch(err => {
        console.error('Gabim gjatë marrjes së transaksioneve:', err);
      });

    // Merr balancën nga tabela Users
    axios.get(`https://localhost:5001/api/Users/balance/${userId}`)
      .then(res => {
        setBalance(res.data);
      })
      .catch(err => {
        console.error('Gabim gjatë marrjes së balancës:', err);
      });

  }, []);

  return (
    <div className="volix-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="branding">
          <h1>NOVA Bank</h1>
          <div className="user-greeting">
            <p>Mirëmëngjes, menaxho financat tuaja</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-content">
        <Row>
          <Col md={4}>
            <Card className="summary-card balance">
              <Card.Body>
                <Card.Title>Total Balance</Card.Title>
                <Card.Text>${balance.toFixed(2)}</Card.Text>
                
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="summary-card income">
              <Card.Body>
                <Card.Title>Total Income</Card.Title>
                <Card.Text>${income.toFixed(2)}</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="summary-card expense">
              <Card.Body>
                <Card.Title>Total Expense</Card.Title>
                <Card.Text>${expense.toFixed(2)}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Transactions Section */}
        <Row className="mt-4">
          <Col>
            <Card className="transactions">
              <Card.Header>
                <Card.Title>Recent Transactions</Card.Title>
              </Card.Header>
              <Card.Body>
                {transactions.length === 0 ? (
                  <p className="text-center">Nuk ka ndodhur asnjë transaction.</p>
                ) : (
                  <Table hover responsive>
                    <tbody>
                      {transactions.map(tx => (
                        <tr key={tx.transactionId}>
                          <td className="transaction-icon">
                            <span className={`icon ${tx.amount > 0 ? 'income' : 'expense'}`}>
                              {tx.amount > 0 ? <FiArrowDownLeft /> : <FiArrowUpRight />}
                            </span>
                          </td>
                          <td>
                            <div className="transaction-info">
                              <strong>{tx.description}</strong>
                              <small>{new Date(tx.date).toLocaleString()}</small>
                            </div>
                          </td>
                          <td className={`amount ${tx.amount > 0 ? 'text-success' : 'text-danger'}`}>
                            {tx.amount > 0 ? '+' : '-'}{Math.abs(tx.amount).toFixed(2)} {tx.currency || '€'}
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

