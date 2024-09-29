import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../utils/ApiFunctions'; 
import Cookies from 'react-cookies';

const PaymentResult = () => {
    const location = useLocation();

    const [paymentResult, setPaymentResult] = useState(null);
    const csrftoken = Cookies.load('csrftoken');


    const updateBookingStatus = async (bookingId, status) => {
        try {
            await api.post(`/hotel/booking/${bookingId}/change-status/`, {
                payment_status: status
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken
                }
            });
        } catch (error) {
            console.error('Error updating booking status:', error);
        }
    };

    

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        
        const result = queryParams.get('vnp_TransactionStatus');

        if (result) {
            const isSuccess = result === '00';
            setPaymentResult({
                title: result === '00' ? "Payment Success" : "Payment Failure",
                result: result === '00' ? "Success" : "Failed",
                orderId: queryParams.get('vnp_TxnRef'),
                amount: queryParams.get('vnp_Amount'),
                orderDesc: queryParams.get('vnp_OrderInfo'),
                vnpTransactionNo: queryParams.get('vnp_TransactionNo'),
                vnpResponseCode: queryParams.get('vnp_ResponseCode'),
                msg: queryParams.get('vnp_Message') || "No message provided"
            });

            const bookingId = localStorage.getItem('bookingId');
            if (isSuccess && bookingId) {
                updateBookingStatus(bookingId, 'paid');
            }
        }
    }, [location.search]);

    return (
        <div className="payment-result-container">
            {paymentResult ? (
                <div>
                    <h3>{paymentResult.title}</h3>
                    <div className="payment-result-details">
                        <p><strong>Transaction Result:</strong> {paymentResult.result}</p>
                        <p><strong>Order ID:</strong> {paymentResult.orderId}</p>
                        <p><strong>Amount:</strong> {paymentResult.amount} VND</p>
                        <p><strong>Order Description:</strong> {paymentResult.orderDesc}</p>
                        <p><strong>VNPay Transaction No:</strong> {paymentResult.vnpTransactionNo}</p>
                        <p><strong>VNPay Response Code:</strong> {paymentResult.vnpResponseCode}</p>
                        <p><strong>Message:</strong> {paymentResult.msg}</p>
                    </div>
                </div>
            ) : (
                <p>Loading payment result...</p>
            )}
        </div>
    );
};

export default PaymentResult;
