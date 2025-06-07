import React, { useState } from 'react';
import { Form, Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FiUserPlus, FiUser, FiMail, FiLock } from 'react-icons/fi';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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
    
    if (!formData.name.trim()) newErrors.name = 'Nombre es requerido';
    else if (formData.name.length < 3) newErrors.name = 'Mínimo 3 caracteres';
    
    if (!formData.email.trim()) newErrors.email = 'Email es requerido';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email inválido';
    
    if (!formData.password) newErrors.password = 'Contraseña es requerida';
    else if (formData.password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setServerError('');

    try {
      const response = await axios.post('http://localhost:3001/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/login');
      } else {
        throw new Error('Respuesta inesperada del servidor');
      }

    } catch (err) {
      let errorMessage = 'Error al registrar usuario';
      
      if (err.response) {
        if (err.response.status === 400) {
          errorMessage = err.response.data.message || 'Datos inválidos';
        } else if (err.response.status === 409) {
          errorMessage = 'El email ya está registrado';
        } else {
          errorMessage = `Error del servidor: ${err.response.status}`;
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setServerError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-container">
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <Row className="w-100">
          <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}>
            <Card className="signup-card">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <div className="signup-icon-container">
                    <FiUserPlus size={32} className="signup-icon" />
                  </div>
                  <h2 className="signup-title">Crear Cuenta</h2>
                  <p className="signup-subtitle">Regístrate para comenzar</p>
                </div>

                {serverError && (
                  <Alert variant="danger" dismissible onClose={() => setServerError('')} className="signup-alert">
                    {serverError}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit} noValidate className="signup-form">
                  <Form.Group className="mb-3 form-group-custom">
                    <div className="input-group-custom">
                      <FiUser className="input-icon" />
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        isInvalid={!!errors.name}
                        placeholder="Ej: Juan Pérez"
                        required
                        minLength="3"
                        className="form-control-custom"
                      />
                    </div>
                    <Form.Control.Feedback type="invalid" className="invalid-feedback-custom">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>

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

                  <Form.Group className="mb-3 form-group-custom">
                    <div className="input-group-custom">
                      <FiLock className="input-icon" />
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        isInvalid={!!errors.password}
                        placeholder="Mínimo 6 caracteres"
                        required
                        minLength="6"
                        className="form-control-custom"
                      />
                    </div>
                    <Form.Control.Feedback type="invalid" className="invalid-feedback-custom">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-4 form-group-custom">
                    <div className="input-group-custom">
                      <FiLock className="input-icon" />
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        isInvalid={!!errors.confirmPassword}
                        placeholder="Repite tu contraseña"
                        required
                        className="form-control-custom"
                      />
                    </div>
                    <Form.Control.Feedback type="invalid" className="invalid-feedback-custom">
                      {errors.confirmPassword}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="signup-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Registrando...
                      </>
                    ) : 'Crear Cuenta'}
                  </Button>

                  <div className="text-center mt-4 login-link-container">
                    <span className="login-text">¿Ya tienes cuenta? </span>
                    <Link to="/login" className="login-link">
                      Inicia Sesión
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

export default Signup;