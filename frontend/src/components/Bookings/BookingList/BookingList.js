import React from "react";
import "./BookingList.css";

const BookingList = ({ bookings, onDelete }) => {
  return (
    <ul className="bookings__list">
        {bookings.map((booking) => {
            return (
                <li key={booking._id} className="bookings__item">
                    <div className="bookings__item-data">
                        {booking.event.title} - {new Date (booking.createdAt).toLocaleString()}
                    </div>
                    <div className="bookints__item-actions">
                        <button className="btn" onClick={(e) => onDelete(booking._id)}>Cancel</button>
                    </div>
                </li>
            )
        })}
    </ul>
  )
}

export default BookingList;
