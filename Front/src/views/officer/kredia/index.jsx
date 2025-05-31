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
    managerId: 0, // vendoset nga backend
  });

  const [loans, setLoans] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Merr managerId nga backend në ngarkim të komponentit
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

  // Merr listën e kredive në ngarkim dhe pas aplikimit
  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await api.get('/officer/loans/status');
      setLoans(response.data);
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
    if (!loanId) {
      alert('LoanId është i pa definuar!');
      return;
    }
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
      fetchLoans();
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

  return (
    <Row>
      <Col md={12}>
        <Card className="mb-4">
          <Card.Header>
            <Card.Title>Kredia të Lëshuara (Statusi)</Card.Title>
          </Card.Header>
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>ID e kredisë</th>
                  <th>Personal ID</th>
                  <th>Shiko</th>
                  <th>Statusi</th>
                </tr>
              </thead>
              <tbody>
                {loans.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">Nuk ka kredi</td>
                  </tr>
                ) : (
                  loans.map(loan => (
                    <tr key={loan.loanId}>
                      <td>{loan.loanId}</td>
                      <td>{loan.personalID}</td>
                      <td>
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => handleViewLoanPdf(loan.loanId)}
                        >
                          Shiko Kredinë
                        </Button>
                      </td>
                      <td style={{ color: loan.approveStatus ? 'green' : 'orange' }}>
                        {loan.approveStatus ? 'Pranuar' : 'Në pritje'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
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
                  placeholder="Sheno pasuritë që mund të ofroni si garanci"
                />
              </Form.Group>

              <Button type="submit" variant="primary">
                Dërgo Aplikimin
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default CreditApplicationForm;
