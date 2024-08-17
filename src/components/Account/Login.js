import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row } from 'react-bootstrap';
import APIs, { endpoints, authAPI } from "../../configs/APIs";
import cookie from "react-cookies";
import { MyDispatchContext} from '../../configs/MyContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
    const [username, setUsername] = useState(''); // Khởi tạo biến state cho username
    const [password, setPassword] = useState(''); // Khởi tạo biến state cho password
    const dispatch = useContext(MyDispatchContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const nav = useNavigate();

    const handleLoginError = (errorStatus) => {
        switch (errorStatus) {
            case 400:
                setError("Sai tên đăng nhập hoặc mật khẩu");
                break;
            // Xử lý các trường hợp lỗi khác nếu cần
            default:
                setError("Đăng nhập không thành công");
                break;
        }
    };

    const login = async () => {
        console.log(username); // Log username ra console để kiểm tra
        console.log(password); // Log password ra console để kiểm tra
        setError("Sai tên đăng nhập hoặc mật khẩu");
        setLoading(true);

        try {
            let res = await APIs.post(endpoints['login'], {
                'username': username,
                'password': password,
                'client_id': "4yP3PGE63tJTbxLfg19gUGgnvFeyr7oOdbEoiqk6",
                'client_secret': "dKzh5B6Q4QkebcpWczA2uJr6Ym9pzg1L4vTlzsGPuuys1TH9NVloX6qzvTClJgzJsYrGz62sryoboW1ildwapaKdEFh9OgNb95Od0iIeR0UKR1qyYam5wmdPBIEa8fF4",
                'grant_type': "password",
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log(res.status)
            if (res.status === 200) {
                cookie.save("token", res.data.access_token);
                console.log(cookie.load("token"))
                nav("/")
                console.log("Đăng nhập thành công!");
                console.info(res.data);
                let userdata = await authAPI().get(endpoints['current_user']);
                cookie.save('user', userdata.data);
                console.info(userdata.data)
                dispatch({
                    "type": "login",
                    "payload": userdata.data
                });
            }
            else {
                handleLoginError(res.status); // Gọi hàm handleLoginError khi có lỗi
                console.error("Đăng nhập không thành công:", res);
            }
        } catch (ex) {
            console.error("Lỗi tại màn hình đăng nhập:", ex);
            setError("Sai tên hoặc mật khẩu, vui lòng thử lại.");
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
                            Đăng nhập
                        </Button>

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
