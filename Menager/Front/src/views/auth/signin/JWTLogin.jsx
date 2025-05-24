import React, { useState } from 'react';
import { Row, Col, Alert, Button } from 'react-bootstrap';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import '../../../assets/scss/formstyle.css';

const JWTLogin = () => {
  const [serverMessage, setServerMessage] = useState('');

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const personalId = parseInt(values.personalnumber);
      if (isNaN(personalId)) {
        setServerMessage('Personal Number duhet të jetë një numër valid');
        setSubmitting(false);
        return;
      }
  
      const requestData = {
        personalId,
        password: values.password,
      };
  
      console.log(requestData);
  
      const response = await axios.post('https://localhost:7006/api/auth/login', requestData);
  
      if (response.data.message === "Login successful") {
        // Përshtatimi në varësi të rolit të përdoruesit
        const userRole = response.data.role;
  
        // Ruaj rolin në localStorage ose Session
        localStorage.setItem('role', userRole);
  
        // Redirektoni në dashboard në varësi të rolit
        if (userRole === 'user') {
          window.location.href = "/user/app/dashboard";
        } else if (userRole === 'officer') {
          window.location.href = "/officer/app/dashboard/default";
        } else if (userRole === 'manager') {
          window.location.href = "/manager/app/dashboard";
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
