/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { useEffect, useState } from 'react';
import { authAPI, endpoints } from '../../configs/APIs';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const ReservationDetailsModal = ({ showModal, handleClose, selectedReservation, setSelectedReservation, handleUpdate, handleDelete }) => {
    const [availableRooms, setAvailableRooms] = useState([]);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await authAPI().get('http://192.168.1.233:8000/rooms/');
                setAvailableRooms(response.data);
            } catch (error) {
                console.error('There was an error fetching the rooms!', error);
            }
        };

        fetchRooms();
    }, []);

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
                            <Form.Select
                                value={selectedReservation.room[0]?.nameRoom || ''}
                                onChange={(e) => setSelectedReservation(prev => ({
                                    ...prev,
                                    room: availableRooms.filter(room => room.nameRoom === e.target.value)
                                }))}
                            >
                                <option value="">Chọn phòng</option>
                                {availableRooms.map(room => (
                                    <option key={room.id} value={room.nameRoom}>
                                        {room.nameRoom}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="formBookDate">
                            <Form.Label>Ngày đặt</Form.Label>
                            <Form.Control
                                type="text"
                                value={selectedReservation.bookDate}
                                onChange={(e) => setSelectedReservation(prev => ({ ...prev, bookDate: e.target.value }))}
                            />
                        </Form.Group>
                        <Form.Group controlId="formCheckin">
                            <Form.Label>Nhận phòng</Form.Label>
                            <Form.Control
                                type="text"
                                value={selectedReservation.checkin}
                                onChange={(e) => setSelectedReservation(prev => ({ ...prev, checkin: e.target.value }))}
                            />
                        </Form.Group>
                        <Form.Group controlId="formCheckout">
                            <Form.Label>Trả phòng</Form.Label>
                            <Form.Control
                                type="text"
                                value={selectedReservation.checkout}
                                onChange={(e) => setSelectedReservation(prev => ({ ...prev, checkout: e.target.value }))}
                            />
                        </Form.Group>
                        <Form.Group controlId="formActive">
                            <Form.Label>Trạng thái đặt</Form.Label>
                            <Form.Check
                                type="checkbox"
                                checked={selectedReservation.statusCheckin}
                                onChange={(e) => setSelectedReservation(prev => ({
                                    ...prev,
                                    statusCheckin: e.target.checked
                                }))}
                            />

                        </Form.Group>
                    </Form>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Đóng
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    Xóa
                </Button>
                <Button variant="primary" onClick={handleUpdate}>
                    Sửa
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

const ManageBookings = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState(null);

    const handleShow = (reservation) => {
        setSelectedReservation(reservation);
        setShowModal(true);
    };

    const handleClose = () => setShowModal(false);

    const handleUpdate = async () => {
        if (!selectedReservation) return;

        // Tạo một bản sao của đối tượng selectedReservation để sửa đổi
        const updatedReservation = { ...selectedReservation };
        console.log('Dữ liệu cập nhật:', updatedReservation);

        try {
            // Gọi API để cập nhật phiếu đặt phòng với giá trị mới của statusCheckin
            await authAPI().patch(endpoints['update_reservation'](updatedReservation.id), updatedReservation);

            // Làm mới danh sách phiếu đặt phòng sau khi cập nhật
            const response = await authAPI().get(endpoints['list_reservations']);

            console.log("Kết quả cập nhật", response.data)
            setReservations(response.data);
        } catch (error) {
            setError('Failed to update reservation');
        } finally {
            handleClose();
        }
    };


    const handleDelete = async () => {
        if (!selectedReservation) return;
    
        // Hiển thị hộp thoại xác nhận
        const confirmed = window.confirm('Bạn có chắc chắn muốn xóa phiếu đặt phòng này?');
    
        if (confirmed) {
            try {
                // Gọi API để vô hiệu hóa phiếu đặt phòng
                await authAPI().patch(endpoints['deactivate_reservation'](selectedReservation.id));
    
                // Làm mới danh sách phiếu đặt phòng sau khi vô hiệu hóa
                const response = await authAPI().get(endpoints['list_reservations']);
                setReservations(response.data);
            } catch (error) {
                setError('Failed to deactivate reservation');
            } finally {
                handleClose();
            }
        }
    };
    


    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await authAPI().get(endpoints['list_reservations']);
                setReservations(response.data);
            } catch (err) {
                setError('Failed to fetch reservations');
            } finally {
                setLoading(false);
            }
        };

        fetchReservations();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

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
                            <td>{reservation.room.map(r => r.nameRoom).join(', ')}</td>
                            <td>{reservation.bookDate}</td>
                            <td>{reservation.checkin}</td>
                            <td>{reservation.checkout}</td>
                            <td>{reservation.statusCheckin ? 'Đã đặt' : 'Chưa đặt'}</td>
                            <td>
                                <Button variant="primary" onClick={() => handleShow(reservation)}>Sửa</Button>
                                {/* <Button variant="danger" onClick={() => handleDelete(reservation)}>Xóa</Button> */}
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
                handleUpdate={handleUpdate}
                handleDelete={handleDelete}
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
