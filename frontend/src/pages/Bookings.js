import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import BookingList from '../components/Bookings/BookingList/BookingList';
import BookingsChart from '../components/Bookings/BookingsChart/BookingsChart';
import BookingsControls from '../components/Bookings/BookingsControls/BookingsControls';
import Spinner from '../components/Spinner/Spinner';
import authContext from '../context/auth-context';

const Bookings = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [bookings, setBookings] = useState([]);
    const [outputType, setOutputType] = useState('list');

    const context = useContext(authContext);
    const controller = useMemo(() => {
        return new AbortController();
    }, []) 

    const fetchBookings = useCallback( async () => {
        setIsLoading(true);
        let signal = controller?.current?.signal;
        const requestBody = {
            query: `
                query {
                    bookings
                    {
                        _id,
                        createdAt,
                        event {
                            _id,
                            title,
                            date,
                            price
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
                },
                signal
            }
        );
        if (res.status !== 200 && res.status !== 201) {
            throw new Error('Failed!');
        }
        let data = await res.json();
        setBookings(data?.data?.bookings ?? []);
        setIsLoading(false);
    }, [context.token, controller]);

    const onDelete = async (bookingId) => {
        setIsLoading(true);
        const requestBody = {
            query: `
                mutation CancelBooking($id: ID!){
                    cancelBooking(bookingId: $id)
                    {
                        _id,
                        title
                    }
                }                
            `,
            variables: {
                id: bookingId
            }
        };
        const res = await fetch (
            'http://localhost:8080/graphql', {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json',
                    'AUTHORIZATION': `Bearer ${context.token}`
                },
            }
        );
        if (res.status !== 200 && res.status !== 201) {
            throw new Error('Failed!');
        }
        // let data = await res.json();
        const updatedBookings = bookings.filter((booking) => bookingId !== booking._id)
        setBookings(updatedBookings)
        setIsLoading(false);
    }

    useEffect(() => {
        fetchBookings();
        return () => {
            if (controller) controller.abort();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    const changeOutput = (outputTypeUpd) => {
        if (outputTypeUpd === 'list' && outputType!== 'list') {
            setOutputType('list');
            return;
        }
        if (outputTypeUpd === 'chart' && outputType !== 'chart') {
            setOutputType('chart');
        }
    }

  return (    
    isLoading 
        ?   <Spinner />
        :   (
                <>
                    <BookingsControls changeOutput={changeOutput} activeOutputType={outputType}/>
                    <div>
                        {outputType === 'list' 
                            ?   <BookingList bookings={bookings} onDelete={onDelete}/>
                            :   <BookingsChart bookings={bookings}/>
                        }
                    </div>
                </>
            )    
  )
}

export default Bookings;
