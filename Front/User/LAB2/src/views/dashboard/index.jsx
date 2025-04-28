import React, { useState } from 'react';
import { 
  Card, Table, ProgressBar, Button, Form, Modal, 
  Row, Col, InputGroup, FormControl 
} from 'react-bootstrap';
import { FiSearch, FiPlus, FiArrowUpRight, FiArrowDownLeft } from 'react-icons/fi';
import '../../assets/scss/dashboard.scss';
import cardImage from '../../assets/images/vs1.webp';

const VolixBankDashboard = () => {
  // State management
  const [modals, setModals] = useState({
    transfer: false,
    addCard: false
  });
  const [formData, setFormData] = useState({
    transfer: { amount: '', note: '' },
    card: { name: '', number: '', expiry: '', cvv: '' }
  });

  // Data
  const dashboardData = {
    cards: [
      { 
        id: 1, 
        name: 'Nova •••• 1234',
        balance: '$6,420.00',
        image: cardImage,
        type: 'Nova Card',
        bgColor: '#1a1f71'
      },
      { 
        id: 2, 
        name: 'Novacard •••• 5678', 
        balance: '$3,245.00',
        image: cardImage,
        type: 'Nova Bank',
        bgColor: '#eb001b'
      }
    ],
    transactions: [
      { id: 1, date: '22 Dec 2022, 07:43 AM', description: 'SteamWallet', amount: -25.00, currency: 'USD' },
      { id: 2, date: '27 Dec 2022, 17:24 PM', description: 'Apple Macbook Pro', amount: -220.00, currency: 'USD' }
    ],
    savings: [
      { id: 1, name: 'New Phone', target: 1000, current: 650 },
      { id: 2, name: 'New Car', target: 12000, current: 3200 },
      { id: 3, name: 'New PC', target: 3000, current: 100 }
    ]
  };

  // Handlers
  const handleSubmit = (type, e) => {
    e.preventDefault();
    setModals({...modals, [type]: false});
    setFormData({
      ...formData,
      [type]: Object.fromEntries(
        Object.keys(formData[type]).map(key => [key, ''])
      )
    });
  };

  return (
    <div className="volix-dashboard">
      {/* Header Section */}
      <header className="dashboard-header">
        <div className="branding">
          <h1>NOVA Bank</h1>
          <div className="user-greeting">
            <h3>Hello, z.Qoqaj</h3>
            <p>Good morning, let's manage your finances</p>
          </div>
        </div>
        
       
      </header>

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
          
          {/* Income/Expense */}
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

        <Row className="mt-4">
          {/* Cards Section */}
          <Col lg={5}>
            <Card className="cards-section">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <Card.Title>Card List</Card.Title>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => setModals({...modals, addCard: true})}
                >
                  <FiPlus /> Add Card
                </Button>
              </Card.Header>
              <Card.Body>
  {dashboardData.cards.map(card => (
    <div key={card.id} className="mb-3">
      <div 
        className="card-visual"
        style={{
          background: `linear-gradient(135deg, ${card.bgColor} 0%, ${card.bgColor}80 100%)`,
          height: '180px',
          borderRadius: '12px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          marginBottom: '15px'
        }}
      >
        {/* Bank Name */}
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          color: 'white',
          fontSize: '14px',
          fontWeight: 'bold',
          textShadow: '0 1px 2px rgba(0,0,0,0.5)'
        }}>
          NOVA Bank
        </div>

        {/* Silver Chip */}
        <div style={{
          position: 'absolute',
          top: '60px',
          right: '20px',
          width: '40px',
          height: '30px',
          background: 'linear-gradient(135deg, #d3d3d3 0%, #a9a9a9 50%, #d3d3d3 100%)',
          borderRadius: '5px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.4)'
        }}>
          <div style={{
            position: 'absolute',
            top: '5px',
            left: '5px',
            width: '30px',
            height: '20px',
            background: `
              linear-gradient(45deg, 
                transparent 45%, 
                rgba(255,255,255,0.7) 45%, 
                rgba(255,255,255,0.7) 55%, 
                transparent 55%
              ),
              linear-gradient(-45deg, 
                transparent 45%, 
                rgba(255,255,255,0.7) 45%, 
                rgba(255,255,255,0.7) 55%, 
                transparent 55%
              )`
          }}></div>
        </div>

        {/* Hologram */}
        <div style={{
          position: 'absolute',
          top: '30px',
          right: '60px',
          width: '40px',
          height: '25px',
          background: 'linear-gradient(45deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)',
          transform: 'rotate(15deg)',
          borderRadius: '3px',
          boxShadow: '0 0 10px rgba(255,255,255,0.5)'
        }}></div>

        {/* Card Content */}
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          color: 'white',
          textShadow: '0 1px 3px rgba(0,0,0,0.5)'
        }}>
          <div style={{ fontSize: '14px', opacity: 0.8 }}>Current Balance</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{card.balance}</div>
          <div style={{ marginTop: '15px' }}>
            <div style={{ fontSize: '12px' }}>{card.name}</div>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: 'bold',
              marginTop: '5px'
            }}>{card.type}</div>
          </div>
        </div>
      </div>
      
      <div className="d-flex justify-content-between mt-2">
        <Button variant="outline-primary" size="sm">Details</Button>
        <Button variant="outline-secondary" size="sm">Manage</Button>
        <Button variant="outline-danger" size="sm">Lock</Button>
      </div>
    </div>
  ))}
