/** @jsx jsx */
import { jsx, css } from "@emotion/react";
import { useContext, useState, useEffect } from "react";
import { MyUserContext, MyDispatchContext } from "../../configs/MyContext";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert'; // Import Alert component from react-bootstrap
import { FaCamera } from 'react-icons/fa'; // Import camera icon from react-icons
import cookie from "react-cookies";
import { authAPI, endpoints } from "../../configs/APIs";

const Info = () => {
    const dispatch = useContext(MyDispatchContext);
    const user = useContext(MyUserContext);

    const [editableUser, setEditableUser] = useState({
        name: user?.name || '',
        address: user?.Address || '',
        phone: user?.phone || '',
        dob: user?.DOB || '',
        sex: user?.sex === 1 ? 'male' : user?.sex === 2 ? 'female' : '', // Chuyển đổi giới tính từ API
    });

    const [changedFields, setChangedFields] = useState(new Set());
    const [avatarFile, setAvatarFile] = useState(null); // State để quản lý tệp avatar đã chọn
    const [notification, setNotification] = useState({ type: '', message: '' }); // State cho thông báo

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditableUser(prev => {
            setChangedFields(prevChanged => new Set(prevChanged).add(name));
            return { ...prev, [name]: value };
        });
    };

    const handleChooseAvatar = (e) => {
        const file = e.target.files[0];
        setAvatarFile(file);
        setChangedFields(prevChanged => new Set(prevChanged).add('avatar'));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            changedFields.forEach(field => {
                if (field === 'avatar' && avatarFile) {
                    formData.append('avatar', avatarFile);
                } else if (field === 'sex') {
                    formData.append(field, editableUser.sex === 'male' ? 1 : editableUser.sex === 'female' ? 2 : ''); // Chuyển đổi giới tính trước khi gửi
                } else if (field in editableUser) {
                    formData.append(field, editableUser[field]);
                }
            });

            const res = await authAPI().patch(endpoints.patch_current_user, formData, {
                headers: {
                    'Content-Type': 'application/form-data'
                }
            });

            if (res.status === 200) {
                console.log('Cập nhật thông tin người dùng thành công:');
                setChangedFields(new Set()); // Xóa các trường đã thay đổi
                let userdata = await authAPI().get(endpoints.current_user);
                cookie.save('user', userdata.data);

                dispatch({
                    type: "login",
                    payload: userdata.data
                });

                setNotification({ type: 'success', message: 'Cập nhật thông tin thành công' }); // Thiết lập thông báo thành công
            } else {
                console.error('Cập nhật thông tin người dùng không thành công:');
                setNotification({ type: 'error', message: 'Cập nhật không thành công' }); // Thiết lập thông báo lỗi
            }
        } catch (error) {
            console.error('Lỗi cập nhật thông tin người dùng:', error);
            setNotification({ type: 'error', message: 'Cập nhật không thành công' }); // Thiết lập thông báo lỗi
        }
    };

    if (!user) {
        return <p>Vui lòng đăng nhập để xem thông tin của bạn.</p>;
    }

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
                        src={avatarFile ? URL.createObjectURL(avatarFile) : user.avatar || 'placeholder-image-url'}
                        alt={`${user.name}'s avatar`}
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
                        value={user.username}
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
                        <option value="">Chọn giới tính</option>
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                        <option value="other">Khác</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label><strong>Email:</strong></Form.Label>
                    <Form.Control
                        type="email"
                        value={user.email}
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