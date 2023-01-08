import React from 'react';
import "./BookingsControls.css"

const BookingsControls = ({changeOutput, activeOutputType}) => {
  return (
    <div className="bookings-control">
        <button className={activeOutputType === 'list' ? 'active' : ''} onClick={() => changeOutput('list')}>List</button>
        <button  className={activeOutputType === 'chart' ? 'active' : ''} onClick={() => changeOutput('chart')}>Chart</button>
    </div>
  )
}

export default BookingsControls;
