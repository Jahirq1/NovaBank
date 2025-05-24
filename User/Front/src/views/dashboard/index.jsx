import React, { useState,useEffect  } from 'react';
import { 
  Card, Table, Button, 
  Row, Col 
} from 'react-bootstrap';
import { FiArrowUpRight, FiArrowDownLeft } from 'react-icons/fi';
import '../../assets/scss/dashboard.scss';
import axios from 'axios';

const VolixBankDashboard = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axios.get('https://localhost:5001/api/Transactions/recent')
      .then(res => setTransactions(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="volix-dashboard">
      {/* Header Section */}
  

      {/* Main Content */}
      <main className="dashboard-content">
        <Row>
          {/* Balance Summary */}
          <Col md={4}>
            <Card className="summary-card balance">
              <Card.Body>
                <Card.Title>Total Balance</Card.Title>
                <Card.Text>$27,202.245</Card.Text>
                <Button variant="outline-primary">View Details</Button>
              </Card.Body>
            </Card>
          </Col>
          
          {/* Income */}
          <Col md={4}>
            <Card className="summary-card income">
              <Card.Body>
                <Card.Title>Total Income</Card.Title>
                <Card.Text>$5,224.645</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
          {/* Expense */}
          <Col md={4}>
            <Card className="summary-card expense">
              <Card.Body>
                <Card.Title>Total Expense</Card.Title>
                <Card.Text>$5,500.00</Card.Text>
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
          <p className="text-muted text-center m-0">Nuk ka ndodhur asnjë transaksion.</p>
        ) : (
          <Table hover responsive>
            <tbody>
              {transactions.map(tx => (
                <tr key={tx.id}>
                  <td className="transaction-icon">
                    <span className={`icon ${tx.amount > 0 ? 'income' : 'expense'}`}>
                      {tx.amount > 0 ? <FiArrowDownLeft /> : <FiArrowUpRight />}
                    </span>
                  </td>
                  <td>
                    <div className="transaction-info">
                      <strong>{tx.description}</strong>
                      <small>{tx.date}</small>
                    </div>
                  </td>
                  <td className={`amount ${tx.amount > 0 ? 'text-success' : 'text-danger'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)} USD
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