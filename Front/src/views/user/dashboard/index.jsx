import React, { useEffect, useState } from 'react';
import { Card, Table, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { FiArrowUpRight, FiArrowDownLeft } from 'react-icons/fi';
import '../../../assets/scss/dashboard.scss';
import api from '../../../server/instance'



const VolixBankDashboard = () => {
  const [balance, setBalance]         = useState(0);
  const [income, setIncome]           = useState(0);
  const [expense, setExpense]         = useState(0);
  const [transactions, setTransactions] = useState([]);

  const fetchData = async () => {
    try {
      const resTx = await api.get('/user/transactions/me');
      const tx = resTx.data.map((t) => ({
        id:   t.id,
        date: t.date,
        description: t.note
          ?? (t.amount < 0 ? `Transfer te ${t.receiverName}` : `Transfer nga ${t.senderName}`),
        amount: t.amount,
      }));

      const totInc = tx.filter((t) => t.amount > 0)
                       .reduce((s, t) => s + t.amount, 0);
      const totExp = tx.filter((t) => t.amount < 0)
                       .reduce((s, t) => s + Math.abs(t.amount), 0);

      setIncome(totInc);
      setExpense(totExp);
      setTransactions(tx.slice(0, 5));  

      const resBal =  await api.get('/users/balance');
      setBalance(resBal.data);
    } catch (err) {
      console.error('Gabim gjatë marrjes së të dhënave:', err);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="volix-dashboard">
      <header className="dashboard-header">
        <div className="branding">
          <h1>NOVA Bank</h1>
          <div className="user-greeting">
            <p>Pershendetje, menaxho financat tuaja</p>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        <Row>
          <Col md={4}>
            <Card className="summary-card balance">
              <Card.Body>
                <Card.Title>Balanci Total</Card.Title>
                <Card.Text>{balance.toFixed(2)} €</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="summary-card income">
              <Card.Body>
                <Card.Title>Te Hyrat Totale</Card.Title>
                <Card.Text>{income.toFixed(2)} €</Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="summary-card expense">
              <Card.Body>
                <Card.Title>Shpenzimet Totale</Card.Title>
                <Card.Text>{expense.toFixed(2)} €</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col>
            <Card className="transactions">
              <Card.Header>
                <Card.Title>Transaksionet  e fundit</Card.Title>
              </Card.Header>
              <Card.Body>
                {transactions.length === 0 ? (
                  <p className="text-center">Nuk ka transaksione.</p>
                ) : (
                  <Table hover responsive>
                    <tbody>
                      {transactions.map((tx) => (
                        <tr key={tx.id}>
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