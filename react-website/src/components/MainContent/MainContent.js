/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { useState, useEffect, useContext } from 'react';
import {  useNavigate } from "react-router-dom"
import RoomCard from './RoomCard';
import cookie from "react-cookies";
import { MyDispatchContext } from '../../configs/MyContext';
import { endpoints, authAPI } from "../../configs/APIs";

const MainContent = () => {
    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate();
    const dispatch = useContext(MyDispatchContext);
    useEffect(() => {
        const fetchData = async () => {
            const queryParams = new URLSearchParams(window.location.search);
            const token = queryParams.get("token");
			const expires = new Date();
			expires.setDate(expires.getDate() + 7); // Token expires in 7 days
            if (token) {
                // Lưu token vào cookie với thời gian sống (expires) và đường dẫn (path)
				cookie.save("token", token);

                try {
                    // Yêu cầu thông tin người dùng từ API
                    let userdata = await authAPI(token).get(endpoints['current_user']);

                    // Lưu thông tin người dùng vào cookie
                    cookie.save('user', userdata.data);
                    // Cập nhật trạng thái người dùng trong Redux store
                    dispatch({
                        type: "login",
                        payload: userdata.data
                    });
                } catch (error) {
                    console.error("Lỗi khi lấy thông tin người dùng:", error);
                }

                // queryParams.delete("token");
                window.history.replaceState(null, null, window.location.pathname);
            } 
            navigate("/");
        };

        fetchData();
    }, [navigate, dispatch]);
    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await authAPI().get(endpoints.roomtypes);
                setRooms(response.data);
                return response.data
            } catch (error) {
                console.error("Failed to fetch rooms:", error);
            }
        };

        fetchRooms();
    }, []);

    return (
        <div css={styles}>
            <div className="hotel-list">
                <h2>Danh sách khách sạn</h2>
                {rooms.length > 0 ? (
                    <div className="room-cards">
                        {rooms.map((room) => (
                            <RoomCard key={room.id} room={room} />
                        ))}
                    </div>
                ) : (
                    <p>Chưa có kết quả tìm kiếm</p>
                )}
            </div>
        </div>
    );
};

const styles = css`
    margin-top: 100px; /* Khoảng cách giữa MainContent và Navbar */
    padding: 20px; /* Để nội dung bên trong không bị sát vào viền */

    .hotel-list {
        background-color: #fff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .room-cards {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
    }
`;

export default MainContent;