import React, { useState } from 'react';
import { Row, Col, Card, Form, Button, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    dateOfBirth: '1990-01-01',
    idCardNumber: 'A123456789',
    address: '1234 Street Name, City, Country',
    email: 'johndoe@example.com',
    phoneNumber: '+1234567890',
    profileImage: null, // Vend për foton e profilit
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          profileImage: reader.result, // Ruajmë të dhënat e fotos
        });
      };
      reader.readAsDataURL(file); // Lexojmë foton dhe e konvertojmë në URL për t'u shfaqur
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mund të dërgoni të dhënat në server për të ruajtur ndryshimet
    console.log('Profile updated:', formData);
  };

  return (
    <React.Fragment>
      <Row className="justify-content-center">
        <Col md={6} xl={9}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Profili i Përdoruesit</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                {/* Fotoja e profilit */}
                <div className="d-flex justify-content-center mb-4">
                  <div className="profile-image-container">
                    <Image
                      src={formData.profileImage || 'https://via.placeholder.com/150'}
                      alt="User Profile"
                      roundedCircle
                      fluid
                      style={{ width: '150px', height: '150px' }}
                    />
                    <Form.Group className="mt-2">
                      <Form.Label htmlFor="profileImage" className="btn btn-primary">
                        Zgjidh Foto
                      </Form.Label>
                      <Form.Control
                        type="file"
                        id="profileImage"
                        name="profileImage"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                      />
                    </Form.Group>
                  </div>
                </div>

                {/* Informacionet personale */}
                <h5>Informacioni Personal</h5>
                <Form.Group className="mb-3" controlId="formFullName">
                  <Form.Label>Emri i Plotë</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Sheno emrin e plotë"
                    name="fullName"
                    value={formData.fullName}
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

                <Form.Group className="mb-3" controlId="formIdCardNumber">
                  <Form.Label>Numri i Kartelës së Identitetit</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Sheno numrin e kartelës"
                    name="idCardNumber"
                    value={formData.idCardNumber}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formAddress">
                  <Form.Label>Adresa</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Sheno adresën"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Sheno emailin"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPhoneNumber">
                  <Form.Label>Numri i Telefonit</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Sheno numrin e telefonit"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <div className="d-flex justify-content-center">
                  <Button variant="primary" type="submit" block>
                    Ruaj Ndryshimet
                  </Button>
                </div>
              </Form>
              <div className="d-flex justify-content-center mt-3">
                <p className="text-center">
                  Dëshironi të ndryshoni fjalëkalimin? <Link to="/change-password">Ndrysho fjalëkalimin</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Profile;

