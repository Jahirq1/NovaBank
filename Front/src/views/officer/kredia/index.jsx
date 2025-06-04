import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Table } from 'react-bootstrap';
import api from '../../../server/instance';

const CreditApplicationForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    idCardNumber: '',
    address: '',
    email: '',
    phoneNumber: '',
    employmentStatus: '',
    income: '',
    creditAmount: '',
    creditPurpose: '',
    creditTerm: '',
    collateral: '',
    previousLoans: '',
    managerId: 0,
  });

  const [loans, setLoans] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [filterStatus, setFilterStatus] = useState('Pranuar'); 

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await api.get('/auth/me');
        setFormData(prev => ({
          ...prev,
          managerId: response.data.id,
        }));
      } catch (err) {
        console.error('Gabim gjatë marrjes së përdoruesit:', err);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    fetchAllLoans();
  }, []);

  const fetchAllLoans = async () => {
    try {
      const [pendingRes, approvedRes, rejectedRes] = await Promise.all([
        api.get('/officer/loans/pending'),
        api.get('/officer/loans/approved'),
        api.get('/officer/loans/rejected'),
      ]);
      const combinedLoans = [
        ...pendingRes.data.map(l => ({ ...l, status: 'Në pritje' })),
        ...approvedRes.data.map(l => ({ ...l, status: 'Pranuar' })),
        ...rejectedRes.data.map(l => ({ ...l, status: 'Refuzuar' })),
      ];
      setLoans(combinedLoans);
    } catch (err) {
      console.error('Gabim në marrjen e kredive:', err);
      setError('Gabim në marrjen e kredive.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleViewLoanPdf = async (loanId) => {
    try {
      const response = await api.get(`/officer/loans/pdf/${loanId}`, {
        responseType: 'blob',
      });
      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL);
    } catch (error) {
      console.error('Gabim në marrjen e PDF:', error);
      alert('Nuk u mund të hapet PDF i kredisë.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const loanDto = {
      PersonalID: formData.idCardNumber,
      ApplicationDate: new Date().toISOString(),
      WorkingStatus: formData.employmentStatus,
      MonthlyIncome: parseFloat(formData.income),
      LoanAmount: parseFloat(formData.creditAmount),
      Reason: formData.creditPurpose,
      DurationMonths: parseInt(formData.creditTerm, 10),
      Collateral: formData.collateral,
      ManagerId: formData.managerId,
    };

    try {
      await api.post('/officer/loans/create', loanDto);
      setSuccessMessage('Aplikimi u krye me sukses!');
      fetchAllLoans();
      setFormData(prev => ({
        ...prev,
        idCardNumber: '',
        employmentStatus: '',
        income: '',
        creditAmount: '',
        creditPurpose: '',
        creditTerm: '',
        collateral: '',
      }));
    } catch (err) {
      if (err.response?.data) {
        const message = typeof err.response.data === 'string'
          ? err.response.data
          : err.response.data.message || 'Gabim në aplikim';
        setError(message);
      } else {
        setError('Gabim në aplikim');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pranuar':
        return 'green';
      case 'Refuzuar':
        return 'red';
      case 'Në pritje':
      default:
        return 'orange';
    }
  };

  return (
    <Row>
      <Col md={12}>
        <Card className="mb-4">
          <Card.Header>
            <Card.Title>Kreditë e mia</Card.Title>
          </Card.Header>
          <Card.Body>
            <div className="mb-3 d-flex gap-3">
              <Button 
                variant={filterStatus === 'Pranuar' ? 'primary' : 'outline-primary'} 
                onClick={() => setFilterStatus('Pranuar')}
              >
                Kredite të Aprovura
              </Button>
              <Button 
                variant={filterStatus === 'Në pritje' ? 'primary' : 'outline-primary'} 
                onClick={() => setFilterStatus('Në pritje')}
              >
                Kredite në Pritje
              </Button>
              <Button 
                variant={filterStatus === 'Refuzuar' ? 'primary' : 'outline-primary'} 
                onClick={() => setFilterStatus('Refuzuar')}
              >
                Kredite të Refuzuara
              </Button>
            </div>

            {loans.filter(loan => loan.status === filterStatus).length === 0 ? (
              <div className="text-center">Nuk ka kredi me statusin "{filterStatus}".</div>
            ) : (
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>ID e Kredisë</th>
                    <th>Personal ID</th>
                    <th>Statusi</th>
                    <th>Shiko</th>
                  </tr>
                </thead>
                <tbody>
                  {loans
                    .filter(loan => loan.status === filterStatus)
                    .map(loan => (
                      <tr key={loan.loanId}>
                        <td>{loan.loanId}</td>
                        <td>{loan.personalID}</td>
                        <td style={{ color: getStatusColor(loan.status) }}>{loan.status}</td>
                        <td>
                          <Button
                            variant="info"
                            size="sm"
                            onClick={() => handleViewLoanPdf(loan.loanId)}
                          >
                            Shiko Kredinë
                          </Button>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </Table>
            )}
          </Card.Body>
        </Card>
      </Col>

      <Col md={12}>
        <Card>
          <Card.Header>
            <Card.Title>Aplikim për Kreditë</Card.Title>
          </Card.Header>
          <Card.Body>
            {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
            {successMessage && <div style={{ color: 'green', marginBottom: 10 }}>{successMessage}</div>}
            <Form onSubmit={handleSubmit}>

              <Form.Group className="mb-3" controlId="formIdCardNumber">
                <Form.Label>Numri i ID Kartelës (PersonalID)</Form.Label>
                <Form.Control
                  type="text"
                  name="idCardNumber"
                  value={formData.idCardNumber}
                  onChange={handleChange}
                  placeholder="Sheno numrin e ID kartelës"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formEmploymentStatus">
                <Form.Label>Statusi i Punës</Form.Label>
                <Form.Select
                  name="employmentStatus"
                  value={formData.employmentStatus}
                  onChange={handleChange}
                  required
                >
                  <option value="">Zgjidhni statusin</option>
                  <option value="employed">I punësuar</option>
                  <option value="selfEmployed">I vetëpunësuar</option>
                  <option value="unemployed">I papunë</option>
                  <option value="student">Student</option>
                  <option value="retired">Pensionist</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formIncome">
                <Form.Label>Të ardhurat mujore</Form.Label>
                <Form.Control
                  type="number"
                  name="income"
                  value={formData.income}
                  onChange={handleChange}
                  placeholder="Sheno të ardhurat tuaja mujore"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formCreditAmount">
                <Form.Label>Shuma e Kredisë</Form.Label>
                <Form.Control
                  type="number"
                  name="creditAmount"
                  value={formData.creditAmount}
                  onChange={handleChange}
                  placeholder="Sheno shumën që dëshironi të merrni"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formCreditPurpose">
                <Form.Label>Qëllimi i Kredisë</Form.Label>
                <Form.Control
                  type="text"
                  name="creditPurpose"
                  value={formData.creditPurpose}
                  onChange={handleChange}
                  placeholder="Sheno qëllimin e kredisë"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formCreditTerm">
                <Form.Label>Kohëzgjatja e Kredisë (në muaj)</Form.Label>
                <Form.Control
                  type="number"
                  name="creditTerm"
                  value={formData.creditTerm}
                  onChange={handleChange}
                  placeholder="Sheno kohëzgjatjen e kredisë"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formCollateral">
                <Form.Label>Kolateral (Nëse ka)</Form.Label>
                <Form.Control
                  type="text"
                  name="collateral"
                  value={formData.collateral}
                  onChange={handleChange}
                  placeholder="Përshkruani kolateralin"
                />
              </Form.Group>

              <Button type="submit" variant="primary">
                Apliko për kredi
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default CreditApplicationForm;
