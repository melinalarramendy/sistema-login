import React, { useState } from 'react';
import { Form, Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { FiLock, FiCheckCircle } from 'react-icons/fi';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [serverSuccess, setServerSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        // Clear error when user types
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (formData.newPassword.length < 6) newErrors.newPassword = 'Mínimo 6 caracteres';
        if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        if (!token) {
            setServerError('Token inválido o faltante');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await axios.post('http://localhost:3001/resetpassword', {
                token,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                setServerSuccess(response.data.message || 'Contraseña actualizada correctamente');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setServerError(response.data.message || 'Error desconocido');
            }
        } catch (err) {
            if (err.response) {
                if (err.response.data.errorType === 'invalid_token') {
                    setServerError('El token es inválido o ha expirado');
                } else if (err.response.data.errorType === 'password_mismatch') {
                    setServerError('Las contraseñas no coinciden');
                } else {
                    setServerError(err.response.data.message || 'Error del servidor');
                }
            } else if (err.request) {
                setServerError('No se recibió respuesta del servidor');
            } else {
                setServerError('Error al configurar la solicitud');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="reset-password-container">
            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
                <Row className="w-100">
                    <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}>
                        <Card className="reset-password-card">
                            <Card.Body className="p-4">
                                <div className="text-center mb-4">
                                    <div className="reset-password-icon-container">
                                        <FiLock size={32} className="reset-password-icon" />
                                    </div>
                                    <h2 className="reset-password-title">Restablecer Contraseña</h2>
                                    <p className="reset-password-subtitle">Crea una nueva contraseña para tu cuenta</p>
                                </div>

                                {serverError && (
                                    <Alert variant="danger" dismissible onClose={() => setServerError('')} className="reset-password-alert">
                                        {serverError}
                                    </Alert>
                                )}

                                {serverSuccess && (
                                    <Alert variant="success" dismissible onClose={() => setServerSuccess('')} className="reset-password-alert">
                                        <FiCheckCircle className="me-2" />
                                        {serverSuccess}
                                    </Alert>
                                )}

                                <Form onSubmit={handleSubmit} className="reset-password-form">
                                    <Form.Group className="mb-3 form-group-custom">
                                        <div className="input-group-custom">
                                            <FiLock className="input-icon" />
                                            <Form.Control
                                                type="password"
                                                name="newPassword"
                                                value={formData.newPassword}
                                                onChange={handleChange}
                                                isInvalid={!!errors.newPassword}
                                                placeholder="Mínimo 6 caracteres"
                                                autoComplete="new-password"
                                                className="form-control-custom"
                                            />
                                        </div>
                                        <Form.Control.Feedback type="invalid" className="invalid-feedback-custom">
                                            {errors.newPassword}
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
                                                placeholder="Repite tu nueva contraseña"
                                                autoComplete="new-password"
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
                                        className="reset-password-button"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Actualizando...
                                            </>
                                        ) : 'Actualizar Contraseña'}
                                    </Button>

                                    <div className="text-center mt-4 back-to-login-container">
                                        <Link to="/login" className="back-to-login-link">
                                            Volver al inicio de sesión
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

export default ResetPassword;