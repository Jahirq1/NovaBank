import React from 'react';
import { Col, Card, Row, Form, Button } from 'react-bootstrap';

const DashDefault = () => {
  const staticData = {
    receiverPersonalID: '123456789',
    amount: '100.00',
    transactionType: 'pagesë',
    transactionDate: '2025-05-24'
  };

  return (
    <Col sm={12}>
      <Card>
        <Card.Header>
          <Card.Title as="h5">Dërgo Transaksion</Card.Title>
        </Card.Header>
        <Card.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3" controlId="formReceiverPersonalID">
                  <Form.Label>Personal ID i pranuesit</Form.Label>
                  <Form.Control
                    type="number"
                    value={staticData.receiverPersonalID}
                    readOnly
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formTransactionType">
                  <Form.Label>Lloji i transaksionit</Form.Label>
                  <Form.Control
                    type="text"
                    value={staticData.transactionType}
                    readOnly
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3" controlId="formAmount">
                  <Form.Label>Shuma për të dërguar</Form.Label>
                  <Form.Control
                    type="number"
                    value={staticData.amount}
                    readOnly
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formTransactionDate">
                  <Form.Label>Data e transaksionit</Form.Label>
                  <Form.Control
                    type="date"
                    value={staticData.transactionDate}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-center">
              <Button variant="primary" disabled>
                Dërgo (jo aktive)
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default DashDefault;
