import React, { useState, useEffect } from 'react';
import { useLogout } from './Logout';
import PropTypes from 'prop-types';
import {
    Container,
    Row,
    Col,
    Card,
    ProgressBar,
    ButtonGroup,
    Button,
    Dropdown,
    DropdownButton,
    Badge,
    Spinner,
    Alert,
    Form,
    Modal
} from 'react-bootstrap';
import {
    ArrowUp,
    ArrowDown,
    PersonFill,
    CurrencyDollar,
    GraphUp,
    EyeFill,
    Calendar,
    ArrowClockwise,
    ThreeDotsVertical,
    FileEarmarkPdf,
    FileEarmarkExcel,
    GearFill
} from 'react-bootstrap-icons';

// Componentes de gráficos (simulados)
const LineChart = ({ data }) => <div className="bg-light p-4 rounded">Line Chart Placeholder</div>;
const PieChart = ({ data }) => <div className="bg-light p-4 rounded">Pie Chart Placeholder</div>;
const BarChart = ({ data }) => <div className="bg-light p-4 rounded">Bar Chart Placeholder</div>;
const DataTable = ({ data }) => (
    <div className="bg-light p-4 rounded">
        <table className="table table-striped">
            <thead>
                <tr>
                    <th>User</th>
                    <th>Action</th>
                    <th>Time</th>
                </tr>
            </thead>
            <tbody>
                {data?.map((item, index) => (
                    <tr key={index}>
                        <td>{item.user}</td>
                        <td>{item.action}</td>
                        <td>{item.timestamp}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);


const DateRangeModal = ({ show, onHide, onApply, initialRange }) => {
    const [startDate, setStartDate] = useState(initialRange.startDate);
    const [endDate, setEndDate] = useState(initialRange.endDate);

    const handleApply = () => {
        onApply({ startDate, endDate });
        onHide();
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Select Date Range</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label>Start Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={startDate.toISOString().split('T')[0]}
                            onChange={(e) => setStartDate(new Date(e.target.value))}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>End Date</Form.Label>
                        <Form.Control
                            type="date"
                            value={endDate.toISOString().split('T')[0]}
                            onChange={(e) => setEndDate(new Date(e.target.value))}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleApply}>
                    Apply
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

const Dashboard = ({ userRole }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        endDate: new Date()
    });
    const [stats, setStats] = useState({});
    const [error, setError] = useState(null);
    const [showDateModal, setShowDateModal] = useState(false);
    const logout = useLogout();

    // Datos de ejemplo
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                // Simulación de llamada API
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Datos mock
                setStats({
                    totalUsers: 1245,
                    userGrowth: 12.5,
                    revenue: 45678,
                    revenueGrowth: 8.3,
                    conversionRate: 3.2,
                    conversionChange: -1.2,
                    activeSessions: 342,
                    sessionChange: 5.7,
                    performanceData: [],
                    trafficData: [],
                    acquisitionData: [],
                    recentActivity: [
                        { user: 'John Doe', action: 'Created new project', timestamp: '10:30 AM' },
                        { user: 'Jane Smith', action: 'Updated profile', timestamp: '09:45 AM' },
                        { user: 'Robert Johnson', action: 'Completed payment', timestamp: 'Yesterday' },
                        { user: 'Emily Davis', action: 'Logged in', timestamp: 'Yesterday' },
                        { user: 'Michael Wilson', action: 'Downloaded report', timestamp: 'Mar 12' }
                    ]
                });
            } catch (err) {
                setError('Failed to load dashboard data');
                console.error('Error fetching dashboard data:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [dateRange]);

    const handleRefresh = () => {
        setStats({});
        setIsLoading(true);
    };

    const handleDateRangeApply = (newRange) => {
        setDateRange(newRange);
    };

    const formatDateRange = () => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return `${dateRange.startDate.toLocaleDateString(undefined, options)} - ${dateRange.endDate.toLocaleDateString(undefined, options)}`;
    };

    const renderStatCard = (title, value, change, icon, variant = 'primary') => (
        <Card className="h-100 shadow-sm">
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <Card.Title className="mb-0 text-muted small">{title}</Card.Title>
                    <Badge bg={variant} className="p-2 rounded-circle">
                        {icon}
                    </Badge>
                </div>
                <div className="d-flex align-items-end">
                    <h2 className="mb-0 me-2">{isLoading ? '--' : value}</h2>
                    {!isLoading && (
                        <span className={`text-${change >= 0 ? 'success' : 'danger'} d-flex align-items-center`}>
                            {change >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                            <small className="ms-1">{Math.abs(change)}%</small>
                        </span>
                    )}
                </div>
                <small className="text-muted">vs previous period</small>
            </Card.Body>
        </Card>
    );

    return (
        <Container fluid className="py-4">
            {/* Header */}
            <Row className="mb-4">
                <Col>
                    <div className="d-flex justify-content-between align-items-center">
                        <h1 className="h3 mb-0">Dashboard</h1>
                        <ButtonGroup>
                            <Button variant="outline-secondary" onClick={handleRefresh} disabled={isLoading}>
                                {isLoading ? <Spinner animation="border" size="sm" /> : <ArrowClockwise />}
                            </Button>

                            <Button
                                variant="outline-secondary"
                                onClick={() => setShowDateModal(true)}
                            >
                                <Calendar className="me-1" />
                                {formatDateRange()}
                            </Button>

                            <Button
                                variant="outline-danger"
                                onClick={logout}
                                className="ms-2"
                            >
                                Cerrar Sesión
                            </Button>
                            <DropdownButton
                                variant="outline-secondary"
                                title={<ThreeDotsVertical />}
                                align="end"
                            >
                                <Dropdown.Item href="#">
                                    <FileEarmarkPdf className="me-2" />
                                    Export as PDF
                                </Dropdown.Item>
                                <Dropdown.Item href="#">
                                    <FileEarmarkExcel className="me-2" />
                                    Export as CSV
                                </Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item href="#">
                                    <GearFill className="me-2" />
                                    Customize dashboard
                                </Dropdown.Item>
                            </DropdownButton>
                        </ButtonGroup>
                    </div>
                </Col>
            </Row>

            {isLoading && <ProgressBar now={100} animated className="mb-4" />}
            {error && <Alert variant="danger">{error}</Alert>}

            <DateRangeModal
                show={showDateModal}
                onHide={() => setShowDateModal(false)}
                onApply={handleDateRangeApply}
                initialRange={dateRange}
            />

            {/* Stat Cards */}
            <Row className="g-4 mb-4">
                <Col xs={12} md={6} lg={3}>
                    {renderStatCard(
                        'Total Users',
                        stats.totalUsers,
                        stats.userGrowth,
                        <PersonFill size={18} />,
                        'primary'
                    )}
                </Col>
                <Col xs={12} md={6} lg={3}>
                    {renderStatCard(
                        'Revenue',
                        `$${stats.revenue?.toLocaleString() || '0'}`,
                        stats.revenueGrowth,
                        <CurrencyDollar size={18} />,
                        'success'
                    )}
                </Col>
                <Col xs={12} md={6} lg={3}>
                    {renderStatCard(
                        'Conversion',
                        `${stats.conversionRate || '0'}%`,
                        stats.conversionChange,
                        <GraphUp size={18} />,
                        'info'
                    )}
                </Col>
                <Col xs={12} md={6} lg={3}>
                    {renderStatCard(
                        'Active Sessions',
                        stats.activeSessions,
                        stats.sessionChange,
                        <EyeFill size={18} />,
                        'warning'
                    )}
                </Col>
            </Row>

            {/* Main Charts */}
            <Row className="g-4 mb-4">
                <Col xs={12} lg={8}>
                    <Card className="h-100 shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <Card.Title className="mb-0">Performance Overview</Card.Title>
                                <small className="text-muted">Monthly progression</small>
                            </div>
                            {isLoading ? (
                                <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
                                    <Spinner animation="border" variant="primary" />
                                </div>
                            ) : (
                                <LineChart data={stats.performanceData} />
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} lg={4}>
                    <Card className="h-100 shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <Card.Title className="mb-0">Traffic Sources</Card.Title>
                                <small className="text-muted">By channel</small>
                            </div>
                            {isLoading ? (
                                <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
                                    <Spinner animation="border" variant="primary" />
                                </div>
                            ) : (
                                <PieChart data={stats.trafficData} />
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Secondary Charts */}
            <Row className="g-4">
                <Col xs={12} lg={6}>
                    <Card className="h-100 shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <Card.Title className="mb-0">User Acquisition</Card.Title>
                                <small className="text-muted">Last 30 days</small>
                            </div>
                            {isLoading ? (
                                <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
                                    <Spinner animation="border" variant="primary" />
                                </div>
                            ) : (
                                <BarChart data={stats.acquisitionData} />
                            )}
                        </Card.Body>
                    </Card>
                </Col>
                <Col xs={12} lg={6}>
                    <Card className="h-100 shadow-sm">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <Card.Title className="mb-0">Recent Activity</Card.Title>
                                <DropdownButton
                                    variant="link"
                                    size="sm"
                                    title={<ThreeDotsVertical />}
                                    align="end"
                                    className="no-caret"
                                >
                                    <Dropdown.Item href="#">View all</Dropdown.Item>
                                    <Dropdown.Item href="#">Filter</Dropdown.Item>
                                    <Dropdown.Item href="#">Export</Dropdown.Item>
                                </DropdownButton>
                            </div>
                            {isLoading ? (
                                <div className="d-flex justify-content-center align-items-center" style={{ height: '300px' }}>
                                    <Spinner animation="border" variant="primary" />
                                </div>
                            ) : (
                                <DataTable data={stats.recentActivity || []} />
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

Dashboard.propTypes = {
    userRole: PropTypes.oneOf(['admin', 'manager', 'user']).isRequired
};

export default Dashboard;