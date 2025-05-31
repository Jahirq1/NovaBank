import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Table, Modal } from 'react-bootstrap';
import Cookies from 'js-cookie';
import api from '../../../server/instance'; // importoj api nga axiosInstance.js

const RegisterForm = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);

  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    id: '',
    personalID: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    dateOfBirth: '',
    role: '',
    password: '',
    confirmPassword: '',
  });

  const [formData, setFormData] = useState({
    personalID: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    role: 'user',
    phone: '',
    address: '',
    city: '',
  });

  // Merr përdoruesit sipas kërkimit
  useEffect(() => {
    const fetchUsers = async () => {
      if (!searchTerm.trim()) {
        setUsers([]);
        return;
      }

      try {
        const response = await api.get('/officer/search/look', {
          params: { searchTerm }
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Gabim gjatë kërkimit:', error.response?.data || error.message);
        setUsers([]);
      }
    };

    fetchUsers();
  }, [searchTerm]);

  // Fshij përdoruesin
  const handleDelete = async (id) => {
    if (window.confirm('A je i sigurt që dëshiron të fshish këtë përdorues?')) {
      try {
        await api.delete(`/officer/search/${id}`);
        alert('Përdoruesi u fshi me sukses.');
        setUsers(users.filter(user => user.id !== id));
      } catch (error) {
        console.error('Gabim gjatë fshirjes:', error.response?.data || error.message);
        alert('Fshirja dështoi.');
      }
    }
  };

  // Hap modalin e editimit me të dhënat e përdoruesit
  const handleEdit = (user) => {
    setEditingUser(user);
    setEditFormData({
      id: user.id,
      personalID: user.personalID,
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
      role: user.role || '',
      password: '',
      confirmPassword: '',
    });
  };

  // Ndryshimi i të dhënave në modalin e editimit
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit përditësimi i përdoruesit
  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (editFormData.password !== editFormData.confirmPassword) {
      alert('Fjalëkalimet nuk përputhen!');
      return;
    }

    const updatePayload = {
      id: editFormData.id,
      personalID: editFormData.personalID,
      name: editFormData.name,
      email: editFormData.email,
      phone: editFormData.phone,
      address: editFormData.address,
      city: editFormData.city,
      dateOfBirth: editFormData.dateOfBirth,
      role: editFormData.role,
      password: editFormData.password || undefined,
    };

    // Nëse fjalëkalimi është bosh, heqim fushën nga payload
    if (!updatePayload.password) delete updatePayload.password;

    try {
      await api.put(`/officer/search/update/${editFormData.id}`, updatePayload);
      alert('Përdoruesi u përditësua me sukses.');
      setUsers(users.map(u => (u.id === editFormData.id ? { ...u, ...updatePayload } : u)));
      setEditingUser(null);
    } catch (error) {
      console.error('Gabim gjatë përditësimit:', error.response?.data || error.message);
      alert('Gabim gjatë përditësimit të përdoruesit.');
    }
  };

  const handleCloseEdit = () => setEditingUser(null);

  // Ndryshimi i të dhënave në formën e regjistrimit
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit krijimi i përdoruesit të ri
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Fjalëkalimet nuk përputhen!');
      return;
    }

    const userToSend = {
      PersonalID: parseInt(formData.personalID, 10),
      name: formData.name,
      email: formData.email,
      password: formData.password,
      dateOfBirth: formData.dateOfBirth,
      role: formData.role,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      Balance: 0,
      SentTransactions: [],
      ReceivedTransactions: [],
      KlientLoans: []
    };

    try {
      await api.post('/officer/user/create', userToSend, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      alert('U krijua me sukses përdoruesi');
      setFormData({
        personalID: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        dateOfBirth: '',
        role: 'user',
        phone: '',
        address: '',
        city: '',
      });
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert('Ka ndodhur një gabim gjatë krijimit.');
    }
  };

  return (
    <>
      {/* Kërkimi */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Kërko sipas emrit ose emailit"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
      </Row>

      {/* Tabela me përdoruesit */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>PersonalID</th>
            <th>Emri</th>
            <th>Email</th>
            <th>Data e Lindjes</th>
            <th>Telefon</th>
            <th>Adresa</th>
            <th>Qyteti</th>
            <th>Data e Krijimit</th>
            <th>Veprime</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="9" className="text-center">Nuk u gjet asnjë përdorues</td>
            </tr>
          ) : (
            users.map(user => (
              <tr key={user.id}>
                <td>{user.personalID}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : '—'}</td>
                <td>{user.phone}</td>
                <td>{user.address}</td>
                <td>{user.city}</td>
                <td>{user.createdDate ? new Date(user.createdDate).toLocaleDateString() : '—'}</td>
                <td>
                  <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(user)}>Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(user.id)}>Delete</Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Modal për editim */}
      <Modal show={editingUser !== null} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Edito Përdoruesin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3" controlId="editName">
              <Form.Label>Emri</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={editFormData.name}
                onChange={handleEditChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={editFormData.email}
                onChange={handleEditChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editPhone">
              <Form.Label>Telefon</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={editFormData.phone}
                onChange={handleEditChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editAddress">
              <Form.Label>Adresa</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={editFormData.address}
                onChange={handleEditChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editCity">
              <Form.Label>Qyteti</Form.Label>
              <Form.Control
                type="text"
                name="city"
                value={editFormData.city}
                onChange={handleEditChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editDateOfBirth">
              <Form.Label>Data e Lindjes</Form.Label>
              <Form.Control
                type="date"
                name="dateOfBirth"
                value={editFormData.dateOfBirth}
                onChange={handleEditChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editRole">
              <Form.Label>Roli</Form.Label>
              <Form.Control
                type="text"
                name="role"
                value={editFormData.role}
                onChange={handleEditChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editPassword">
              <Form.Label>Fjalëkalimi i Ri (nëse do me e ndërru)</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={editFormData.password}
                onChange={handleEditChange}
                placeholder="Lëre bosh nëse nuk do e ndryshosh"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="editConfirmPassword">
              <Form.Label>Konfirmo Fjalëkalimin</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={editFormData.confirmPassword}
                onChange={handleEditChange}
                placeholder="Lëre bosh nëse nuk do e ndryshosh"
              />
            </Form.Group>

            <Button variant="primary" type="submit">Ruaj Ndryshimet</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Form për regjistrim */}
      <Card className="mt-4">
        <Card.Body>
          <Card.Title>Krijo Përdorues të Ri</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formPersonalID">
              <Form.Label>PersonalID</Form.Label>
              <Form.Control
                type="number"
                name="personalID"
                value={formData.personalID}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Emri</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Fjalëkalimi</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formConfirmPassword">
              <Form.Label>Konfirmo Fjalëkalimin</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
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

            <Form.Group className="mb-3" controlId="formRole">
              <Form.Label>Roli</Form.Label>
              <Form.Control
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPhone">
              <Form.Label>Telefon</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formAddress">
              <Form.Label>Adresa</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formCity">
              <Form.Label>Qyteti</Form.Label>
              <Form.Control
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">Krijo Përdorues</Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};

export default RegisterForm;
