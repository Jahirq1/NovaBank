import React, { useState, useEffect } from 'react'; 
import {
  Card,
  Col,
  Table,
  Form,
  Row,
  Button,
  InputGroup,
  Tabs,
  Tab,
  Modal,
} from 'react-bootstrap';
import api from '../../../server/instance';
import {
  getPendingLoans,
  getApprovedLoans,
  getRejectedLoans,
  approveLoan,
} from '../../../api/loanApi';
import avatar1 from '../../../assets/images/user/avatar-1.jpg';

const LoanApprovalTables = () => {
  const [loanApplications, setLoanApplications] = useState([]);
  const [approvedLoans, setApprovedLoans] = useState([]);
  const [rejectedLoans, setRejectedLoans] = useState([]);

  const [searchPending, setSearchPending] = useState('');
  const [searchApproved, setSearchApproved] = useState('');
  const [searchRejected, setSearchRejected] = useState('');

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const [pending, approved, rejected] = await Promise.all([
        getPendingLoans(),
        getApprovedLoans(),
        getRejectedLoans(),
      ]);
      setLoanApplications(pending);
      setApprovedLoans(approved);
      setRejectedLoans(rejected);
    } catch (err) {
      console.error('Failed to load loans:', err);
    }
  };

  const handleApprove = async (loanId) => {
    try {
      await approveLoan(loanId);
      fetchLoans();
    } catch (error) {
      console.error('Error approving loan:', error);
    }
  };

  const openRejectModal = (loanId) => {
    setSelectedLoanId(loanId);
    setRejectionReason('');
    setShowRejectModal(true);
  };

  const submitRejection = async () => {
    if (!rejectionReason.trim()) {
      alert('Ju lutem jepni një arsye për refuzimin.');
      return;
    }

    try {
      await api.put(`/manager/loans/${selectedLoanId}/reject`, {
        reason: rejectionReason,
      });
      setShowRejectModal(false);
      fetchLoans();
    } catch (err) {
      console.error('Gabim gjatë refuzimit të kredisë:', err);
      alert('Refuzimi i kredisë dështoi.');
    }
  };

  const handleViewPdf = async (loanId) => {
    try {
      const res = await api.get(`/manager/loans/pdf/${loanId}`, {
        responseType: 'blob',
      });
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      window.open(url, '_blank');
    } catch (err) {
      console.error('Error loading PDF:', err);
      alert('Nuk mund të hapet PDF i kredisë.');
    }
  };

  const renderLoanTable = (loans, isPending = false) => (
    <Table responsive hover>
      <thead>
        <tr>
          <th>Emri</th>
          <th>Arsyeja</th>
          <th>Shuma</th>
          <th>Kohëzgjatja</th>
          <th>Statusi</th>
          <th>Data</th>
          {isPending && <th>Vendim</th>}
          <th>PDF</th>
        </tr>
      </thead>
      <tbody>
        {loans.map((app) => (
          <tr key={app.loanId}>
            <td className="d-flex align-items-center">
              <img
                src={app.avatar || avatar1}
                alt="avatar"
                className="rounded-circle"
                style={{ width: '40px', height: '40px', marginRight: '10px', objectFit: 'cover' }}
              />
              {app.name}
            </td>
            <td>{app.reason}</td>
            <td>{app.loanAmount.toLocaleString('sq-AL', { style: 'currency', currency: 'EUR' })}</td>
            <td>{app.durationMonths} muaj</td>
            <td>
              <span
                className={`badge ${
                  app.status === 'Approved'
                    ? 'bg-success'
                    : app.status === 'Rejected'
                    ? 'bg-danger'
                    : 'bg-warning text-dark'
                }`}
              >
                {app.status === 'Approved'
                  ? 'Pranuar'
                  : app.status === 'Rejected'
                  ? 'Refuzuar'
                  : 'Në pritje'}
              </span>
            </td>
            <td>{new Date(app.applicationDate).toLocaleDateString('sq-AL')}</td>
            {isPending && (
              <td>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => openRejectModal(app.loanId)}
                  className="me-2"
                >
                  Refuzo
                </Button>
                <Button size="sm" variant="success" onClick={() => handleApprove(app.loanId)}>
                  Prano
                </Button>
              </td>
            )}
            <td>
              <Button size="sm" variant="info" onClick={() => handleViewPdf(app.loanId)}>
                Shiko PDF
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const filteredPending = loanApplications.filter((loan) =>
    loan.name.toLowerCase().includes(searchPending.toLowerCase())
  );
  const filteredApproved = approvedLoans.filter((loan) =>
    loan.name.toLowerCase().includes(searchApproved.toLowerCase())
  );
  const filteredRejected = rejectedLoans.filter((loan) =>
    loan.name.toLowerCase().includes(searchRejected.toLowerCase())
  );

  return (
    <Col md={12} xl={12}>
      <Tabs defaultActiveKey="pending" id="loan-tabs" className="mb-3" mountOnEnter unmountOnExit>
        <Tab eventKey="pending" title="Në Pritje">
          <Card>
            <Card.Header>
              <Row className="align-items-center">
                <Col md={6}>
                  <Card.Title>Aplikimet e Kredive</Card.Title>
                </Col>
                <Col md={6}>
                  <InputGroup>
                    <Form.Control
                      placeholder="Filtro sipas emrit…"
                      value={searchPending}
                      onChange={(e) => setSearchPending(e.target.value)}
                      aria-label="Filter pending loans by name"
                    />
                  </InputGroup>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>{renderLoanTable(filteredPending, true)}</Card.Body>
          </Card>
        </Tab>
        

        <Tab eventKey="approved" title="Të Aprovuarat">
          <Card>
            <Card.Header>
              <Row className="align-items-center">
                <Col md={6}>
                  <Card.Title>Kreditë e Pranuara</Card.Title>
                </Col>
                <Col md={6}>
                  <InputGroup>
                    <Form.Control
                      placeholder="Filtro sipas emrit…"
                      value={searchApproved}
                      onChange={(e) => setSearchApproved(e.target.value)}
                      aria-label="Filter approved loans by name"
                    />
                  </InputGroup>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>{renderLoanTable(filteredApproved)}</Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="rejected" title="Të Refuzuara">
          <Card>
            <Card.Header>
              <Row className="align-items-center">
                <Col md={6}>
                  <Card.Title>Kreditë e Refuzuara</Card.Title>
                </Col>
                <Col md={6}>
                  <InputGroup>
                    <Form.Control
                      placeholder="Filtro sipas emrit…"
                      value={searchRejected}
                      onChange={(e) => setSearchRejected(e.target.value)}
                      aria-label="Filter rejected loans by name"
                    />
                  </InputGroup>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>{renderLoanTable(filteredRejected)}</Card.Body>
          </Card>
        </Tab>
      </Tabs>

      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Arsyeja e Refuzimit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Shkruaj arsyen pse po refuzohet kredia:</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="P.sh. të ardhura të pamjaftueshme..."
              autoFocus
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
            Anulo
          </Button>
          <Button variant="danger" onClick={submitRejection}>
            Refuzo Kredinë
          </Button>
        </Modal.Footer>
      </Modal>
    </Col>
  );
};

export default LoanApprovalTables;
