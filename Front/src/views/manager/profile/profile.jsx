import React, { useState } from 'react';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';

const Profile = () => {
  const [profile, setProfile] = useState({
    fullName: 'Klit Buçinca',
    email: 'klit@example.com',
    phone: '+383 44 123 456',
    branch: 'Prishtina Main Branch',
    employeeId: 'EMP-00123',
    position: 'Branch Manager',
    department: 'Loan & Finance',
    dateOfJoining: '2021-05-15',
    address: '123 Rr. Bill Clinton, Prishtina, Kosovo',
  });

  const [editMode, setEditMode] = useState(
    Object.fromEntries(Object.keys(profile).map((key) => [key, false]))
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEdit = (field) => {
    setEditMode((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <Row className="justify-content-center mt-4">
      <Col md={8}>
        <Card className="shadow p-4 rounded-4">
          <Card.Title className="mb-4 text-center fs-3">Manager Profile</Card.Title>
          <Form>
            {Object.entries(profile).map(([field, value]) => (
              <Form.Group as={Row} className="mb-3" key={field}>
                <Form.Label column sm={3} className="text-capitalize">
                  {field.replace(/([A-Z])/g, ' $1')}
                </Form.Label>
                <Col sm={7}>
                  <Form.Control
                    type={field === 'dateOfJoining' ? 'date' : 'text'}
                    name={field}
                    value={value}
                    onChange={handleChange}
                    readOnly={!editMode[field]}
                    className={editMode[field] ? '' : 'bg-light'}
                  />
                </Col>
                <Col sm={2}>
                  <Button
                    variant={editMode[field] ? 'success' : 'secondary'}
                    onClick={() => toggleEdit(field)}
                    size="sm"
                  >
                    {editMode[field] ? 'Save' : 'Edit'}
                  </Button>
                </Col>
              </Form.Group>
            ))}
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default Profile;
