import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Modal } from 'react-bootstrap';

const Signup = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [DOB, setDOB] = useState('');
    const [Address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [sex, setSex] = useState(2); // Default to 'Nam'
    const [error, setError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleSignup = () => {
        // Giả lập logic đăng ký thành công
        if (!username || !password || !name || !email || !phone || !DOB || !Address) {
            setError('Vui lòng điền đầy đủ thông tin.');
            return;
        }

        if (!avatar) {
            setError('Vui lòng chọn ảnh đại diện.');
            return;
        }

        // Giả lập thành công đăng ký
        console.log('Fake user registration:', {
            username,
            password,
            name,
            avatar,
            DOB,
            Address,
            phone,
            email,
            sex,
        });

        setShowSuccessModal(true); // Hiển thị modal thông báo
    };

    const closeModal = () => {
        setShowSuccessModal(false);
        // Giả lập điều hướng đến trang đăng nhập
        console.log('Redirect to login page');
    };

    return (
        <Container fluid className="d-flex justify-content-center align-items-center"
            style={{
                minHeight: '100vh',
                backgroundColor: '#f0f2f5',
                backgroundImage: 'url("https://cache.marriott.com/marriottassets/marriott/BOMSA/bomsa-exterior-0023-hor-feat.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                padding: '200px',
            }}>
            <Row className="justify-content-center">
                <Col md="6" lg="6">
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
