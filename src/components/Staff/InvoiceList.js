/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import { useState, useEffect } from 'react';
import { authAPI, endpoints } from '../../configs/APIs';
import moment from 'moment';
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const InvoiceList = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await authAPI().get(endpoints['bills']);
        setBills(response.data);
      } catch (err) {
        setError('Failed to fetch bills');
      } finally {
        setLoading(false);
      }
    };

    fetchBills();
  }, []);

  const handleOpenModal = async (invoiceId) => {
    try {
      const response = await authAPI().get(`${endpoints['bills']}${invoiceId}/`);
      setSelectedInvoice(response.data);

      // Fetch associated services
      const servicesResponse = await authAPI().get(endpoints.services_of_invoice(invoiceId));
      setServices(servicesResponse.data);

      setShowModal(true);
    } catch (err) {
      setError('Failed to fetch invoice details');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedInvoice(null);
    setServices([]);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const calculateRoomCost = () => {
    const checkinDate = moment(selectedInvoice?.reservation.checkin);
    const checkoutDate = moment(selectedInvoice?.reservation.checkout);
    const numberOfDays = checkoutDate.diff(checkinDate, 'days');
    return selectedInvoice?.reservation.room.reduce((total, room) => total + room.price * numberOfDays, 0) || 0;
  };

  const calculateServiceCost = () => {
    return services.reduce((total, service) => total + service.price * service.quantity, 0);
  };

  const totalCost = calculateRoomCost() + calculateServiceCost();

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
          {bills.map((bill) => (
            <tr key={bill.id}>
              <td>{bill.id}</td>
              <td>{bill.reservation.guest}</td>
              <td>{new Date(bill.reservation.checkin).toLocaleDateString()}</td>
              <td>{new Date(bill.reservation.checkout).toLocaleDateString()}</td>
              <td>{bill.totalAmount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedInvoice && (
        <Modal show={showModal} onHide={handleCloseModal} dialogClassName="custom-modal">
          <Modal.Header closeButton>
            <Modal.Title>Invoice Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div css={formStyles}>
              <div className="form-group">
                <label>ID</label>
                <input type="text" value={selectedInvoice.id} readOnly />
              </div>
              <div className="form-group">
                <label>Guest</label>
                <input type="text" value={selectedInvoice.reservation.guest} readOnly />
              </div>
              <div className="form-group">
                <label>Check-in</label>
                <input type="text" value={moment(selectedInvoice.reservation.checkin).format('DD-MM-YYYY HH:mm:ss')} readOnly />
              </div>
              <div className="form-group">
                <label>Check-out</label>
                <input type="text" value={moment(selectedInvoice.reservation.checkout).format('DD-MM-YYYY HH:mm:ss')} readOnly />
              </div>
              <div className="form-group">
                <label>Total Amount</label>
                <input type="text" value={`${totalCost.toLocaleString()} VND`} readOnly />
              </div>
              <div className="form-group">
                <label>Services</label>
                {services.length ? (
                  services.map(service => (
                    <div key={service.id} css={serviceStyle}>
                      <p>{service.nameService}: {service.price.toLocaleString()} VND x {service.quantity}</p>
                    </div>
                  ))
                ) : (
                  <p>No services included.</p>
                )}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}
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
