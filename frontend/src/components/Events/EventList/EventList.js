import React, { useMemo } from 'react';
import "./EventList.css";
import EventItem from './EventItem/EventItem';

const EventList = ({events, authUserId, onDetailsClick}) => {

    const eventsList = useMemo(() => {
        return events.map((event) => (            
            <EventItem 
                key={event._id} 
                eventId={event._id} 
                title={event.title} 
                authUserId={authUserId} 
                creatorId={event.creator._id} 
                price={event.price} 
                date={event.date}
                onDetailsClick={onDetailsClick}
            />
        ))
    }, [events, authUserId, onDetailsClick]);

  return (
    <ul className="events__list">{eventsList}</ul>
  )
}

export default EventList