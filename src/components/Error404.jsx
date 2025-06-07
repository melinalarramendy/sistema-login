import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiFrown, FiHome, FiArrowLeft } from 'react-icons/fi';

const Error404 = () => {
  return (
    <div className="error-404-container">
      <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <Row className="w-100">
          <Col md={{ span: 8, offset: 2 }} lg={{ span: 6, offset: 3 }}>
            <Card className="error-404-card">
              <Card.Body className="text-center p-5">
                <div className="error-404-icon-container mb-4">
                  <FiFrown size={80} className="error-404-icon" />
                </div>
                <h1 className="error-404-title mb-3">404</h1>
                <h2 className="error-404-subtitle mb-4">Página no encontrada</h2>
                <p className="error-404-text mb-5">
                  Lo sentimos, no pudimos encontrar la página que estás buscando.
                  <br />
                  ¿Quizás escribiste mal la URL o la página ha sido movida?
                </p>
                <div className="d-flex justify-content-center gap-4">
                  <Button 
                    variant="primary" 
                    as={Link} 
                    to="/" 
                    className="error-404-button error-404-primary-button"
                  >
                    <FiHome className="me-2" />
                    Ir al Inicio
                  </Button>
                  <Button 
                    variant="outline-primary" 
                    onClick={() => window.history.back()} 
                    className="error-404-button error-404-outline-button"
                  >
                    <FiArrowLeft className="me-2" />
                    Volver Atrás
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Error404;