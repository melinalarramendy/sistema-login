import React, { useState } from 'react';
import { Form, Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email es requerido';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email inválido';

    if (!formData.password) newErrors.password = 'Contraseña es requerida';
    else if (formData.password.length < 6) newErrors.password = 'Mínimo 6 caracteres';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setServerError('');

    try {
      const response = await axios.post('http://localhost:3001/login', {
        email: formData.email,
        password: formData.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.data || !response.data.token || !response.data.user) {
        throw new Error('Respuesta del servidor incompleta');
      }

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.data.user.id,
        email: response.data.user.email,
        name: response.data.user.name
      }));

      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

      navigate('/dashboard', { replace: true });

    } catch (err) {
      let errorMessage = 'Error al iniciar sesión';

      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = 'Credenciales incorrectas';
        } else if (err.response.status === 404) {
          errorMessage = 'Usuario no encontrado';
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.message) {

        errorMessage = err.message;
      }

      setServerError(errorMessage);

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <Row className="w-100">
          <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}>
            <Card className="login-card">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <div className="login-icon-container">
                    <FiLogIn size={32} className="login-icon" />
                  </div>
                  <h2 className="login-title">Iniciar Sesión</h2>
                  <p className="login-subtitle">Ingresa a tu cuenta</p>
                </div>

                {serverError && (
                  <Alert variant="danger" dismissible onClose={() => setServerError('')} className="login-alert">
                    {serverError}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit} noValidate className="login-form">
                  <Form.Group className="mb-3 form-group-custom">
                    <div className="input-group-custom">
                      <FiMail className="input-icon" />
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        isInvalid={!!errors.email}
                        placeholder="tucorreo@ejemplo.com"
                        required
                        className="form-control-custom"
                      />
                    </div>
                    <Form.Control.Feedback type="invalid" className="invalid-feedback-custom">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4 form-group-custom">
                    <div className="input-group-custom">
                      <FiLock className="input-icon" />
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        isInvalid={!!errors.password}
                        placeholder="••••••••"
                        required
                        minLength="6"
                        className="form-control-custom"
                      />
                    </div>
                    <Form.Control.Feedback type="invalid" className="invalid-feedback-custom">
                      {errors.password}
                    </Form.Control.Feedback>
                    <div className="text-end mt-2">
                      <Link to="/forgot-password" className="forgot-password-link">
                        ¿Olvidaste tu contraseña?
                      </Link>
                    </div>
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="login-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Iniciando...
                      </>
                    ) : 'Ingresar'}
                  </Button>

                  <div className="text-center mt-4 register-link-container">
                    <span className="register-text">¿No tienes cuenta? </span>
                    <Link to="/register" className="register-link">
                      Regístrate
                    </Link>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;