import React from 'react';
import { 
  Card, Table, Button, Row, Col, ProgressBar 
} from 'react-bootstrap';
import { FiArrowUpRight, FiArrowDownLeft } from 'react-icons/fi';
import '../../../assets/scss/dashboard.scss';

const VolixBankDashboard = () => {
  const dashboardData = {
    transactions: [
      { id: 1, date: '22 Dec 2022, 07:43 AM', description: 'SteamWallet', amount: -25.00, currency: 'USD' },
      { id: 2, date: '27 Dec 2022, 17:24 PM', description: 'Apple Macbook Pro', amount: -220.00, currency: 'USD' }
    ]
  };

  return (
    <div className="volix-dashboard">
      {/* Header Section */}
      <header className="dashboard-header">
        <div className="branding">
          <h1>NOVA Bank</h1>
          <div className="user-greeting">
            <p>Good morning, let's manage your finances</p>
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
                <Card.Text>$27,202.245</Card.Text>
                <Button variant="outline-primary">View Details</Button>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            <Card className="summary-card income">
              <Card.Body>
                <Card.Title>Total Income</Card.Title>
                <Card.Text>$5,224.645</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          
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
                <Table hover responsive>
                  <tbody>
                    {dashboardData.transactions.map(tx => (
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
                          {tx.amount > 0 ? '+' : ''}{tx.amount.toFixed(2)} {tx.currency}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </main>
    </div>
  );
};

export default VolixBankDashboard;
