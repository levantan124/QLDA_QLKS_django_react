/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { useState, useEffect } from 'react';
import Container from '../Global/Container';
import { authAPI, endpoints } from '../../configs/APIs';
import { Card, CardBody, CardTitle, CardText, Row, Col } from 'reactstrap';

const ServiceList = () => {
    const [services, setServices] = useState([]);
    const [loadingServices, setLoadingServices] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await authAPI().get(endpoints['services']);
                setServices(response.data);
                console.log('API response status:', response.status);
                console.log('API response data:', response.data);
            } catch (err) {
                setError('Failed to fetch services');
                console.error('Error fetching services:', err);
            } finally {
                setLoadingServices(false);
            }
        };

        fetchServices();
    }, []);

    // Group services by guest and room
    const groupedServices = services.reduce((acc, service) => {
        const key = `Danh sách dịch vụ đang có`;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(service);
        return acc;
    }, {});

    if (loadingServices) {
        return <div>Loading services...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Container>
            <div css={styles}>
                <h1>Danh sách dịch vụ</h1>
                {Object.entries(groupedServices).map(([key, services]) => (
                    <div key={key} css={groupStyle}>
                        <h2 css={groupTitleStyle}>{key}</h2>
                        <Row>
                            {services.map((service, index) => (
                                <Col key={index} sm="12" md="6" lg="4">
                                    <Card css={cardStyle}>
                                        <CardBody>
                                            <CardTitle tag="h5" css={cardTitleStyle}>{service.service}</CardTitle>
                                            <CardText css={cardTextStyle}>
                                                <span css={serviceNameStyle}>{service.nameService}</span><br />
                                                Giá: {service.price.toLocaleString()} VND<br />
                                            </CardText>
                                        </CardBody>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </div>
                ))}
            </div>
        </Container>
    );
};

const styles = css`
    padding: 40px;
    background-color: #f9f9f9;
    h1 {
        margin-bottom: 40px;
        text-align: center;
        font-size: 2rem;
        color: #333;
    }
`;

const groupStyle = css`
    margin-bottom: 40px;
    padding: 20px;
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const groupTitleStyle = css`
    font-size: 1.75rem;
    color: #333;
    margin-bottom: 20px;
    border-bottom: 2px solid #007bff;
    padding-bottom: 10px;
`;

const cardStyle = css`
    margin-bottom: 20px;
    border: 1px solid #ddd;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    &:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
    }
`;

const cardTitleStyle = css`
    font-size: 1.5rem;
    color: #007bff;
    margin-bottom: 10px;
`;

const cardTextStyle = css`
    font-size: 1rem;
    color: #555;
`;

const serviceNameStyle = css`
    font-size: 1.2rem;
    font-weight: bold;
    color: #007bff;
`;

export default ServiceList;
