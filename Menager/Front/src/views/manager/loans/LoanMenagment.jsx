import React, { useState } from 'react';
import { Card, Col, Table, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import avatar1 from '../../../assets/images/user/avatar-1.jpg';
import avatar2 from '../../../assets/images/user/avatar-2.jpg';
import avatar3 from '../../../assets/images/user/avatar-3.jpg';
import { FaCheckCircle } from 'react-icons/fa';
import { getPendingLoans, approveLoan, rejectLoan } from '../../../api/loanApi';
import { useEffect } from 'react';

const LoanApprovalTables = () => {
  const [sortKey, setSortKey] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const [loanApplications, setLoanApplications] = useState([]);
  const [approvedLoans, setApprovedLoans] = useState([]);

  useEffect(() => {
  const fetchLoans = async () => {
    try {
      const data = await getPendingLoans();
      setLoanApplications(data);
    } catch (err) {
      console.error("Failed to load pending loans:", err);
    }
  };

  fetchLoans();
  }, []);
   

  const handleDecision = async (idx, decision) => {
  const loan = loanApplications[idx];

  try {
    if (decision === 'Approved') {
      await approveLoan(loan.loanId);
    } else {
      await rejectLoan(loan.loanId);
    }

    const updatedApplications = [...loanApplications];
    updatedApplications.splice(idx, 1);
    setLoanApplications(updatedApplications);

    if (decision === 'Approved') {
      const approvedEntry = {
        ...loan,
        officer: 'Auto Officer',
        income: Math.floor(Math.random() * 40000 + 30000),
        creditScore: Math.floor(Math.random() * 100 + 650),
      };
      setApprovedLoans(prev => [...prev, approvedEntry]);
    }

  } catch (error) {
    console.error("Error processing loan:", error);
  }
};


  const parseDate = (str) => {
    const [day, month, time] = str.split(' ');
    const months = {
      JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5,
      JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11
    };
    const [hour, minute] = time.split(':');
    return new Date(2024, months[month], parseInt(day), hour, minute);
  };

  const sortedLoans = [...approvedLoans].sort((a, b) => {
    let aVal = a[sortKey];
    let bVal = b[sortKey];

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
                    <img className="rounded-circle" style={{ width: '40px' }} src={applicant.avatar} alt="applicant" />
                    {' '}{applicant.name}
                  </td>
                  <td>{applicant.loanType}</td>
                  <td>${applicant.amount.toLocaleString()}</td>
                  <td>{applicant.term}</td>
                  <td>
                    <span className={`badge badge-${applicant.status === 'Approved' ? 'success' : applicant.status === 'Rejected' ? 'danger' : 'warning'}`}>
                      {applicant.status}
                    </span>
                  </td>
                  <td>{applicant.date}</td>
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
                  <option value="amount">Amount</option>
                  <option value="creditScore">Credit Score</option>
                  <option value="date">Approved Date</option>
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
                <th>Officer</th>
                <th>Income</th>
                <th>Credit Score</th>
              </tr>
            </thead>
            <tbody>
              {sortedLoans.map((loan, idx) => (
                <tr className="unread" key={idx}>
                  <td>
                    <img className="rounded-circle" style={{ width: '40px' }} src={loan.avatar} alt="loan-user" />
                    {' '}{loan.name}
                  </td>
                  <td>{loan.loanType}</td>
                  <td>${loan.amount.toLocaleString()}</td>
                  <td>{loan.term}</td>
                  <td>
                    <FaCheckCircle className="text-success" /> <span className="text-success">Approved</span>
                  </td>
                  <td>{loan.date}</td>
                  <td>{loan.officer}</td>
                  <td>${loan.income.toLocaleString()}</td>
                  <td>{loan.creditScore}</td>
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
