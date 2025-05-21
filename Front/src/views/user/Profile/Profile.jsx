import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, InputGroup, Image } from 'react-bootstrap';
import { FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiEdit, FiSave } from 'react-icons/fi';

const Profile = () => {
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+355 68 123 4567',
    address: 'Rr. Myslym Shyri, Tirana, Albania',
    bio: 'Financial analyst with 5 years of experience',
    password: '********'
  });

  const [editMode, setEditMode] = useState(false);
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/150');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEditMode(false);
    console.log('Profile updated:', userData);
  };

  return (
    <div className="profile-page">
      <h2 className="page-title"><FiUser /> Profili Im</h2>

      {/* Profile Header */}
      <Card className="mb-4">
        <Card.Body className="text-center">
          <div className="position-relative d-inline-block">
            <Image 
              src={profileImage} 
              roundedCircle 
              width={150}
              height={150}
              className="border border-3 border-primary"
              alt="Profile"
            />
            {editMode && (
              <div className="position-absolute bottom-0 end-0">
                <label htmlFor="profileImageUpload" className="btn btn-primary btn-sm rounded-circle">
                  <FiEdit />
                  <input 
                    type="file" 
                    id="profileImageUpload" 
                    className="d-none" 
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </label>
              </div>
            )}
          </div>
          <h3 className="mt-3">{userData.name}</h3>
          <p className="text-muted">{userData.bio}</p>
          <Button 
            variant={editMode ? 'success' : 'primary'} 
            onClick={editMode ? handleSubmit : () => setEditMode(true)}
          >
            {editMode ? <><FiSave /> Ruaj Ndryshimet</> : <><FiEdit /> Ndrysho Profilin</>}
          </Button>
        </Card.Body>
      </Card>

      {/* Personal Information */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Informacion Personal</Card.Title>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label><FiUser /> Emri i Plotë</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={userData.name}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label><FiMail /> Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label><FiPhone /> Telefoni</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={userData.phone}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label><FiMapPin /> Adresa</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={userData.address}
                    onChange={handleChange}
                    disabled={!editMode}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="bio"
                value={userData.bio}
                onChange={handleChange}
                disabled={!editMode}
              />
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>

      {/* Security Settings */}
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Siguria</Card.Title>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label><FiLock /> Fjalëkalimi Aktual</Form.Label>
              <InputGroup>
                <Form.Control
                  type="password"
                  value={userData.password}
                  disabled
                />
                {editMode && (
                  <Button variant="outline-secondary">
                    Ndrysho Fjalëkalimin
                  </Button>
                )}
              </InputGroup>
            </Form.Group>

            {editMode && (
              <>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Fjalëkalimi i Ri</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Fjalëkalimi i ri"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Konfirmo Fjalëkalimin</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Konfirmo fjalëkalimin"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </>
            )}
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Profile;