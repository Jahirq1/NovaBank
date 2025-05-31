import React, { useState } from 'react'; 
import { Col, Card, Row, Form, Button } from 'react-bootstrap';
import api from '../../../server/instance';

const DashDefault = () => {
  const [formData, setFormData] = useState({
    receiverPersonalID: '',
    amount: '',
    transactionType: '',
    transactionDate: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        receiverPersonalID: parseInt(formData.receiverPersonalID, 10),
        amount: parseFloat(formData.amount),
        transactionType: formData.transactionType,
        transactionDate: new Date().toISOString()
      };

      // Nëse api nuk ka withCredentials default, e shtojmë këtu:
      await api.post('/officer/transactions/pay', payload, {
        withCredentials: true
      });

      alert('Transaksioni u dërgua me sukses!');
    } catch (error) {
      console.error(error);
      alert('Ndodhi një gabim gjatë dërgimit të transaksionit: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Col sm={12}>
      <Card>
        <Card.Header>
          <Card.Title as="h5">Dërgo Transaksion</Card.Title>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formReceiverPersonalID">
                  <Form.Label>Personal ID i pranuesit</Form.Label>
                  <Form.Control
                    type="number"
                    name="receiverPersonalID"
                    placeholder="Sheno PersonalID e pranuesit"
                    value={formData.receiverPersonalID}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formTransactionType">
                  <Form.Label>Lloji i transaksionit</Form.Label>
                  <Form.Control
                    type="text"
                    name="transactionType"
                    placeholder="P.sh. pagesë, dhuratë"
                    value={formData.transactionType}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3" controlId="formAmount">
                  <Form.Label>Shuma për të dërguar</Form.Label>
                  <Form.Control
                    type="number"
                    name="amount"
                    placeholder="Sheno shumën"
                    value={formData.amount}
                    onChange={handleChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formTransactionDate">
                  <Form.Label>Data e transaksionit</Form.Label>
                  <Form.Control
                    type="date"
                    name="transactionDate"
                    value={formData.transactionDate}
                    onChange={handleChange}
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-center">
              <Button variant="primary" type="submit">
                Dërgo
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default DashDefault;
