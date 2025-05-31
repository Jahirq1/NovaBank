import React, { useState } from 'react';
import { Row, Col, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import axios from 'axios';
import '../../../assets/scss/formstyle.css';

const JWTLogin = () => {
  const [serverMessage, setServerMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (values, { setSubmitting }) => {
    try {
      const personalId = parseInt(values.personalnumber, 10);
      if (isNaN(personalId)) {
        setServerMessage('Personal Number duhet të jetë një numër valid');
        setSubmitting(false);
        return;
      }

      const requestData = { personalId, password: values.password };

      const response = await axios.post(
        'http://localhost:5231/api/auth/login',
        requestData,
        { withCredentials: true }
      );

      const { role } = response.data;

      setServerMessage('Login i suksesshëm!');

      switch (role) {
        case 'user':
          navigate('/user/app/dashboard');
          break;
        case 'officer':
          navigate('/officer/app/dashboard/default');
          break;
        case 'manager':
          navigate('/manager/app/dashboard');
          break;
        default:
          setServerMessage('Rol i panjohur!');
          break;
      }
    } catch (error) {
      console.error(
        'Gabim gjatë login-it: ',
        error.response ? error.response.data : error.message
      );
      setServerMessage('Login ka dështuar: Gabim i serverit');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ personalnumber: '', password: '' }}
      validationSchema={Yup.object().shape({
        personalnumber: Yup.number()
          .typeError('Personal number duhet të jetë një numër')
          .min(0, 'Personal number nuk mund të jetë negativ')
          .required('Personal Number është i detyrueshëm'),
        password: Yup.string()
          .max(255)
          .required('Fjalëkalimi është i detyrueshëm'),
      })}
      onSubmit={handleLogin}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values,
      }) => (
        <form noValidate onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <input
              className="form-control"
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
              <Alert
                variant={
                  serverMessage.toLowerCase().includes('suksesshëm')
                    ? 'success'
                    : 'danger'
                }
              >
                {serverMessage}
              </Alert>
            </Col>
          )}

          <Row>
            <Col mt={2}>
              <Button
                className="btn-block mb-4"
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
