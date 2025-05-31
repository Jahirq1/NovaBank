import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import api from '../../../server/instance'; // përdor api këtu

const Profile = () => {
  const [formData, setFormData] = useState({
    id: null,
    fullName: '',
    dateOfBirth: '',
    idCardNumber: '',
    address: '',
    email: '',
    phoneNumber: '',
    password: '',
  });

  useEffect(() => {
    api.get('/auth/me', { withCredentials: true })  // përdor api këtu
      .then(res => {
        const data = res.data;
        setFormData({
          id: data.id || null,
          fullName: data.name || '',
          dateOfBirth: data.dateOfBirth ? data.dateOfBirth.substring(0, 10) : '',
          idCardNumber: data.personalID ? data.personalID.toString() : '',
          address: data.address || '',
          email: data.email || '',
          phoneNumber: data.phone || '',
          password: '',
        });
      })
      .catch(err => {
        console.error("Gabim gjatë marrjes së të dhënave:", err);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedUser = {
      id: formData.id,
      name: formData.fullName,
      dateOfBirth: formData.dateOfBirth,
      personalID: parseInt(formData.idCardNumber, 10),
      address: formData.address,
      email: formData.email,
      phone: formData.phoneNumber,
      role: "officer",
      balance: 0,
      city: "Prishtinë",
      createdDate: new Date().toISOString(),
      SentTransactions: [],
      ReceivedTransactions: [],
      KlientLoans: [],
    };

    if (formData.password.trim() !== '') {
      updatedUser.password = formData.password;
    }

    console.log("Dërgohet ky objekt për update:", updatedUser);

    api.put(`/officer/user/update/${formData.id}`, updatedUser, { withCredentials: true }) // përdor api këtu
      .then(() => alert("Profili u përditësua me sukses!"))
      .catch(err => {
        console.error("Gabim gjatë përditësimit:", err);
        alert("Gabim gjatë përditësimit.");
      });
  };

  return (
    <Row className="justify-content-center">
      <Col md={6} xl={9}>
        <Card>
          <Card.Header>
            <Card.Title as="h5">Profili i Officerit</Card.Title>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Emri i Plotë</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Data e Lindjes</Form.Label>
                <Form.Control
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Numri i Kartelës</Form.Label>
                <Form.Control
                  type="text"
                  name="idCardNumber"
                  value={formData.idCardNumber}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Adresa</Form.Label>
                <Form.Control
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Telefoni</Form.Label>
                <Form.Control
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Fjalëkalimi (lëre bosh nëse nuk do ta ndryshosh)</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </Form.Group>

              <div className="d-flex justify-content-center">
                <Button type="submit" variant="primary">Ruaj Ndryshimet</Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Profile;
