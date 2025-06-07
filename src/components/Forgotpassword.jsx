import React, { useState } from 'react';
import { Form, Button, Alert, Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiKey, FiLock } from 'react-icons/fi';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRequestToken = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await axios.post('http://localhost:3001/forgot-password', { email });
            setSuccess('Token enviado a tu correo. Revisa tu bandeja de entrada.');
            setStep(2);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al enviar el token');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            return setError('Las contraseñas no coinciden');
        }

        if (newPassword.length < 6) {
            return setError('La contraseña debe tener al menos 6 caracteres');
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const response = await axios.post('http://localhost:3001/resetpassword', {
                token: token.trim(),
                newPassword: newPassword.trim(),
                confirmPassword: confirmPassword.trim()
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                setSuccess('Contraseña actualizada correctamente. Redirigiendo...');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(response.data.message || 'Error al actualizar la contraseña');
            }
        } catch (err) {
            if (err.response?.data?.errorType === 'invalid_token') {
                setError('El token es inválido o ha expirado. Solicita uno nuevo.');
                setStep(1);
            } else if (err.response?.data?.errorType === 'password_mismatch') {
                setError('Las contraseñas no coinciden');
            } else {
                setError(err.response?.data?.message || 'Error al conectar con el servidor');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
                <Row className="w-100">
                    <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}>
                        <Card className="forgot-password-card">
                            <Card.Body className="p-4">
                                <div className="text-center mb-4">
                                    <div className="forgot-password-icon-container">
                                        <FiKey size={32} className="forgot-password-icon" />
                                    </div>
                                    <h2 className="forgot-password-title">Recuperar Contraseña</h2>
                                    <p className="forgot-password-subtitle">
                                        {step === 1 ? 'Ingresa tu email para recibir un token' : 'Ingresa el token y tu nueva contraseña'}
                                    </p>
                                </div>

                                {error && (
                                    <Alert variant="danger" dismissible onClose={() => setError('')} className="forgot-password-alert">
                                        {error}
                                    </Alert>
                                )}
                                {success && (
                                    <Alert variant="success" dismissible onClose={() => setSuccess('')} className="forgot-password-alert">
                                        {success}
                                    </Alert>
                                )}

                                {step === 1 ? (
                                    <Form onSubmit={handleRequestToken} className="forgot-password-form">
                                        <Form.Group className="mb-3 form-group-custom">
                                            <div className="input-group-custom">
                                                <FiMail className="input-icon" />
                                                <Form.Control
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    placeholder="tucorreo@ejemplo.com"
                                                    required
                                                    className="form-control-custom"
                                                />
                                            </div>
                                        </Form.Group>

                                        <Button
                                            variant="primary"
                                            type="submit"
                                            className="forgot-password-button"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Enviando...
                                                </>
                                            ) : 'Enviar Token'}
                                        </Button>
                                    </Form>
                                ) : (
                                    <Form onSubmit={handleResetPassword} className="forgot-password-form">
                                        <Form.Group className="mb-3 form-group-custom">
                                            <div className="input-group-custom">
                                                <FiKey className="input-icon" />
                                                <Form.Control
                                                    type="text"
                                                    value={token}
                                                    onChange={(e) => setToken(e.target.value)}
                                                    placeholder="Pega el token recibido"
                                                    required
                                                    className="form-control-custom"
                                                />
                                            </div>
                                        </Form.Group>

                                        <Form.Group className="mb-3 form-group-custom">
                                            <div className="input-group-custom">
                                                <FiLock className="input-icon" />
                                                <Form.Control
                                                    type="password"
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    placeholder="Nueva contraseña"
                                                    minLength="6"
                                                    required
                                                    className="form-control-custom"
                                                />
                                            </div>
                                        </Form.Group>

                                        <Form.Group className="mb-4 form-group-custom">
                                            <div className="input-group-custom">
                                                <FiLock className="input-icon" />
                                                <Form.Control
                                                    type="password"
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    placeholder="Repite la nueva contraseña"
                                                    required
                                                    className="form-control-custom"
                                                />
                                            </div>
                                        </Form.Group>

                                        <Button
                                            variant="primary"
                                            type="submit"
                                            className="forgot-password-button"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                    Actualizando...
                                                </>
                                            ) : 'Actualizar Contraseña'}
                                        </Button>
                                    </Form>
                                )}

                                <div className="text-center mt-4 back-to-login-container">
                                    <Link to="/login" className="back-to-login-link">
                                        Volver al inicio de sesión
                                    </Link>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ForgotPassword;