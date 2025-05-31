import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Table, Modal } from 'react-bootstrap';
import axios from 'axios';

const RegisterForm = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({
    id: '',
    PersonalID: '',
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

  useEffect(() => {
    const fetchUsers = async () => {
      if (!searchTerm.trim()) {
        setUsers([]);
        return;
      }
      try {
        const response = await fetch(`http://localhost:5231/api/officer/search/look?searchTerm=${searchTerm}`);
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error('Gabim gjatë kërkimit:', error);
        setUsers([]);
      }
    };

    fetchUsers();
  }, [searchTerm]);

  const handleDelete = async (id) => {
    if (window.confirm('A je i sigurt që dëshiron të fshish këtë përdorues?')) {
      try {
        const response = await fetch(`http://localhost:5231/api/officer/search/delete/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Përdoruesi u fshi me sukses.');
          setUsers(users.filter(user => user.id !== id));
        } else {
          alert('Fshirja dështoi.');
        }
      } catch (error) {
        console.error('Gabim gjatë fshirjes:', error);
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditFormData({
      id: user.id,
      PersonalID: user.personalID,
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
      role: user.role || '',
    });
  };
  
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (editFormData.password !== editFormData.confirmPassword) {
      alert('Fjalëkalimet nuk përputhen!');
      return;
    }  
    try {
      console.log('Data to update:', editFormData);
  
      const response = await axios.put(`http://localhost:5231/api/officer/search/update/${editFormData.id}`, editFormData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 200) {
        alert('Përdoruesi u përditësua me sukses.');
        setUsers(users.map(u => (u.id === editFormData.id ? { ...u, ...editFormData } : u)));
        setEditingUser(null);
      } else {
        alert('Gabim gjatë përditësimit të përdoruesit.');
      }
    } catch (error) {
      console.error('Gabim gjatë përditësimit:', error.response ? error.response.data : error.message);
    }
  };

  const handleCloseEdit = () => setEditingUser(null);

  // -- Ky është formData i modifikuar --
  const [formData, setFormData] = useState({
    PersonalID: '',
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password !== formData.confirmPassword) {
      alert('Fjalëkalimet nuk përputhen!');
      return;
    }
  
    const userToSend = {
      PersonalID: parseInt(formData.personalID),
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
      console.log(userToSend);
      await axios.post('http://localhost:5231/api/officer/user/create', userToSend);
      alert('u kriju me sukses useri');
    } catch (error) {
      console.error(error.response.data);
      alert('ka ndodh nje gabim');
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
                <td>{user.dateOfBirth}</td>
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
                  />
                    </Form.Group>

             <Form.Group className="mb-3" controlId="editConfirmPassword">
                       <Form.Label>Konfirmo Fjalëkalimin</Form.Label>
                              <Form.Control
                                    type="password"
                        name="confirmPassword"
                       value={editFormData.confirmPassword}
                              onChange={handleEditChange}
                  />
                                  </Form.Group>

            <Button variant="primary" type="submit">Ruaj Ndryshimet</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Forma e regjistrimit */}
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>Regjistro Përdorues</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="personalID">
              <Form.Label>Personal ID</Form.Label>
              <Form.Control
                type="number"
                name="personalID"
                value={formData.personalID}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Emri</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Fjalëkalimi</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Konfirmo Fjalëkalimin</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="dateOfBirth">
              <Form.Label>Data e Lindjes</Form.Label>
              <Form.Control
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="role">
              <Form.Label>Roli</Form.Label>
              <Form.Control
                as="select"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="user">User</option>
              </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3" controlId="phone">
              <Form.Label>Telefon</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="address">
              <Form.Label>Adresa</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="city">
              <Form.Label>Qyteti</Form.Label>
              <Form.Control
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">Regjistro</Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );

};
export default RegisterForm;
