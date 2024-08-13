/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';

const InvoiceDetailsModal = ({ showModal, handleClose, selectedReservation, services }) => {
    const roomCost = 0;
    const serviceCost = 0;
    const totalCost = roomCost + serviceCost;

    return (
        <Modal show={showModal} onHide={handleClose} dialogClassName="custom-modal">
            <Modal.Header closeButton>
                <Modal.Title>Chi tiết Phiếu Đặt Phòng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {selectedReservation && (
                    <Form css={formStyles}>
                        <Form.Group controlId="formReservationId">
                            <Form.Label>ID</Form.Label>
                            <Form.Control
                                type="text"
                                value={selectedReservation.id}
                                readOnly
                            />
                        </Form.Group>
                        <Form.Group controlId="formGuest">
                            <Form.Label>Khách</Form.Label>
                            <Form.Control
                                type="text"
                                value={selectedReservation.guest}
                                readOnly
                            />
                        </Form.Group>
                        <Form.Group controlId="formRoom">
                            <Form.Label>Phòng</Form.Label>
                            <Form.Control
                                type="text"
                                value={selectedReservation.room.map(r => r.nameRoom).join(', ')}
                                readOnly
                            />
                        </Form.Group>
                        <Form.Group controlId="formBookDate">
                            <Form.Label>Ngày đặt</Form.Label>
                            <Form.Control
                                type="text"
                                value={moment(selectedReservation.bookDate).format('DD-MM-YYYY HH:mm:ss')}
                                readOnly
                            />
                        </Form.Group>
                        <Form.Group controlId="formCheckin">
                            <Form.Label>Nhận phòng</Form.Label>
                            <Form.Control
                                type="text"
                                value={moment(selectedReservation.checkin).format('DD-MM-YYYY HH:mm:ss')}
                                readOnly
                            />
                        </Form.Group>
                        <Form.Group controlId="formCheckout">
                            <Form.Label>Trả phòng</Form.Label>
                            <Form.Control
                                type="text"
                                value={moment(selectedReservation.checkout).format('DD-MM-YYYY HH:mm:ss')}
                                readOnly
                            />
                        </Form.Group>
                        <Form.Group controlId="formStatus">
                            <Form.Label>Trạng thái</Form.Label>
                            <Form.Control
                                type="text"
                                value={selectedReservation.statusCheckin ? 'Đã đặt' : 'Chưa đặt'}
                                readOnly
                            />
                        </Form.Group>
                        <Form.Group controlId="formServices">
                            <Form.Label>Dịch vụ</Form.Label>
                            {services.length > 0 ? (
                                services.map(service => (
                                    <div key={service.id} css={serviceStyle}>
                                        <p>{service.nameService}: {service.price.toLocaleString()} VND x {service.quantity}</p>
                                    </div>
                                ))
                            ) : (
                                <p>Không có dịch vụ</p>
                            )}
                        </Form.Group>
                        <Form.Group controlId="formTotalCost" css={totalCostStyle}>
                            <Form.Label>Tổng chi phí</Form.Label>
                            <Form.Control
                                type="text"
                                value={`${totalCost.toLocaleString()} VND`}
                                readOnly
                            />
                        </Form.Group>
                    </Form>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
                <Button variant="primary">
                    Xuất Hóa Đơn
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

const ManageInvoices = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);
    const [services, setServices] = useState([]);

    const handleShow = (reservation) => {
        setSelectedReservation(reservation);
        setShowModal(true);
        setServices([]);
    };

    const handleClose = () => {
        setShowModal(false);
        setServices([]);
    };

    const reservations = [
        { id: 1, guest: 'John Doe', room: [{ nameRoom: '101' }], statusCheckin: true },
        { id: 2, guest: 'Jane Smith', room: [{ nameRoom: '102' }], statusCheckin: false },
    ];

    return (
        <div css={styles}>
            <h1>Quản lý Hóa Đơn</h1>
            <table css={tableStyles}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Khách</th>
                        <th>Phòng</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {reservations.map(reservation => (
                        <tr key={reservation.id}>
                            <td>{reservation.id}</td>
                            <td>{reservation.guest}</td>
                            <td>{reservation.room.map(r => r.nameRoom).join(', ')}</td>
                            <td>{reservation.statusCheckin ? 'Đã đặt' : 'Chưa đặt'}</td>
                            <td>
                                <Button variant="primary" onClick={() => handleShow(reservation)}>Xuất Hóa Đơn</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <InvoiceDetailsModal
                showModal={showModal}
                handleClose={handleClose}
                selectedReservation={selectedReservation}
                services={services}
            />
        </div>
    );
};

const styles = css`
    padding-top: 140px;
    background-color: #f4f4f4;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;

    h1 {
        color: #0000CD;
        text-align: center;
        margin-bottom: 20px;
        font-size: 2.5em;
        font-weight: bold;
    }

    table {
        width: 90%;
        margin: 20px 0;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    p {
        font-size: 1.2em;
        text-align: center;
    }
`;

const tableStyles = css`
    width: 100%;
    border-collapse: collapse;

    th, td {
        border: 1px solid #ddd;
        padding: 12px;
        text-align: center;
        font-size: 1em;
    }

    th {
        background-color: #0000CD;
        color: white;
        font-weight: bold;
    }

    tr:nth-of-type(even) {
        background-color: #f2f2f2;
    }

    tr:hover {
        background-color: #ddd;
    }

    td {
        max-width: 150px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    button {
        font-size: 1em;
        padding: 5px 10px;
    }
`;

const formStyles = css`
    display: flex;
    flex-wrap: wrap;

    .form-group {
        flex: 1 1 50%;
        padding: 10px;
    }
`;

const totalCostStyle = css`
    .form-control {
        font-weight: bold;
        font-size: 1.2em;
    }
`;

const serviceStyle = css`
    background-color: #f9f9f9;
    padding: 10px;
    margin: 5px 0;
    border-radius: 5px;
    border: 1px solid #ddd;
    display: flex;
    justify-content: space-between;
`;

export default ManageInvoices;
