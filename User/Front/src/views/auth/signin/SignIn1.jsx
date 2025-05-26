import React from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import { NavLink, Link } from 'react-router-dom';


import { CopyToClipboard } from 'react-copy-to-clipboard';

import AuthLogin from './JWTLogin';

const Signin1 = () => {
  return (
    <React.Fragment>

      <div className="auth-wrapper">
        <div className="auth-content">
          <div className="auth-bg">
            <span className="r" />
            <span className="r s" />
            <span className="r s" />
            <span className="r" />
          </div>
          <Card className="borderless text-center">
            <Card.Body>
              <div className="mb-4">
               <h3>NovaBank</h3>
              </div>
              <AuthLogin />
            </Card.Body>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Signin1;
