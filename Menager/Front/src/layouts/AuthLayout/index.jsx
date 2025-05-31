import React from 'react';
import PropTypes from 'prop-types';

const AuthLayout = ({ children }) => {
  return (
    <div className="auth-wrapper">
      {children}
    </div>
  );
};

AuthLayout.propTypes = {
  children: PropTypes.node
};

export default AuthLayout;
