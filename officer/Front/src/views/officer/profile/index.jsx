import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';

const Profile = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    idCardNumber: '',
    address: '',
    email: '',
    phoneNumber: '',
    password: '',
    profileImage: null,
  });

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    axios.get(`http://localhost:5231/api/user/take/${userId}`)
      .then(res => {
        const data = res.data;
        setFormData({
          fullName: data.name,
          dateOfBirth: data.dateOfBirth,
          idCardNumber: data.personalID,
          address: data.address,
          email: data.email,
          phoneNumber: data.phone,
          password: data.password,
          profileImage: null,
        });
      })
      .catch(err => console.error("Gabim gjatë marrjes së të dhënave:", err));
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedUser = {
      id: parseInt(userId),
      name: formData.fullName,
      dateOfBirth: formData.dateOfBirth,
      personalID: formData.idCardNumber,
      address: formData.address,
      email: formData.email,
      phone: formData.phoneNumber,
      password: formData.password,
      role: "user",
      balance: 0,
      city: "Prishtinë",
      createdDate: new Date().toISOString(),
    };

    axios.put(`http://localhost:5231/api/user/update/${userId}`, updatedUser)
      .then(() => alert("Profili u përditësua me sukses!"))
      .catch(err => alert("Gabim gjatë përditësimit."));
  };

  return (
    <Row className="justify-content-center">
      <Col md={6} xl={9}>
        <Card>
          <Card.Header><Card.Title as="h5">Profili i Officerit</Card.Title></Card.Header>
          <Card.Body>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Emri i Plotë</Form.Label>
                <Form.Control type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Data e Lindjes</Form.Label>
                <Form.Control type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Numri i Kartelës</Form.Label>
                <Form.Control type="text" name="idCardNumber" value={formData.idCardNumber} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Adresa</Form.Label>
                <Form.Control type="text" name="address" value={formData.address} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Telefoni</Form.Label>
                <Form.Control type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Fjalëkalimi</Form.Label>
                <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
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
