import React, { useMemo } from 'react';
import "./BookingsChart.css";
import { Bar } from 'react-chartjs';

const BOOKINGS_BUCKETS = {
    'Cheap': {
        min: 0,
        max: 100
    },
    'Normal': {
        min: 100,
        max: 200
    },
    'Expensive': {
        min: 200,
        max: 10000000
    }
}

const BookingsChart = ({bookings}) => {

    const chartData = useMemo(() => {
        let tempChartData = {labels: [], datasets: []};
        let values = [];
        for (const bucket in BOOKINGS_BUCKETS) {
            const filteredBookingsCount = bookings.reduce((prevValue, currentBooking) => {
                if (currentBooking.event.price > BOOKINGS_BUCKETS[bucket].min && currentBooking.event.price < BOOKINGS_BUCKETS[bucket].max) {
                    return prevValue +1 
                }
                return prevValue;                
            }, 0);
            values.push(filteredBookingsCount);
            tempChartData.labels.push(bucket);
            tempChartData.datasets.push({
                fillColor: "rgba(81, 1, 209, 1)",
                strokeColor: "rgba(81, 1, 209, 1)",
                highlightFill: "rgba(220,220,220,0.75)",
                hightlightStroke: "rgba(220,220,220,1)",
                data: values
            });
            values = [...values]
            values[values.length-1] = 0;
            values = [0,0]
        }
        return tempChartData;
    }, [bookings]);
    
  return (
    <div style={{textAlign: 'center', marginTop: '10rem'}}><Bar data={chartData} /></div>
  )
}

export default BookingsChart;
