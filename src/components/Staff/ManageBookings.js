/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const ReservationDetailsModal = ({ showModal, handleClose, selectedReservation, setSelectedReservation }) => {
    return (
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Chi tiết Đặt Phòng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {selectedReservation && (
                    <Form>
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
                                value={selectedReservation.room}
                                readOnly
                            />
                        </Form.Group>
                        <Form.Group controlId="formBookDate">
                            <Form.Label>Ngày đặt</Form.Label>
                            <Form.Control
                                type="text"
                                value={selectedReservation.bookDate}
                                readOnly
                            />
                        </Form.Group>
                        <Form.Group controlId="formCheckin">
                            <Form.Label>Nhận phòng</Form.Label>
                            <Form.Control
                                type="text"
                                value={selectedReservation.checkin}
                                readOnly
                            />
                        </Form.Group>
                        <Form.Group controlId="formCheckout">
                            <Form.Label>Trả phòng</Form.Label>
                            <Form.Control
                                type="text"
                                value={selectedReservation.checkout}
                                readOnly
                            />
                        </Form.Group>
                        <Form.Group controlId="formActive">
                            <Form.Label>Trạng thái đặt</Form.Label>
                            <Form.Check
                                type="checkbox"
                                checked={selectedReservation.statusCheckin}
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
                    Sửa
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

const ManageBookings = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);

    const handleShow = (reservation) => {
        setSelectedReservation(reservation);
        setShowModal(true);
    };

    const handleClose = () => setShowModal(false);

    // Placeholder data
    const reservations = [
        {
            id: 1,
            guest: 'Nguyen Van A',
            room: 'Phòng 101',
            bookDate: '2024-08-01',
            checkin: '2024-08-05',
            checkout: '2024-08-10',
            statusCheckin: true,
        },
        {
            id: 2,
            guest: 'Tran Thi B',
            room: 'Phòng 202',
            bookDate: '2024-08-02',
            checkin: '2024-08-06',
            checkout: '2024-08-11',
            statusCheckin: false,
        },
    ];

    return (
        <div css={styles}>
            <h1>Quản lý Đặt Phòng</h1>
            <table css={tableStyles}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Khách</th>
                        <th>Phòng</th>
                        <th>Ngày đặt</th>
                        <th>Nhận phòng</th>
                        <th>Trả phòng</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {reservations.map(reservation => (
                        <tr key={reservation.id}>
                            <td>{reservation.id}</td>
                            <td>{reservation.guest}</td>
                            <td>{reservation.room}</td>
                            <td>{reservation.bookDate}</td>
                            <td>{reservation.checkin}</td>
                            <td>{reservation.checkout}</td>
                            <td>{reservation.statusCheckin ? 'Đã đặt' : 'Chưa đặt'}</td>
                            <td>
                                <Button variant="primary" onClick={() => handleShow(reservation)}>Sửa</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ReservationDetailsModal
                showModal={showModal}
                handleClose={handleClose}
                selectedReservation={selectedReservation}
                setSelectedReservation={setSelectedReservation}
            />
        </div>
    );
};

const styles = css`
    padding-top: 120px;
    background-color: #f4f4f4;
    min-height: 100vh;

    h1 {
        color: #0000CD;
        text-align: center;
        margin-bottom: 20px;
    }

    p {
        font-size: 16px;
        text-align: center;
    }
`;

const tableStyles = css`
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;

    th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
    }

    th {
        background-color: #0000CD;
        color: white;
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
`;

export default ManageBookings;
