import React, { useEffect, useState } from 'react';
import { Card, Button, Form, Row, Col } from 'react-bootstrap';
import { getProfile, updateProfile } from "../../../api/profileApi" 

const Profile = () => {
  const userId = 1; // Me ndrru me user id actual
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile(userId);
        setProfile(data);
        setEditMode(
          Object.fromEntries(
            Object.keys(data).map((key) => [key, false])
          )
        );
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const toggleEdit = async (field) => {
    if (editMode[field]) {
      try {
        await updateProfile(userId, profile);
        console.log('Profile updated');
      } catch (err) {
        console.error('Update failed:', err);
      }
    }
    setEditMode((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  if (loading || !profile) return <p>Loading profile...</p>;

  const fieldsToShow = [
    'name',
    'email',
    'phone',
    'address',
    'city',
    'dateOfBirth'
  ];

  return (
    <Row className="justify-content-center mt-4">
      <Col md={8}>
        <Card className="shadow p-4 rounded-4">
          <Card.Title className="mb-4 text-center fs-3">Manager Profile</Card.Title>
          <Form>
            {fieldsToShow.map((field) => (
              <Form.Group as={Row} className="mb-3" key={field}>
                <Form.Label column sm={3} className="text-capitalize">
                  {field.replace(/([A-Z])/g, ' $1')}
                </Form.Label>
                <Col sm={7}>
                  <Form.Control
                    type={field === 'dateOfBirth' ? 'date' : 'text'}
                    name={field}
                    value={profile[field] || ''}
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
