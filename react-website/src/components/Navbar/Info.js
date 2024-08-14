/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { useState } from "react";
import { FaCamera } from 'react-icons/fa';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

const Info = () => {
    const fakeUser = {
        name: 'Nguyen Van A',
        username: 'nguyenvana',
        address: '123 Đường ABC, Thành phố XYZ',
        phone: '0123456789',
        dob: '1990-01-01',
        sex: 'male',
        email: 'nguyenvana@example.com',
        avatar: 'https://via.placeholder.com/150' // URL của hình ảnh avatar
    };

    const [editableUser, setEditableUser] = useState({
        name: fakeUser.name,
        address: fakeUser.address,
        phone: fakeUser.phone,
        dob: fakeUser.dob,
        sex: fakeUser.sex,
    });

    const [avatarFile, setAvatarFile] = useState(null); // State để quản lý tệp avatar đã chọn
    const [notification, setNotification] = useState({ type: '', message: '' }); // State cho thông báo

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditableUser(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleChooseAvatar = (e) => {
        const file = e.target.files[0];
        setAvatarFile(file);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Giả lập việc cập nhật thông tin người dùng
        setNotification({ type: 'success', message: 'Cập nhật thông tin thành công' });
    };

    return (
        <div css={styles.container}>
            <h1>Thông tin cá nhân</h1>
            {notification.message && (
                <Alert variant={notification.type === 'success' ? 'success' : 'danger'}>
                    {notification.message}
                </Alert>
            )}
            <div css={styles.avatarSection}>
                <div css={styles.avatarContainer}>
                    <img
                        src={avatarFile ? URL.createObjectURL(avatarFile) : fakeUser.avatar}
                        alt={`${editableUser.name}'s avatar`}
                        css={styles.avatar}
                    />
                    <div css={styles.cameraOverlay}>
                        <FaCamera />
                        <input
                            type="file"
                            name="avatar"
                            onChange={handleChooseAvatar}
                            css={styles.fileInput}
                        />
                    </div>
                </div>
            </div>
            <Form css={styles.infoSection} onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label><strong>Tên:</strong></Form.Label>
                    <Form.Control
                        type="text"
                        name="name"
                        value={editableUser.name}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label><strong>Tên đăng nhập:</strong></Form.Label>
                    <Form.Control
                        type="text"
                        value={fakeUser.username}
                        readOnly
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label><strong>Địa chỉ:</strong></Form.Label>
                    <Form.Control
                        type="text"
                        name="address"
                        value={editableUser.address}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label><strong>Số điện thoại:</strong></Form.Label>
                    <Form.Control
                        type="text"
                        name="phone"
                        value={editableUser.phone}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label><strong>Ngày sinh:</strong></Form.Label>
                    <Form.Control
                        type="date"
                        name="dob"
                        value={editableUser.dob}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label><strong>Giới tính:</strong></Form.Label>
                    <Form.Control
                        as="select"
                        name="sex"
                        value={editableUser.sex}
                        onChange={handleChange}
                    >
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                        <option value="other">Khác</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label><strong>Email:</strong></Form.Label>
                    <Form.Control
                        type="email"
                        value={fakeUser.email}
                        readOnly
                    />
                </Form.Group>
                <Button type="submit" variant="primary">Cập nhật thông tin</Button>
            </Form>
        </div>
    );
};

const styles = {
    container: css`
        max-width: 800px;
        margin: 20px auto;
        padding: 20px;
        padding-top: 100px; /* Điều chỉnh dựa trên chiều cao của thanh điều hướng */
        background: #f9f9f9;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    `,
    avatarSection: css`
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
    `,
    avatarContainer: css`
        position: relative;
        width: 150px;
        height: 150px;
    `,
    avatar: css`
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
    `,
    cameraOverlay: css`
        position: absolute;
        bottom: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.6);
        color: #fff;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    `,
    fileInput: css`
        opacity: 0;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        cursor: pointer;
    `,
    infoSection: css`
        p {
            font-size: 18px;
            margin: 10px 0;
            strong {
                color: #333;
            }
        }
    `
};

export default Info;
