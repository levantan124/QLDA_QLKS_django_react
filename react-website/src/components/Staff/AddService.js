/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { useState, useEffect } from 'react';
import Container from '../Global/Container';
import { authAPI, endpoints } from '../../configs/APIs';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { Card, CardBody, CardTitle, CardText, Row, Col } from 'reactstrap';

const AddService = () => {
    const [nameService, setNameService] = useState('');
    const [price, setPrice] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [reservations, setReservations] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [selectedService, setSelectedService] = useState('');
    const [error, setError] = useState('');
    const [loadingReservations, setLoadingReservations] = useState(true);
    const [loadingServices, setLoadingServices] = useState(true);

    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await authAPI().get(endpoints['list_reservations']);
                console.log(response.data)
                setReservations(response.data);
            } catch (err) {
                setError('Failed to fetch reservations');
            } finally {
                setLoadingReservations(false);
            }
        };

        fetchReservations();
    }, []);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await authAPI().get(endpoints['services']);
                console.log('Fetched services:', response.data);
                setServices(response.data);
            } catch (err) {
                setError('Failed to fetch services');
            } finally {
                setLoadingServices(false);
            }
        };

        fetchServices();
    }, []);

    const handleServiceChange = (e) => {
        const selectedServiceId = e.target.value;
        const selectedService = services.find(service => service.id === parseInt(selectedServiceId));
        setSelectedService(selectedServiceId);
        if (selectedService) {
            setNameService(selectedService.nameService);
            setPrice(selectedService.price);
        } else {
            console.error('Selected service not found');
        }
    };
    
    const handleQuantityChange = (e) => {
        const newQuantity = e.target.value;
        setQuantity(newQuantity);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const serviceData = {
            reservationId: selectedReservation,
            service: selectedService,
            quantity,
        };
        
        try {
            console.log(serviceData); // Đã sửa lỗi ở đây            
            const response = await authAPI().post(endpoints['reservation_service'], serviceData);
            if (response.status === 201) {
                enqueueSnackbar('Dịch vụ đã được thêm thành công', { variant: 'success' });
                setNameService('');
                setPrice(0);
                setQuantity(1);
                setSelectedReservation(null);
                setSelectedService('');
            } else {
                enqueueSnackbar('Có lỗi xảy ra, vui lòng thử lại', { variant: 'error' });
            }
        } catch (error) {
            console.error('Error adding service:', error);
            enqueueSnackbar('Có lỗi xảy ra, vui lòng thử lại', { variant: 'error' });
        }
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
                            {loadingServices ? (
                                <p>Loading services...</p>
                            ) : (
                                <select
                                    value={selectedService}
                                    onChange={handleServiceChange}
                                    required
                                >
                                    <option value="">Chọn dịch vụ</option>
                                    {services.map((service) => (
                                        <option key={service.id} value={service.id}>
                                            {service.nameService} - Giá: {formatCurrency(service.price)}
                                        </option>
                                    ))}
                                </select>

                            )}
                            {error && <p>{error}</p>}
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
                        {loadingReservations ? (
                            <p>Loading reservations...</p>
                        ) : (
                            <select
                                value={selectedReservation}
                                onChange={(e) => setSelectedReservation(e.target.value)}
                                required
                            >
                                <option value="">Chọn phiếu</option>
                                {reservations.map((reservation) => (
                                    <option key={reservation.id} value={reservation.id}>
                                        {reservation.guest} - {reservation.room.map(r => r.nameRoom).join(', ')} - {reservation.checkin}
                                    </option>
                                ))}
                            </select>
                        )}
                        {error && <p>{error}</p>}
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
    const [services, setServices] = useState([]);
    const [servicee, setServicee] = useState([]);

    const { enqueueSnackbar } = useSnackbar(); 
    const [error, setError] = useState('');
    const [loadingServices, setLoadingServices] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await authAPI().get(endpoints['reservation_service']);
                console.log('Thông tin phiếu_dịch vụ:', response.data)
                setServices(response.data);
            } catch (error) {
                console.error('Error fetching services:', error);
            }
        };

        fetchServices();
    }, []);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await authAPI().get(endpoints['services']);
                console.log('Fetched services:', response.data);
                setServicee(response.data);
            } catch (err) {
                setError('Failed to fetch services');
            } finally {
                setLoadingServices(false);
            }
        };

        fetchServices();
    }, []);
    
    const handleDelete = async (serviceId) => {
        if (!serviceId) {
            enqueueSnackbar('Service ID is undefined', { variant: 'error' });
            return;
        }
        try {
            const response = await authAPI().patch(endpoints['deactive_service'](serviceId), { active: false });
            setServices(services.filter(service => service.id !== serviceId));
            enqueueSnackbar('Dịch vụ đã được xóa thành công', { variant: 'success' });
        } catch (error) {
            if (error.response) {
               
                if (error.response.status === 404) {
                    enqueueSnackbar('Dịch vụ không tìm thấy, có thể đã bị xóa trước đó.', { variant: 'warning' });
                } else {
                    enqueueSnackbar('Có lỗi xảy ra khi xóa dịch vụ', { variant: 'error' });
                }
            } else if (error.request) {
                enqueueSnackbar('Không thể kết nối với máy chủ', { variant: 'error' });
            } else {
                enqueueSnackbar('Có lỗi xảy ra, vui lòng thử lại', { variant: 'error' });
            }
        }
    };
    
    
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
                                            <button
                                                className="delete-button"
                                                css={deleteButtonStyle}
                                                onClick={() => handleDelete(service.id)}
                                            >
                                                Xóa
                                            </button>
                                            <CardTitle tag="h5" css={cardTitleStyle}>  {servicee.find((s) => s.id === service.service)?.nameService || 'Tên dịch vụ không xác định'}
                                            </CardTitle>
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
    transition: transform 0.3s ease;
    &:hover {
        transform: scale(1.05);
        .delete-button {
            opacity: 1;
            visibility: visible;
        }
    }
`;

const deleteButtonStyle = css`
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #dc3545;
    color: #fff;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
    &:hover {
        background-color: #c82333;
    }
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