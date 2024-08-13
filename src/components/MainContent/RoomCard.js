/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { useState, useContext } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { MyUserContext } from '../../configs/MyContext';
import { authAPI, endpoints } from '../../configs/APIs';

const RoomCard = ({ room }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [checkinDate, setCheckinDate] = useState('');
    const [numNights, setNumNights] = useState(1);
    const [notification, setNotification] = useState(null); // Thêm trạng thái thông báo
    const user = useContext(MyUserContext);

    const handleBookRoom = async () => {
        if (!user) {
            setNotification({
                type: 'error',
                message: 'Bạn cần đăng nhập để đặt phòng.'
            });
            return;
        }

        const checkoutDate = calculateCheckoutDate();
        const bookingData = {
            guest: user.username,
            room: [
                {
                    roomType: room.nameRoomType,
                    status: 1,
                    active: true
                }
            ],
            bookDate: new Date().toISOString(),
            checkin: checkinDate,
            checkout: checkoutDate
        };
        console.log('Booking Data:', bookingData); // Thêm log này để kiểm tra dữ liệu gửi lên
        try {
            const response = await authAPI().post(endpoints['list_reservations'], bookingData);

            if (response.status === 201) {
                console.log('Đặt phòng thành công:', response.data); // Log phản hồi đặt phòng thành công
                setNotification({
                    type: 'success',
                    message: 'Đặt phòng thành công.'
                });
            } else if (response.status === 400 || response.data.error === 'Out of stock') {
                console.log('Tạm thời hết phòng loại này.'); // Log thông báo hết phòng
                setNotification({
                    type: 'warning',
                    message: 'Tạm thời hết phòng loại này.'
                });
            } else {
                console.log(response.status)
                console.log('Đặt phòng không thành công. Trạng thái:', response.status);
                setNotification({
                    type: 'error',
                    message: 'Đặt phòng không thành công.'
                });
            }
            setModalIsOpen(false);
        } catch (error) {
            
            setNotification({
                type: 'error',
                message: 'Đặt phòng không thành công.'
            });
            console.error('Đặt phòng không thành công:', error);
        }

        
    };

    const handleNumNightsChange = (e) => {
        const nights = parseInt(e.target.value, 10);
        setNumNights(nights);
    };

    const calculateCheckoutDate = () => {
        if (!checkinDate) return '';  // Trả về chuỗi rỗng nếu checkinDate chưa được đặt

        const startDate = new Date(checkinDate);
        if (isNaN(startDate)) return '';  // Trả về chuỗi rỗng nếu startDate không hợp lệ

        const checkoutDate = new Date(startDate);
        checkoutDate.setDate(startDate.getDate() + numNights);

        return checkoutDate.toISOString().split('T')[0];  // Trả về chuỗi ngày đã định dạng
    };

    return (
        <div css={styles}>
            <img src={room.image} alt={room.nameRoom} />
            <div className="room-details">
                <p>Loại phòng: {room.nameRoomType}</p>
                <p>Giá phòng: {room.price} / đêm</p>
                <p>Số lượng người: {room.quantity} tối đa</p>
                <Button variant="primary" onClick={() => setModalIsOpen(true)}>
                    Đặt phòng
                </Button>
            </div>

            <Modal show={modalIsOpen} onHide={() => setModalIsOpen(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Chọn ngày check-in và số đêm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group controlId="checkinDate">
                        <Form.Label>Ngày check-in</Form.Label>
                        <Form.Control
                            type="date"
                            value={checkinDate}
                            onChange={(e) => setCheckinDate(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="numNights">
                        <Form.Label>Số đêm</Form.Label>
                        <Form.Control
                            type="number"
                            value={numNights}
                            onChange={handleNumNightsChange}
                        />
                    </Form.Group>
                    <p>Ngày check-out dự kiến: {checkinDate && calculateCheckoutDate()}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setModalIsOpen(false)}>
                        Đóng
                    </Button>
                    <Button variant="primary" onClick={handleBookRoom}>
                        Đặt phòng
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal thông báo */}
            {notification && (
                <Modal show={true} onHide={() => setNotification(null)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{notification.type === 'error' ? 'Lỗi' : 'Thông báo'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>{notification.message}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setNotification(null)}>
                            Đóng
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </div>
    );
};

const styles = css`
    background-color: #ffffff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    img {
        width: 100%;
        height: 300px;
        object-fit: cover;
        border-radius: 8px;
    }

    .room-details {
        margin-top: 12px;

        p {
            margin-bottom: 4px;
            font-size: 14px;
            color: #666666;
        }
    }
`;

export default RoomCard;