</Card.Body>
            </Card>
          </Col>

          {/* Quick Transfer Section */}
          <Col lg={7}>
            <Row>
              <Col md={6}>
                <Card className="quick-transfer-card">
                  <Card.Header>
                    <Card.Title>Quick Money Transfer</Card.Title>
                  </Card.Header>
                  <Card.Body>
                    <Form>
                      <div className="recipient-profiles">
                        {['JD', 'MS', 'AK', 'TM'].map((initials, index) => (
                          <div key={index} className="profile-icon">
                            {initials}
                          </div>
                        ))}
                        <div className="profile-icon add-profile">
                          <FiPlus />
                        </div>
                      </div>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Amount</Form.Label>
                        <InputGroup>
                          <InputGroup.Text>$</InputGroup.Text>
                          <Form.Control 
                            type="number" 
                            placeholder="Enter amount"
                          />
                        </InputGroup>
                      </Form.Group>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Note</Form.Label>
                        <Form.Control 
                          as="textarea" 
                          rows={2}
                          placeholder="Add a note (optional)"
                        />
                      </Form.Group>
                      
                      <Button variant="primary" type="submit" className="w-100">
                        Transfer Now
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col md={6}>
                <Card className="savings-plans">
                  <Card.Body>
                    <Card.Title>Savings Plans</Card.Title>
                    {dashboardData.savings.map(plan => (
                      <div key={plan.id} className="savings-item">
                        <div className="d-flex justify-content-between">
                          <span>{plan.name}</span>
                          <span>${plan.current} / ${plan.target}</span>
                        </div>
                        <ProgressBar 
                          now={(plan.current / plan.target) * 100} 
                          className="mt-2"
                        />
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
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

      {/* Modals */}
      <TransferModal 
        show={modals.transfer}
        onHide={() => setModals({...modals, transfer: false})}
        onSubmit={(e) => handleSubmit('transfer', e)}
        data={formData.transfer}
        onChange={(data) => setFormData({...formData, transfer: data})}
      />
      
      <AddCardModal 
        show={modals.addCard}
        onHide={() => setModals({...modals, addCard: false})}
        onSubmit={(e) => handleSubmit('card', e)}
        data={formData.card}
        onChange={(data) => setFormData({...formData, card: data})}
      />
    </div>
  );
};

// Modal Components
const TransferModal = ({ show, onHide, onSubmit, data, onChange }) => (
  <Modal show={show} onHide={onHide}>
    <Modal.Header closeButton>
      <Modal.Title>Money Transfer</Modal.Title>
    </Modal.Header>
    <Form onSubmit={onSubmit}>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Amount</Form.Label>
          <Form.Control 
            type="number" 
            value={data.amount}
            onChange={(e) => onChange({...data, amount: e.target.value})}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Note</Form.Label>
          <Form.Control 
            as="textarea"
            rows={3}
            value={data.note}
            onChange={(e) => onChange({...data, note: e.target.value})}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" type="submit">Transfer</Button>
      </Modal.Footer>
    </Form>
  </Modal>
);

const AddCardModal = ({ show, onHide, onSubmit, data, onChange }) => (
  <Modal show={show} onHide={onHide}>
    <Modal.Header closeButton>
      <Modal.Title>Add New Card</Modal.Title>
    </Modal.Header>
    <Form onSubmit={onSubmit}>
      <Modal.Body>
        <Form.Group className="mb-3">
          <Form.Label>Cardholder Name</Form.Label>
          <Form.Control 
            value={data.name}
            onChange={(e) => onChange({...data, name: e.target.value})}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Card Number</Form.Label>
          <Form.Control 
            value={data.number}
            onChange={(e) => onChange({...data, number: e.target.value})}
            required
          />
        </Form.Group>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Expiry Date</Form.Label>
              <Form.Control 
                placeholder="MM/YY"
                value={data.expiry}
                onChange={(e) => onChange({...data, expiry: e.target.value})}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>CVV</Form.Label>
              <Form.Control 
                value={data.cvv}
                onChange={(e) => onChange({...data, cvv: e.target.value})}
                required
              />
            </Form.Group>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cancel</Button>
        <Button variant="primary" type="submit">Add Card</Button>
      </Modal.Footer>
    </Form>
  </Modal>
);

export default VolixBankDashboard;