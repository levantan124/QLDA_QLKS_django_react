/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import Container from '../Global/Container';
import { Card, CardBody, CardTitle, CardText, Row, Col } from 'reactstrap';

const ServiceList = () => {
    // Dummy data to represent services for display purposes
    const services = [
        { service: 'Dịch vụ 1', nameService: 'Massage', price: 500000 },
        { service: 'Dịch vụ 2', nameService: 'Giặt ủi', price: 100000 },
        { service: 'Dịch vụ 3', nameService: 'Đưa đón sân bay', price: 200000 },
    ];

    return (
        <Container>
            <div css={styles}>
                <h1>Danh sách dịch vụ</h1>
                <div css={groupStyle}>
                    <h2 css={groupTitleStyle}>Danh sách dịch vụ đang có</h2>
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
