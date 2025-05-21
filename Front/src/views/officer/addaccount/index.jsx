import React, { useState } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    idCardNumber: '',
    address: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mund të dërgoni të dhënat në server për regjistrim
    console.log('Form submitted:', formData);
  };

  return (
    <React.Fragment>
      <Row className="justify-content-center">
        <Col md={6} xl={9}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Regjistrohu për Llogarinë Bankare</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                {/* Personal Information */}
                <h5>Informacioni Personal</h5>
                <Form.Group className="mb-3" controlId="formFullName">
                  <Form.Label>Emri i Plotë</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Sheno emrin e plotë"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formDateOfBirth">
                  <Form.Label>Data e Lindjes</Form.Label>
                  <Form.Control
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formIdCardNumber">
                  <Form.Label>Numri i Kartelës së Identitetit</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Sheno numrin e kartelës"
                    name="idCardNumber"
                    value={formData.idCardNumber}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formAddress">
                  <Form.Label>Adresa</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Sheno adresën"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Sheno emailin"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPhoneNumber">
                  <Form.Label>Numri i Telefonit</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Sheno numrin e telefonit"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                {/* Password Information */}
                <h5>Informacioni i Fjalëkalimit</h5>
                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Fjalëkalimi</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Sheno fjalëkalimin"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formConfirmPassword">
                  <Form.Label>Përsërit Fjalëkalimin</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Përsërit fjalëkalimin"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

        <div className="d-flex justify-content-center">
                <Button variant="primary" type="submit" block>
                  Regjistrohu
                </Button>
                </div>
              </Form>
                  <div className="d-flex justify-content-center">
                <p className="text-center">
                  Already have an account? <Link to="/login">Login here</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default RegisterForm;
