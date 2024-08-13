import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Modal } from 'react-bootstrap';
import APIs, { endpoints } from '../../configs/APIs';

const Signup = (history) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [DOB, setDOB] = useState('');
    const [Address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [sex, setSex] = useState(2); // Default to 'Nam'
    const [role, setRole] = useState(3); // Default to 'Khách hàng'
    const [error, setError] = useState('');
    const nav = useNavigate();
    const [showSuccessModal, setShowSuccessModal] = useState(false);


    const closeModal = async () => {
        setShowSuccessModal(false);
        nav('/login');
    }

    const handleSignup = async () => {
        try {

            // Kiểm tra các trường bắt buộc
            if (!username || !password || !name || !email || !phone || !DOB || !Address) {
                setError('Vui lòng điền đầy đủ thông tin.');
                return;
            }

            if (!avatar) {
                setError('Vui lòng chọn ảnh đại diện.');
                return;
            }

            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);
            formData.append('name', name);
            if (avatar) {
                formData.append('avatar', avatar);
            }
            formData.append('DOB', DOB);
            formData.append('Address', Address);
            formData.append('phone', phone);
            formData.append('email', email);
            formData.append('sex', sex);
            formData.append('role', role);


            // Hiển thị các thông tin đã có trong form lên console
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }
            let response = await APIs.post(endpoints['signup'], formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log('User registered successfully:', response.data);
            if (response.status === 201) {
                console.error('Tạo tài khoản thành công!');
                setShowSuccessModal(true); // Hiển thị modal thông báo
                // nav("/d");
            }
        } catch (error) {
            console.error('Error while Signupg up:', error);
            setError('Đăng ký không thành công. Vui lòng thử lại.');
        }
    };

    return (
        <Container fluid className="d-flex justify-content-center align-items-center "
            style={{
                minHeight: '100vh',
                backgroundColor: '#f0f2f5',
                backgroundImage: 'url("https://cache.marriott.com/marriottassets/marriott/BOMSA/bomsa-exterior-0023-hor-feat.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                padding :'200px',
                
            }}>
            <Row className="justify-content-center">
                <Col md="6" lg="6" style={{ width: 'calc(100% + 100px)' }}>
                    <div className="card p-4 shadow bg-white rounded" style={{ borderRadius: '8px', padding: '80px' }}>
                        <Form>
                            <h1 className="text-center mb-4" style={{ color: '#1877f2' }}>Đăng ký</h1>

                            <Row>
                                <Col md="6">
                                    <Form.Group controlId="formBasicUsername">
                                        <Form.Control
                                            type="text"
                                            placeholder="Tên đăng nhập"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                            style={{ borderRadius: '4px', marginBottom: '30px' }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md="6">
                                    <Form.Group controlId="formBasicPassword">
                                        <Form.Control
                                            type="password"
                                            placeholder="Mật khẩu"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            style={{ borderRadius: '4px', marginBottom: '30px' }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md="6">
                                    <Form.Group controlId="formBasicName">
                                        <Form.Control
                                            type="text"
                                            placeholder="Họ và tên"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            style={{ borderRadius: '4px', marginBottom: '30px' }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md="6">
                                    <Form.Group controlId="formBasicAvatar">

                                        <Form.Control
                                            type="file"
                                            placeholder="Avatar"
                                            onChange={(e) => setAvatar(e.target.files[0])}
                                            style={{ borderRadius: '4px', marginBottom: '30px' }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md="6">
                                    <Form.Group controlId="formBasicDOB">
                                        <Form.Control
                                            type="date"
                                            value={DOB}
                                            onChange={(e) => setDOB(e.target.value)}
                                            style={{ borderRadius: '4px', marginBottom: '30px' }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md="6">
                                    <Form.Group controlId="formBasicAddress">
                                        <Form.Control
                                            type="text"
                                            placeholder="Địa chỉ"
                                            value={Address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            style={{ borderRadius: '4px', marginBottom: '30px' }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md="6">
                                    <Form.Group controlId="formBasicPhone">
                                        <Form.Control
                                            type="text"
                                            placeholder="Số điện thoại"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            style={{ borderRadius: '4px', marginBottom: '30px' }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md="6">
                                    <Form.Group controlId="formBasicEmail">
                                        <Form.Control
                                            type="email"
                                            placeholder="Email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            style={{ borderRadius: '4px', marginBottom: '30px' }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Form.Group controlId="formBasicSex">
                                <Form.Control
                                    as="select"
                                    placeholder="Giới tính"
                                    value={sex}
                                    onChange={(e) => setSex(e.target.value)}
                                    style={{ borderRadius: '4px', marginBottom: '30px' }}
                                >
                                    <option value={1}>Nam</option>
                                    <option value={2}>Nữ</option>
                                </Form.Control>
                            </Form.Group>

                            {error && <div className="text-danger">{error}</div>}

                            <Button variant="primary" type="button" className="w-100 mt-3" onClick={handleSignup} style={{ borderRadius: '4px', backgroundColor: '#1877f2', border: 'none', padding: '10px 0' }}>
                                Đăng ký
                            </Button>

                            <div className="text-center mt-3">
                                <p>Đã có tài khoản? <Link to="/login">Đăng nhập</Link></p>
                            </div>
                        </Form>
                    </div>
                </Col>
            </Row>
            <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Đăng ký thành công</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Tài khoản của bạn đã được tạo thành công. Bạn có thể đăng nhập ngay bây giờ.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => closeModal()}>
                        Đóng
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>


    );
};


export default Signup;
