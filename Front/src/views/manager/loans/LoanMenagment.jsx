import React, { useState, useEffect } from 'react';
import { Card, Col, Table, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import avatar1 from '../../../assets/images/user/avatar-1.jpg';
import { FaCheckCircle } from 'react-icons/fa';
import { getPendingLoans, getApprovedLoans, approveLoan, rejectLoan } from '../../../api/loanApi';

const LoanApprovalTables = () => {
  const [sortKey, setSortKey] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [loanApplications, setLoanApplications] = useState([]);
  const [approvedLoans, setApprovedLoans] = useState([]);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const pending = await getPendingLoans();
      const approved = await getApprovedLoans();
      setLoanApplications(pending);
      setApprovedLoans(approved);
    } catch (err) {
      console.error("Failed to load loans:", err);
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

      // Remove from pending loans
      const updatedApplications = [...loanApplications];
      updatedApplications.splice(idx, 1);
      setLoanApplications(updatedApplications);

      // Refresh approved list from backend
      if (decision === 'Approved') {
        const approved = await getApprovedLoans();
        setApprovedLoans(approved);
      }

    } catch (error) {
      console.error("Error processing loan:", error);
    }
  };

  const sortedLoans = [...approvedLoans].sort((a, b) => {
    let aVal = a[sortKey];
    let bVal = b[sortKey];

    if (sortKey === 'date' || sortKey === 'applicationDate') {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <Col md={12} xl={12}>
      <Card className="Recent-Users widget-focus-lg">
        <Card.Header>
          <Card.Title as="h5">Loan Applications</Card.Title>
        </Card.Header>
        <Card.Body className="px-0 py-2">
          <Table responsive hover className="recent-users">
            <thead>
              <tr>
                <th>Applicant Name</th>
                <th>Loan Type</th>
                <th>Amount</th>
                <th>Term</th>
                <th>Status</th>
                <th>Requested Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loanApplications.map((applicant, idx) => (
                <tr className="unread" key={idx}>
                  <td>
                    <img className="rounded-circle" style={{ width: '40px' }} src={applicant.avatar ?? avatar1} alt="applicant" />
                    {' '}{applicant.name ?? 'Client'}
                  </td>
                  <td>{applicant.reason ?? '—'}</td>
                  <td>${(applicant.loanAmount ?? 0).toLocaleString()}</td>
                  <td>{applicant.durationMonths ? `${applicant.durationMonths} months` : '—'}</td>
                  <td>
                    <span className="badge badge-warning">Pending</span>
                  </td>
                  <td>{applicant.applicationDate ? new Date(applicant.applicationDate).toLocaleDateString() : '—'}</td>
                  <td>
                    <Link to="#" onClick={() => handleDecision(idx, 'Rejected')} className="label theme-bg2 text-white f-12 mr-2">Reject</Link>
                    <Link to="#" onClick={() => handleDecision(idx, 'Approved')} className="label theme-bg text-white f-12">Approve</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Card className="Recent-Users widget-focus-lg mt-4">
        <Card.Header>
          <Card.Title as="h5">Approved Loans</Card.Title>
          <Row className="mt-3">
            <Col md={6}>
              <Form.Group controlId="sortKey">
                <Form.Label>Sort By</Form.Label>
                <Form.Control
                  as="select"
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value)}
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
          <Table responsive hover className="recent-users">
            <thead>
              <tr>
                <th>Applicant Name</th>
                <th>Loan Type</th>
                <th>Amount</th>
                <th>Term</th>
                <th>Status</th>
                <th>Approved Date</th>
              </tr>
            </thead>
            <tbody>
              {sortedLoans.map((loan, idx) => (
                <tr className="unread" key={idx}>
                  <td>
                    <img className="rounded-circle" style={{ width: '40px' }} src={loan.avatar ?? avatar1} alt="loan-user" />
                    {' '}{loan.name ?? 'Client'}
                  </td>
                  <td>{loan.reason ?? '—'}</td>
                  <td>${(loan.loanAmount ?? 0).toLocaleString()}</td>
                  <td>{loan.durationMonths ? `${loan.durationMonths} months` : '—'}</td>
                  <td>
                    <FaCheckCircle className="text-success" /> <span className="text-success">Approved</span>
                  </td>
                  <td>{loan.applicationDate ? new Date(loan.applicationDate).toLocaleDateString() : '—'}</td>
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
