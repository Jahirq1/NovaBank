import React from 'react';
import { ListGroup, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const NavRight = () => {
  const navigate = useNavigate();

  // Konfiguro axios për me përfshi cookies
  const api = axios.create({
    baseURL: 'http://localhost:5231/api',
    withCredentials: true
  });

  // Logout handler
  const handleLogout = async () => {
    try {
      // Nëse përdor refreshToken, mundesh me e dërgu këtu
      await api.post('/auth/logout', {}); // ose { refreshToken: '...' }

      // Opsional: pastro userin nga context apo localStorage nqs përdor
      // localStorage.removeItem('user');

      // Redirect në login
      navigate('/login/signin');
    } catch (err) {
      console.error('Gabim gjatë logout:', err);
      alert('Ndodhi një gabim gjatë logout.');
    }
  };

  return (
    <React.Fragment>
      <ListGroup as="ul" bsPrefix=" " className="navbar-nav ml-auto" id="navbar-right">
        <ListGroup.Item as="li" bsPrefix=" ">
          <Dropdown align={'end'} className="drp-user">
            <Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic">
              <i className="icon feather icon-settings" />
            </Dropdown.Toggle>
            <Dropdown.Menu align="end" className="profile-notification">
              <div className="pro-head">
                <span>Profili</span>
              </div>
              <ListGroup as="ul" bsPrefix=" " variant="flush" className="pro-body">
                <ListGroup.Item as="li" bsPrefix=" ">
                  <Link to="/officer/app/profile/default" className="dropdown-item">
                    <i className="feather icon-user" /> Profili
                  </Link>
                </ListGroup.Item>
                <ListGroup.Item as="li" bsPrefix=" ">
                  <span onClick={handleLogout} className="dropdown-item" style={{ cursor: 'pointer' }}>
                    <i className="feather icon-log-out" /> Log out
                  </span>
                </ListGroup.Item>
              </ListGroup>
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>
      </ListGroup>
    </React.Fragment>
  );
};

export default NavRight;