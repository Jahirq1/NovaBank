import React, { useState, useEffect } from 'react';
import {
  Card,
  Col,
  Table,
  Form,
  Row,
  Button,
  InputGroup
} from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa';
import api from '../../../api/apiClient';
import {
  getPendingLoans,
  getApprovedLoans,
  approveLoan,
  rejectLoan
} from '../../../api/loanApi';
import avatar1 from '../../../assets/images/user/avatar-1.jpg';

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
        getApprovedLoans()
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
      setLoanApplications((apps) => apps.filter((_, i) => i !== idx));
      if (decision === 'Approved') {
        setApprovedLoans(await getApprovedLoans());
      }
    } catch (error) {
      console.error('Error processing loan:', error);
    }
  };

  const handleViewPdf = async (loanId) => {
    try {
      const res = await api.get(
        `/manager/loans/pdf/${loanId}`,
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

  // client-side sorting & filtering
  const sortedApproved = [...approvedLoans]
    .filter((l) => l.name.toLowerCase().includes(search))
    .sort((a, b) => {
      let va = a[sortKey],
        vb = b[sortKey];
      if (sortKey === 'applicationDate') {
        va = new Date(va);
        vb = new Date(vb);
      }
      if (typeof va === 'string') {
        va = va.toLowerCase();
        vb = vb.toLowerCase();
      }
      return va < vb
        ? sortOrder === 'asc'
          ? -1
          : 1
        : va > vb
        ? sortOrder === 'asc'
          ? 1
          : -1
        : 0;
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
                  <td>
                    <span className="badge badge-warning">Pending</span>
                  </td>
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
            <InputGroup className="mb-0">
              <Form.Control
                placeholder="Filter by name…"
                value={search}
                onChange={(e) => setSearch(e.target.value.toLowerCase())}
              />
            </InputGroup>
          </Row>
        </Card.Header>
        <Card.Body className="px-0 py-2">
          <Table responsive hover>
            <thead>
              <tr>
                <th onClick={() => setSortKey('name')}>Name</th>
                <th onClick={() => setSortKey('loanAmount')}>Amount</th>
                <th onClick={() => setSortKey('durationMonths')}>Term</th>
                <th onClick={() => setSortKey('applicationDate')}>Date</th>
                <th>Status</th>
                <th>PDF</th>
              </tr>
            </thead>
            <tbody>
              {sortedApproved.map((app) => (
                <tr key={app.loanId}>
                  <td>{app.name}</td>
                  <td>${app.loanAmount.toLocaleString()}</td>
                  <td>{app.durationMonths} months</td>
                  <td>
                    {new Date(app.applicationDate).toLocaleDateString()}
                  </td>
                  <td>
                    <span className="badge badge-success">
                      Approved
                    </span>
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
    </Col>
  );
};

export default LoanApprovalTables;
