import React, { useState } from 'react';
import { Card, Col, Table, Button, Form, Row } from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle, FaHourglass, FaArrowUp, FaArrowDown } from 'react-icons/fa';

import avatar1 from '../../assets/images/user/avatar-1.jpg';
import avatar2 from '../../assets/images/user/avatar-2.jpg';

const getArrowIcon = (type) => {
  if (type === 'Deposit' || type === 'Transfer') {
    return <FaArrowUp className="text-success ms-1" />;
  } else if (type === 'Withdrawal') {
    return <FaArrowDown className="text-danger ms-1" />;
  }
  return null;
};

const TransactionsPage = () => {
  const [sortKey, setSortKey] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc');

  const transactions = [
    {
      id: '#12345',
      user: 'Isabella Christensen',
      avatar: avatar1,
      amount: '$500',
      status: 'Completed',
      type: 'Deposit',
      date: '11 MAY 12:56',
    },
    {
      id: '#12346',
      user: 'Mathilde Andersen',
      avatar: avatar2,
      amount: '$150',
      status: 'Pending',
      type: 'Withdrawal',
      date: '12 MAY 09:00',
    },
    {
      id: '#12347',
      user: 'Ida Jorgensen',
      avatar: avatar1,
      amount: '$300',
      status: 'Failed',
      type: 'Transfer',
      date: '14 MAY 14:30',
    },
    {
      id: '#12348',
      user: 'Karla Sorensen',
      avatar: avatar2,
      amount: '$250',
      status: 'Completed',
      type: 'Deposit',
      date: '15 MAY 11:15',
    },
    {
      id: '#12349',
      user: 'Albert Andersen',
      avatar: avatar1,
      amount: '$1000',
      status: 'Pending',
      type: 'Withdrawal',
      date: '16 MAY 13:45',
    },
  ];

  const parseDate = (str) => {
    const [day, month, time] = str.split(' ');
    const months = {
      JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
      JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11
    };
    const [hour, minute] = time.split(':');
    return new Date(2024, months[month], parseInt(day), hour, minute);
  };

  const sortedTransactions = [...transactions].sort((a, b) => {
    let aVal = a[sortKey];
    let bVal = b[sortKey];

    if (sortKey === 'amount') {
      aVal = parseInt(aVal.replace('$', '').replace(',', ''));
      bVal = parseInt(bVal.replace('$', '').replace(',', ''));
    }

    if (sortKey === 'date') {
      aVal = parseDate(aVal);
      bVal = parseDate(bVal);
    }

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <FaCheckCircle className="text-success" />;
      case 'Pending':
        return <FaHourglass className="text-warning" />;
      case 'Failed':
        return <FaTimesCircle className="text-danger" />;
      default:
        return null;
    }
  };

  const handleMoreClick = () => {
    alert('More transactions coming soon...');
  };

  return (
    <Col md={12} xl={12}>
      <Card className="Recent-Users widget-focus-lg">
        <Card.Header>
          <Card.Title as="h5">Recent Transactions</Card.Title>
          <Row className="mt-3">
            <Col md={6}>
              <Form.Group controlId="sortKey">
                <Form.Label>Sort By</Form.Label>
                <Form.Control
                  as="select"
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value)}
                >
                  <option value="id">Transaction ID</option>
                  <option value="user">User</option>
                  <option value="amount">Amount</option>
                  <option value="date">Date</option>
                </Form.Control>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="sortOrder">
                <Form.Label>Order</Form.Label>
                <Form.Control
                  as="select"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body className="px-0 py-2">
          <Table responsive hover className="recent-transactions">
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>User</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Transaction Type</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {sortedTransactions.map((tx) => (
                <tr key={tx.id} className="unread">
                  <td>{tx.id}</td>
                  <td>
                    <img className="rounded-circle me-2" style={{ width: '40px' }} src={tx.avatar} alt="user" />
                    {tx.user}
                  </td>
                  <td>
                    {tx.amount}
                    {getArrowIcon(tx.type)}
                  </td>
                  <td>
                    {getStatusIcon(tx.status)}{' '}
                    <span className={`text-${tx.status === 'Completed' ? 'success' : tx.status === 'Pending' ? 'warning' : 'danger'}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td>{tx.type}</td>
                  <td>{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
        <Card.Footer className="text-center">
          <Button variant="outline-primary" onClick={handleMoreClick}>
            More
          </Button>
        </Card.Footer>
      </Card>
    </Col>
  );
};

export default TransactionsPage;
