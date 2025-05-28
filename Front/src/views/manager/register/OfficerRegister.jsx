import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Form, Button, Table, InputGroup } from 'react-bootstrap';
import { addOfficer, updateOfficer, deleteOfficer, getOfficers } from "../../../api/officerApi";

const OfficerRegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    dateOfBirth: ''
  });

  const [officers, setOfficers] = useState([]);
  const [editingOfficer, setEditingOfficer] = useState(null);
  const [filter, setFilter] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        const data = await getOfficers();
        setOfficers(data);
      } catch (err) {
        console.error("Failed to load officers:", err);
      }
    };
    fetchOfficers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const generatedID = Math.floor(100000000 + Math.random() * 900000000);
    const currentDateTime = new Date().toISOString();

    const officerPayload = {
      personalID: editingOfficer ? editingOfficer.personalID : generatedID,
      name: formData.name,
      email: formData.email,
      password: formData.password,
      dateOfBirth: formData.dateOfBirth,
      createdDate: currentDateTime,
      balance: 0,
      role: 'officer',
      phone: formData.phone,
      address: formData.address,
      city: 'Prishtina'
    };

    try {
      const res = editingOfficer
        ? await updateOfficer(editingOfficer.id, { ...officerPayload, id: editingOfficer.id })
        : await addOfficer(officerPayload);

      const result = await res;
      if (editingOfficer) {
        setOfficers(officers.map((o) => (o.id === result.id ? result : o)));
      } else {
        setOfficers([...officers, result]);
      }

      setFormData({ name: '', email: '', phone: '', address: '', password: '', dateOfBirth: '' });
      setEditingOfficer(null);
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Failed to register or update officer.');
    }
  };

  const handleEdit = (officer) => {
    setFormData({
      name: officer.name,
      email: officer.email,
      phone: officer.phone,
      address: officer.address,
      password: '',
      dateOfBirth: officer.dateOfBirth
    });
    setEditingOfficer(officer);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this officer?')) return;
    try {
      await deleteOfficer(id);
      setOfficers(officers.filter((off) => off.id !== id));
    } catch (err) {
      console.error('Error:', err);
      alert('❌ Failed to delete officer.');
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value.toLowerCase());
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedOfficers = officers
    .filter((officer) =>
      officer.name.toLowerCase().includes(filter)
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      const valA = a[sortField];
      const valB = b[sortField];
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <React.Fragment>
      <Row>
        <Col sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Officer Registration</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Officer's Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter Officer's Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Officer's Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Address</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Officer's Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Enter Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Date of Birth</Form.Label>
                      <Form.Control
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Button variant="primary" type="submit">
                  {editingOfficer ? 'Update Officer' : 'Register Officer'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col sm={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Registered Officers</Card.Title>
              <InputGroup className="mt-2">
                <Form.Control
                  type="text"
                  placeholder="Filter by name..."
                  onChange={handleFilterChange}
                />
              </InputGroup>
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th onClick={() => handleSort('id')}>ID</th>
                    <th onClick={() => handleSort('name')}>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th>Date of Birth</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedOfficers.map((officer, index) => (
                    <tr key={index}>
                      <td>{officer.id}</td>
                      <td>{officer.name}</td>
                      <td>{officer.email}</td>
                      <td>{officer.phone}</td>
                      <td>{officer.address}</td>
                      <td>{officer.dateOfBirth}</td>
                      <td>
                        <Button variant="warning" size="sm" onClick={() => handleEdit(officer)}>Edit</Button>{' '}
                        <Button variant="danger" size="sm" onClick={() => handleDelete(officer.id)}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default OfficerRegistrationForm;
