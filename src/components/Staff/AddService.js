/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { useState } from 'react';
import Container from '../Global/Container';
import { SnackbarProvider } from 'notistack';
import { Card, CardBody, CardTitle, CardText, Row, Col } from 'reactstrap';

const AddService = () => {
    const [nameService, setNameService] = useState('');
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [selectedService, setSelectedService] = useState('');

    const handleServiceChange = (e) => {
        setSelectedService(e.target.value);
        // Set nameService and price with static values for display
        setNameService('Dịch vụ 1');
        setPrice(100000);
    };    

    const handleQuantityChange = (e) => {
        setQuantity(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate a successful submission
        alert('Dịch vụ đã được thêm thành công');
        setNameService('');
        setPrice(0);
        setQuantity(1);
        setSelectedReservation(null);
        setSelectedService('');
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    return (
        <Container>
            <div css={styles}>
                <h1>Thêm dịch vụ</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Tên dịch vụ</label>
                        <select
                            value={selectedService}
                            onChange={handleServiceChange}
                            required
                        >
                            <option value="">Chọn dịch vụ</option>
                            <option value="1">Dịch vụ 1 - Giá: {formatCurrency(100000)}</option>
                            <option value="2">Dịch vụ 2 - Giá: {formatCurrency(200000)}</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Số lượng</label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={handleQuantityChange}
                            required
                            min="1"
                        />
                    </div>

                    <div className="form-group">
                        <label>Tổng phí dịch vụ</label>
                        <input
                            type="text"
                            value={formatCurrency(price * quantity)}
                            readOnly
                        />
                    </div>

                    <div className="form-group">
                        <label>Chọn phiếu đặt phòng</label>
                        <select
                            value={selectedReservation}
                            onChange={(e) => setSelectedReservation(e.target.value)}
                            required
                        >
                            <option value="">Chọn phiếu</option>
                            <option value="1">Khách 1 - Phòng A101</option>
                            <option value="2">Khách 2 - Phòng B202</option>
                        </select>
                    </div>
                    <button type="submit">Thêm dịch vụ</button>
                </form>
                <ServiceList />
            </div>
        </Container>
    );
};

const styles = css`
    padding: 120px;
    background-color: #f9f9f9;
    h1 {
        margin-bottom: 20px;
    }
    .form-group {
        margin-bottom: 15px;
        label {
            display: block;
            margin-bottom: 5px;
        }
        input, select {
            width: 100%;
            padding: 8px;
            box-sizing: border-box;
        }
    }
    button {
        padding: 10px 20px;
        background-color: #0000cd;
        color: #fff;
        border: none;
        cursor: pointer;
        &:hover {
            background-color: #00008b;
        }
    }
    p {
        margin-top: 15px;
        color: #ff1414;
    }
`;

const ServiceList = () => {
    // Dummy data for display
    const services = [
        {
            id: 1,
            nameService: 'Dịch vụ 1',
            price: 100000,
            quantity: 2,
            guest_name: 'Khách 1',
            room_names: 'Phòng A101',
        },
        {
            id: 2,
            nameService: 'Dịch vụ 2',
            price: 200000,
            quantity: 1,
            guest_name: 'Khách 2',
            room_names: 'Phòng B202',
        }
    ];
    
    // Group services by guest and room
    const groupedServices = services.reduce((acc, service) => {
        const key = `${service.guest_name} - Phòng: ${service.room_names}`;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(service);
        return acc;
    }, {});

    return (
        <Container>
            <div css={listStyles}>
                <h1>Danh sách phiếu đặt phòng</h1>
                {Object.entries(groupedServices).map(([key, services]) => (
                    <div key={key} css={groupStyle}>
                        <h2 css={groupTitleStyle}>{key}</h2>
                        <Row>
                            {services.map((service, index) => (
                                <Col key={index} sm="12" md="6" lg="4">
                                    <Card css={cardStyle}>
                                        <CardBody>
                                            <CardTitle tag="h5" css={cardTitleStyle}>{service.nameService}</CardTitle>
                                            <CardText css={cardTextStyle}>
                                                Giá: {service.price.toLocaleString()} VND<br />
                                                Số lượng: {service.quantity}
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

const listStyles = css`
    padding: 20px;
    background-color: #f9f9f9;
    h1 {
        margin-bottom: 20px;
        text-align: center;
    }
`;

const groupStyle = css`
    margin-bottom: 20px;
    padding: 10px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const groupTitleStyle = css`
    font-size: 1.25rem;
    color: #343a40;
    margin-bottom: 10px;
`;

const cardStyle = css`
    position: relative;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const cardTitleStyle = css`
    font-size: 1rem;
    color: #007bff;
`;

const cardTextStyle = css`
    font-size: 0.875rem;
    color: #343a40;
`;

export default () => (
    <SnackbarProvider maxSnack={3}>
        <AddService />
    </SnackbarProvider>
);
