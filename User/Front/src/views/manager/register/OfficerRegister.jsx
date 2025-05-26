import React, { useState } from 'react';
import { Row, Col, Card, Form, Button, Table, InputGroup } from 'react-bootstrap';

const OfficerRegistrationForm = () => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    branch: '',
    employee: '',
    username: '',
    password: '',
    startDate: '',
    status: '',
  });

  const [officers, setOfficers] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setOfficers([...officers, formData]);
    setFormData({
      id: '',
      name: '',
      email: '',
      phone: '',
      branch: '',
      employee: '',
      username: '',
      password: '',
      startDate: '',
      status: '',
    });
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
      officer.name.toLowerCase().includes(filter) ||
      officer.status.toLowerCase().includes(filter)
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
                    <Form.Group className="mb-3" controlId="formId">
                      <Form.Label>Officer ID</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Officer ID"
                        name="id"
                        value={formData.id}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formName">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Officer's Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Enter Officer's Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPhone">
                      <Form.Label>Phone</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Officer's Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBranch">
                      <Form.Label>Branch</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Officer's Branch"
                        name="branch"
                        value={formData.branch}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formEmployee">
                      <Form.Label>Employee</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Employee Number"
                        name="employee"
                        value={formData.employee}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="formUsername">
                      <Form.Label>Username</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPassword">
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Enter Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formStartDate">
                      <Form.Label>Start Date</Form.Label>
                      <Form.Control
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formStatus">
                      <Form.Label>Status</Form.Label>
                      <Form.Control
                        as="select"
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                      >
                        <option value="">Select Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Button variant="primary" type="submit">
                  Register Officer
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
                  placeholder="Filter by name or status..."
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
                    <th>Branch</th>
                    <th>Employee</th>
                    <th>Username</th>
                    <th onClick={() => handleSort('startDate')}>Start Date</th>
                    <th onClick={() => handleSort('status')}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedOfficers.map((officer, index) => (
                    <tr key={index}>
                      <td>{officer.id}</td>
                      <td>{officer.name}</td>
                      <td>{officer.email}</td>
                      <td>{officer.phone}</td>
                      <td>{officer.branch}</td>
                      <td>{officer.employee}</td>
                      <td>{officer.username}</td>
                      <td>{officer.startDate}</td>
                      <td>{officer.status}</td>
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
