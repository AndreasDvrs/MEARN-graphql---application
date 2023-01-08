import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import Backdrop from "../components/Backdrop/Backdrop";
import EventList from "../components/Events/EventList/EventList";
import Modal from "../components/Modal/Modal";
import Spinner from "../components/Spinner/Spinner";
import AuthContext from "../context/auth-context";
import "./Events.css";

function EventsPage() {
    const [creating, setCreating] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const context = useContext(AuthContext);    

    const titleRef = useRef(null);
    const priceRef = useRef(null);
    const dateRef = useRef(null);
    const descriptionRef = useRef(null);

    const fetchEvents = useCallback( async () => {
        const requestBody = {
            query: `
                query {
                    events
                    {
                        _id, 
                        title, 
                        date, 
                        description, 
                        price, 
                        creator {
                            _id, 
                            email
                        }
                    }
                }
            `
        };
        const res = await fetch (
            'http://localhost:8080/graphql', {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json',
                    'AUTHORIZATION': `Bearer ${context.token}`
                }
            }
        );
        if (res.status !== 200 && res.status !== 201) {
            throw new Error('Failed!');
        }
        let data = await res.json();
        setEvents(data?.data?.events ?? []);
        setIsLoading(false)
    }, [context?.token])

    useEffect(() => {
        fetchEvents();
    }, [fetchEvents]);

    const onCreateEventClick = () => {
        setCreating(true);
    }

    const onCancel = () => {
        setCreating(false)
    }

    const onConfirm = async () => {
        try {
            setIsLoading(true);
            const title = titleRef.current?.value;
            const price = Number(priceRef.current?.value);
            const date = dateRef.current?.value;
            const description = descriptionRef.current?.value;
            if (!title?.trim() || price <=0 || !date?.trim() || !description?.trim()) {
                return;
            }
            const requestBody = {
                query: `
                    mutation CreateEvent($title: String!, $price: Float!, $date: String!, $description: String!) {
                        createEvent(eventInput: {title: $title, price: $price, date: $date, description: $description})
                        {
                            _id, 
                            title, 
                            date, 
                            description, 
                            price
                        }
                    }
                `,
                variables: {
                    title, price, date, description
                }
            };
            const res = await fetch (
                'http://localhost:8080/graphql', {
                    method: 'POST',
                    body: JSON.stringify(requestBody),
                    headers: {
                        'Content-Type': 'application/json',
                        'AUTHORIZATION': `Bearer ${context.token}`
                    }
                }
            );
            if (res.status !== 200 && res.status !== 201) {
                throw new Error('Failed!');
            }
            let actualData = await res.json();            
            setEvents([
                ...events,
                {_id: actualData.data.createEvent._id, title, price, date, description, creator: {_id: context.userId}}
            ])            
        } catch (error) {
            console.log(error);
        }
        setCreating(false);
        setIsLoading(false);
    }

    const onBookEvent = async () => {
        setIsLoading(true);
        const requestBody = {
            query: `
                mutation BookEvent($eventId: ID!){
                    bookEvent(eventId: $eventId) {
                        _id,
                        createdAt,
                        updatedAt
                    }
                }
            `,
            variables: {
                eventId: selectedEvent._id
            }
        };
        const res = await fetch (
            'http://localhost:8080/graphql', {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json',
                    'AUTHORIZATION': `Bearer ${context.token}`
                }
            }
        );
        if (res.status !== 200 && res.status !== 201) {
            throw new Error('Failed!');
        }
        let data = await res.json();
        setSelectedEvent(null);
        setIsLoading(false);
    }

    const onDetailsClick = (eventId) => {
        const foundEvent = events.find((event) => event._id === eventId);
        setSelectedEvent(foundEvent);
    }

  return (
    <>
        {creating && 
            <>
                <Backdrop/>
                <Modal 
                    title="Add Event" 
                    canCancel={true} 
                    canConfirm={true} 
                    onCancel={onCancel} 
                    onConfirm={onConfirm}
                    confirmText='Confirm'
                >
                    <form>
                        <div className="form-control">
                            <label htmlFor="title">Title</label>
                            <input type="text" id="title" ref={titleRef}></input>
                        </div>
                        <div className="form-control">
                            <label htmlFor="price">Price</label>
                            <input type="number" id="price" ref={priceRef}></input>                        
                        </div>
                        <div className="form-control">
                            <label htmlFor="date">Date</label>
                            <input type="date" id="date" ref={dateRef}></input>                        
                        </div>
                        <div className="form-control">
                            <label htmlFor="description">Description</label>
                            <textarea id="description" ref={descriptionRef}></textarea>
                        </div>
                    </form>
                </Modal>            
            </>
        }
        {selectedEvent && 
            <>
                <Backdrop/>
                    <Modal
                        title={selectedEvent?.title}
                        canCancel={true} 
                        canConfirm={true} 
                        onCancel={() => setSelectedEvent(null)} 
                        onConfirm={onBookEvent}
                        confirmText='Book'
                    >
                        <h1>{selectedEvent.title}</h1>
                        <h2>${selectedEvent.price} - {new Date(selectedEvent.date).toLocaleString()}</h2>
                        <p>{selectedEvent.description}</p>
                    </Modal>
            </>            
        }
        <div className="events-control">
            <p>Share your own Events!</p>
            <button className="btn" onClick={onCreateEventClick}>Create Event</button>
        </div>
        {isLoading 
            ?   <Spinner />
            :   <EventList events={events} authUserId={context.userId} onDetailsClick={onDetailsClick}/>
        }
        
    </>
  )
}

export default EventsPage;