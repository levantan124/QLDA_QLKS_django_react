/** @jsx jsx */
import { useEffect, useState } from 'react';
import { css, jsx } from '@emotion/react';
import { authAPI, endpoints } from '../../configs/APIs';

const CustomerReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await authAPI().get(endpoints['customer_reservations']);
        setReservations(response.data);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);

  if (loading) {
    return <div css={styles.loading}>Loading...</div>;
  }

  return (
    <div css={styles.container}>
      <h2>Phiếu của tôi</h2>
      {reservations.length > 0 ? (
        <ul css={styles.reservationList}>
          {reservations.map((reservation) => (
            <li key={reservation.id} css={styles.reservationItem}>
              <p><strong css={styles.roomName}>Tên phòng:</strong> {reservation.room.map(room => room.nameRoom).join(', ')}</p>
              <p><strong>Ngày nhận phòng:</strong> {new Date(reservation.checkin).toLocaleString()}</p>
              <p><strong>Ngày trả phòng:</strong> {new Date(reservation.checkout).toLocaleString()}</p>
              <p><strong>Trạng thái:</strong> {reservation.statusCheckin ? 'Đã đặt' : 'Chưa đặt'}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reservations found.</p>
      )}
    </div>
  );
};

const styles = {
  container: css`
    padding-top: 140px;
    max-width: 800px;
    margin: 0 auto;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    h2 {
      margin-bottom: 20px;
      font-size: 24px;
      color: #333;
    }
  `,
  loading: css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-size: 24px;
    color: #333;
  `,
  reservationList: css`
    list-style-type: none;
    padding: 0;
  `,
  reservationItem: css`
    margin-bottom: 15px;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    p {
      margin: 5px 0;
      color: #555;
      font-size: 16px;
    }
    strong {
      color: #333;
    }
  `,
  roomName: css`
    color: #007BFF; /* Change this color to whatever you prefer */
  `,
};

export default CustomerReservations;
