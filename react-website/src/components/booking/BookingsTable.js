import { parseISO } from "date-fns";
import React, { useState, useEffect } from "react";
import DateSlider from "../common/DateSlider";

const BookingsTable = ({ bookingInfo, handleBookingCancellation }) => {
    const [filteredBookings, setFilteredBookings] = useState(bookingInfo);

    const filterBookings = (startDate, endDate) => {
        let filtered = bookingInfo;
        if (startDate && endDate) {
            filtered = bookingInfo.filter((booking) => {
                const bookingStartDate = parseISO(booking.checkInDate);
                const bookingEndDate = parseISO(booking.checkOutDate);
                return (
                    bookingStartDate >= startDate &&
                    bookingEndDate <= endDate &&
                    bookingEndDate > startDate
                );
            });
        }
        setFilteredBookings(filtered);
    };

    useEffect(() => {
        setFilteredBookings(bookingInfo);
    }, [bookingInfo]);

    return (
        <section className="bookings-table-container">
            <DateSlider onDateChange={filterBookings} onFilterChange={filterBookings} />
            <div className="table-responsive">
                <table className="table table-striped table-bordered">
                    <thead>
                        <tr>
                            <th>S/N</th>
                            <th>Booking ID</th>
                            <th>Room ID</th>
                            <th>Room Type</th>
                            <th>Check-In Date</th>
                            <th>Check-Out Date</th>
                            <th>Guest Name</th>
                            <th>Guest Email</th>
                            {/* <th>Adults</th> */}
                            {/* <th>Children</th> */}
                            {/* <th>Total Guest</th> */}
                            {/* <th>Confirmation Code</th> */}
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBookings.map((booking, index) => (
                            <tr key={booking.id}>
                                <td>{index + 1}</td>
                                <td>{booking.id}</td>
                                <td>{booking.room.map(r => r.nameRoom).join(', ')}</td>
                                <td>{booking.room.map(r => r.roomType.nameRoomType).join(', ')}</td>
                                <td>{booking.checkin}</td>
                                <td>{booking.checkout}</td>
                                <td>{booking.guest.name}</td>
                                <td>{booking.guest.email}</td>
                                {/* <td>{booking.numOfAdults}</td> */}
                                {/* <td>{booking.numOfChildren}</td> */}
                                {/* <td>{booking.totalNumOfGuests}</td> */}
                                {/* <td>{booking.bookingConfirmationCode}</td> */}
                                <td>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleBookingCancellation(booking.id)}
                                    >
                                        Cancel
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredBookings.length === 0 && (
                    <p className="no-booking-message">No bookings found for the selected dates</p>
                )}
            </div>
        </section>
    );
};

export default BookingsTable;
