import React, { useState } from 'react';
import { Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Settings = () => {
  const [formData, setFormData] = useState({
    notification: true,
    language: 'English',
    darkMode: false,
    accountDeactivated: false,
    emailVerified: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mund të dërgoni të dhënat në server për të ruajtur ndryshimet
    console.log('Settings updated:', formData);
  };

  return (
    <React.Fragment>
      <Row className="justify-content-center">
        <Col md={6} xl={9}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Settings</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                {/* Preferences */}
                <h5>Preferencat</h5>

                {/* Language Settings */}
                <Form.Group className="mb-3" controlId="formLanguage">
                  <Form.Label>Gjuha</Form.Label>
                  <Form.Control
                    as="select"
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                  >
                    <option>English</option>
                    <option>Shqip</option>
                    <option>Français</option>
                    <option>Español</option>
                  </Form.Control>
                </Form.Group>

                {/* Notification Settings */}
                <Form.Group className="mb-3" controlId="formNotification">
                  <Form.Check
                    type="checkbox"
                    label="Merr Njoftime"
                    name="notification"
                    checked={formData.notification}
                    onChange={handleChange}
                  />
                </Form.Group>

                {/* Dark Mode */}
                <Form.Group className="mb-3" controlId="formDarkMode">
                  <Form.Check
                    type="checkbox"
                    label="Aktivizo Temën e Errët"
                    name="darkMode"
                    checked={formData.darkMode}
                    onChange={handleChange}
                  />
                </Form.Group>

                {/* Account Deactivation */}
                <Form.Group className="mb-3" controlId="formAccountDeactivated">
                  <Form.Check
                    type="checkbox"
                    label="Çaktivizo llogarinë"
                    name="accountDeactivated"
                    checked={formData.accountDeactivated}
                    onChange={handleChange}
                  />
                  {formData.accountDeactivated && (
                    <p className="text-warning mt-2">
                      Ky veprim mund të përkohësojë llogarinë tuaj. Ju mund ta aktivizoni përsëri në çdo kohë.
                    </p>
                  )}
                </Form.Group>

                {/* Email Verification */}
                {formData.emailVerified ? (
                  <div className="mb-3">
                    <p>Email-i është verifikuar!</p>
                  </div>
                ) : (
                  <Form.Group className="mb-3" controlId="formEmailVerification">
                    <Button variant="warning" onClick={() => alert('Email verification sent!')}>
                      Dërgo Email Verifikimi
                    </Button>
                  </Form.Group>
                )}

                {/* Submit Button */}
                <div className="d-flex justify-content-center">
                  <Button variant="primary" type="submit" block>
                    Ruaj Ndryshimet
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default Settings;
