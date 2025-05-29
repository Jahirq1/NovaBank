// src/components/loans/LoanApprovalTables.jsx
import React, { useState, useEffect } from 'react';
import { Card, Col, Table, Form, Row, Button, InputGroup } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import avatar1 from '../../../assets/images/user/avatar-1.jpg';
import {
  getPendingLoans,
  getApprovedLoans,
  approveLoan,
  rejectLoan,
} from '../../../api/loanApi';

const LoanApprovalTables = () => {
  const [sortKey, setSortKey] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loanApplications, setLoanApplications] = useState([]);
  const [approvedLoans, setApprovedLoans] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const [pending, approved] = await Promise.all([
        getPendingLoans(),
        getApprovedLoans(),
      ]);
      setLoanApplications(pending);
      setApprovedLoans(approved);
    } catch (err) {
      console.error('Failed to load loans:', err);
    }
  };

  const handleDecision = async (idx, decision) => {
    const loan = loanApplications[idx];
    try {
      if (decision === 'Approved') {
        await approveLoan(loan.loanId);
      } else {
        await rejectLoan(loan.loanId);
      }
      // remove from pending and refresh approved if needed
      setLoanApplications((apps) =>
        apps.filter((_, i) => i !== idx)
      );
      if (decision === 'Approved') {
        setApprovedLoans(await getApprovedLoans());
      }
    } catch (error) {
      console.error('Error processing loan:', error);
    }
  };

  const handleViewPdf = async (loanId) => {
    try {
      const res = await axios.get(
       `http://localhost:5231/api/manager/loans/pdf/${loanId}`,
        { responseType: 'blob' }
      );
      const url = URL.createObjectURL(
        new Blob([res.data], { type: 'application/pdf' })
      );
      window.open(url, '_blank');
    } catch (err) {
      console.error('Error loading PDF:', err);
      alert('Could not load loan PDF.');
    }
  };

  // Sort approved loans
  const sortedApproved = [...approvedLoans].sort((a, b) => {
    let va = a[sortKey];
    let vb = b[sortKey];
    if (sortKey === 'applicationDate') {
      va = new Date(va);
      vb = new Date(vb);
    }
    if (typeof va === 'string') {
      va = va.toLowerCase();
      vb = vb.toLowerCase();
    }
    if (va < vb) return sortOrder === 'asc' ? -1 : 1;
    if (va > vb) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <Col md={12} xl={12}>
      {/* Pending Loans */}
      <Card className="mb-4">
        <Card.Header>
          <Card.Title>Loan Applications</Card.Title>
        </Card.Header>
        <Card.Body className="px-0 py-2">
          <Table responsive hover>
            <thead>
              <tr>
                <th>Applicant Name</th>
                <th>Loan Type</th>
                <th>Amount</th>
                <th>Term</th>
                <th>Status</th>
                <th>Requested Date</th>
                <th>Action</th>
                <th>PDF</th>
              </tr>
            </thead>
            <tbody>
              {loanApplications.map((app, idx) => (
                <tr key={app.loanId}>
                  <td>
                    <img
                      src={app.avatar ?? avatar1}
                      alt="applicant"
                      className="rounded-circle"
                      style={{ width: '40px' }}
                    />{' '}
                    {app.name}
                  </td>
                  <td>{app.reason}</td>
                  <td>${app.loanAmount.toLocaleString()}</td>
                  <td>{app.durationMonths} months</td>
                  <td><span className="badge badge-warning">Pending</span></td>
                  <td>{new Date(app.applicationDate).toLocaleDateString()}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDecision(idx, 'Rejected')}
                    >
                      Reject
                    </Button>{' '}
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handleDecision(idx, 'Approved')}
                    >
                      Approve
                    </Button>
                  </td>
                  <td>
                    <Button
                      size="sm"
                      variant="info"
                      onClick={() => handleViewPdf(app.loanId)}
                    >
                      View PDF
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Approved Loans */}
      <Card className="mt-4">
        <Card.Header>
          <Card.Title>Approved Loans</Card.Title>
          <Row className="mt-3">
            <Col md={6}>
              <Form.Group controlId="sortKey">
                <Form.Label>Sort By</Form.Label>
                <Form.Control
                  as="select"
                  value={sortKey}
                  onChange={(e) => {
                    setSortKey(e.target.value);
                    setSortOrder('asc');
                  }}
                >
                  <option value="name">Applicant Name</option>
                  <option value="loanAmount">Amount</option>
                  <option value="applicationDate">Approved Date</option>
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
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Filter by name…"
              value={search}
              onChange={(e) => setSearch(e.target.value.toLowerCase())}
            />
          </InputGroup>
          <Table responsive hover>
            <thead>
              <tr>
                <th onClick={() => setSortKey('name')}>Name</th>
                <th>Type</th>
                <th onClick={() => setSortKey('loanAmount')}>Amount</th>
                <th>Term</th>
                <th>Status</th>
                <th onClick={() => setSortKey('applicationDate')}>Approved Date</th>
                <th>PDF</th>
              </tr>
            </thead>
            <tbody>
              {sortedApproved
                .filter((l) =>
                  (l.name ?? '')
                    .toLowerCase()
                    .includes(search)
                )
                .map((loan) => (
                  <tr key={loan.loanId}>
                    <td>{loan.name}</td>
                    <td>{loan.reason}</td>
                    <td>${loan.loanAmount.toLocaleString()}</td>
                    <td>{loan.durationMonths} months</td>
                    <td>
                      <FaCheckCircle className="text-success" />{' '}
                      <span className="text-success">Approved</span>
                    </td>
                    <td>{new Date(loan.applicationDate).toLocaleDateString()}</td>
                    <td>
                      <Button
                        size="sm"
                        variant="info"
                        onClick={() => handleViewPdf(loan.loanId)}
                      >
                        View PDF
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default LoanApprovalTables;