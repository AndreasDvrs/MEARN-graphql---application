import React, { useMemo } from 'react';
import "./EventItem.css";

const EventItem = ({
    eventId,
    title, 
    authUserId, 
    creatorId, 
    price, 
    date,
    onDetailsClick
}) => {

    const userDate = useMemo(() => {
        return new Date(date).toLocaleDateString();
    }, [date])

  return (
    <li className="events__list-item">
        <div>
            <h1>{title}</h1> 
            <h2>${price} - {userDate}</h2>
       </div>
       <div>
            {authUserId !== creatorId
                ?   <button className="btn" onClick={() => onDetailsClick(eventId)}>View Details</button>
                :   <p>You are the owner of this event</p>
            }
       </div>
    </li>
  )
}

export default EventItem;
