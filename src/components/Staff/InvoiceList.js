/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const InvoiceList = () => {
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div css={styles}>
      <h1>Danh sách hóa đơn</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Guest</th>
            <th>Check-in</th>
            <th>Check-out</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Nguyen Van A</td>
            <td>01-08-2024</td>
            <td>05-08-2024</td>
            <td>3,000,000 VND</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Tran Thi B</td>
            <td>02-08-2024</td>
            <td>06-08-2024</td>
            <td>4,500,000 VND</td>
          </tr>
        </tbody>
      </table>

      <Button onClick={handleOpenModal}>Xem chi tiết hóa đơn</Button>

      <Modal show={showModal} onHide={handleCloseModal} dialogClassName="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>Invoice Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div css={formStyles}>
            <div className="form-group">
              <label>ID</label>
              <input type="text" value="1" readOnly />
            </div>
            <div className="form-group">
              <label>Guest</label>
              <input type="text" value="Nguyen Van A" readOnly />
            </div>
            <div className="form-group">
              <label>Check-in</label>
              <input type="text" value="01-08-2024 12:00:00" readOnly />
            </div>
            <div className="form-group">
              <label>Check-out</label>
              <input type="text" value="05-08-2024 12:00:00" readOnly />
            </div>
            <div className="form-group">
              <label>Total Amount</label>
              <input type="text" value="3,000,000 VND" readOnly />
            </div>
            <div className="form-group">
              <label>Services</label>
              <div css={serviceStyle}>
                <p>Room Service: 500,000 VND x 1</p>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const styles = css`
  padding: 120px;
  background-color: #f4f4f4;

  h1 {
    margin-bottom: 20px;
    color: #333;
  }

  table {
    width: 100%;
    border-collapse: collapse;

    th, td {
      padding: 10px;
      border: 1px solid #ddd;
      text-align: left;
    }

    th {
      background-color: #f2f2f2;
    }

    tr:nth-child(even) {
      background-color: #f9f9f9;
    }

    tr:hover {
      background-color: #ddd;
    }
  }

  button {
    background: #007bff;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 3px;
    cursor: pointer;
    font-size: 14px;

    &:hover {
      background: #0056b3;
    }
  }
`;

const formStyles = css`
  display: flex;
  flex-wrap: wrap;
  padding: 10px;

  .form-group {
    flex: 1 1 50%;
    padding: 10px;
  }

  input {
    width: 100%;
    padding: 8px;
    margin: 5px 0;
    border: 1px solid #ddd;
    border-radius: 3px;
  }
`;

const serviceStyle = css`
  background-color: #f9f9f9;
  padding: 10px;
  margin: 5px 0;
  border-radius: 5px;
  border: 1px solid #ddd;
  display: flex;
  justify-content: space-between;
`;

export default InvoiceList;
