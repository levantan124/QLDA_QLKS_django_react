import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
    const [username, setUsername] = useState(''); // Khởi tạo biến state cho username
    const [password, setPassword] = useState(''); // Khởi tạo biến state cho password
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const nav = useNavigate();

    const handleLoginError = () => {
        setError("Sai tên đăng nhập hoặc mật khẩu");
    };

    const login = () => {
        setLoading(true);
        console.log("Tên đăng nhập:", username);
        console.log("Mật khẩu:", password);

        // Mô phỏng đăng nhập với dữ liệu ảo
        if (username === 'admin' && password === '123456') {
            console.log("Đăng nhập thành công!");
            setLoading(false);
            nav("/");
        } else {
            handleLoginError();
            setLoading(false);
        }
    };

    const register = () => {
        nav("/signup");
    };

    return (
        <Container
            fluid
            className="d-flex justify-content-center align-items-center"
            style={{
                height: '100vh',
                backgroundImage: 'url("https://cache.marriott.com/marriottassets/marriott/BOMSA/bomsa-exterior-0023-hor-feat.jpg")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            <Row className="justify-content-md-center" style={{ width: '100%' }}>
                <div className="card p-4 shadow bg-white rounded" style={{ maxWidth: '500px', width: '100%' }}>
                    <Form>
                        <h1 className="text-center mb-4">Đăng nhập</h1>
                        <Form.Group controlId="formBasicEmail" style={{ marginBottom: '20px' }}>
                            <Form.Control
                                type="text"
                                placeholder="Nhập tên đăng nhập"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formBasicPassword" style={{ marginBottom: '20px' }}>
                            <Form.Control
                                type="password"
                                placeholder="Nhập mật khẩu"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formBasicCheckbox" className="d-flex justify-content-between align-items-center" style={{ marginBottom: '20px' }}>
                            <Form.Check type="checkbox" label="Nhớ tài khoản" />
                            <Button variant="link" onClick={() => { /* Xử lý quên mật khẩu */ }}>
                                Quên mật khẩu
                            </Button>
                        </Form.Group>

                        <Button variant="primary" type="button" className="w-100" onClick={login}>
                            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </Button>

                        {error && <p className="text-danger mt-3 text-center">{error}</p>}

                        <div className="text-center mt-3">
                            <a href="#" onClick={register} style={{ color: '#6c757d', textDecoration: 'underline', cursor: 'pointer' }}>
                                Quên tài khoản? Đăng ký
                            </a>
                        </div>
                    </Form>
                </div>
            </Row>
        </Container>
    );
}

export default Login;
