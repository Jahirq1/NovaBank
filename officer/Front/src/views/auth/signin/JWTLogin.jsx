import React, { useState } from 'react';
import { Row, Col, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import '../../../assets/scss/formstyle.css';
import { setUserSession } from '../../../session/session';

const JWTLogin = () => {
  const [serverMessage, setServerMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const personalId = parseInt(values.personalnumber);
      if (isNaN(personalId)) {
        setServerMessage('Personal Number duhet të jetë një numër valid');
        setSubmitting(false);
        return;
      }
  
      const requestData = {
        personalId : parseInt(values.personalnumber),
        password: values.password,
      };
  
      console.log(requestData);
  
      const response = await axios.post('http://localhost:5231/api/auth/login', requestData,{ withCredentials: true });
  
      if (response.data.message === "Login successful") {
        const userRole = response.data.role;
        const userId = response.data.userId;
  
        // Ruaj userId dhe role në localStorage me funksionin session.js
        setUserSession(userId, userRole);
  
        // Redirect në dashboard bazuar në role
        if (userRole === 'user') {
          navigate("/user/app/dashboard");
        } else if (userRole === 'officer') {
          navigate("/officer/app/dashboard/default");
        } else if (userRole === 'manager') {
          navigate("/manager/app/dashboard");
        } else {
          setServerMessage('Rol i panjohur');
        }
  
        setServerMessage('Login i suksesshëm!');
      } else {
        setServerMessage('Login ka dështuar!');
      }
    } catch (error) {
      console.error('Error: ', error);
      setServerMessage('Login ka dështuar: Gabim i serverit');
    } finally {
      setSubmitting(false);
    }
  };
  
  

  return (
    <Formik
      initialValues={{
        personalnumber: '',
        password: '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        personalnumber: Yup.number()
          .typeError('Personal number duhet të jetë një numër')
          .min(0, "Personal number nuk mund të jetë negativ")
          .required('Personal Number është i detyrueshëm'),
        password: Yup.string()
          .max(255)
          .required('Fjalëkalimi është i detyrueshëm')
      })}
      onSubmit={handleLogin}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <input
              className="form-control"
              label="Personal Number"
              placeholder="Personal Number"
              name="personalnumber"
              onBlur={handleBlur}
              onChange={handleChange}
              type="number"
              value={values.personalnumber}
            />
            {touched.personalnumber && errors.personalnumber && (
              <small className="text-danger form-text">{errors.personalnumber}</small>
            )}
          </div>

          <div className="form-group mb-4">
            <input
              className="form-control"
              label="Password"
              placeholder="Password"
              name="password"
              onBlur={handleBlur}
              onChange={handleChange}
              type="password"
              value={values.password}
            />
            {touched.password && errors.password && (
              <small className="text-danger form-text">{errors.password}</small>
            )}
          </div>

          {serverMessage && (
            <Col sm={12}>
              <Alert variant={serverMessage.toLowerCase().includes('suksesshëm') ? 'success' : 'danger'}>
                {serverMessage}
              </Alert>
            </Col>
          )}

          <Row>
            <Col mt={2}>
              <Button
                className="btn-block mb-4"
                color="primary"
                disabled={isSubmitting}
                size="large"
                type="submit"
                variant="primary"
              >
                Sign In
              </Button>
            </Col>
          </Row>
        </form>
      )}
    </Formik>
  );
};

export default JWTLogin;
