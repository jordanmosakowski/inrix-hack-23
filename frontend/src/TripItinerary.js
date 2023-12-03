import {useEffect, useState } from 'react';
import React from 'react';
import {
  BrowserRouter as Router,
  Link,
  useLocation
} from "react-router-dom";

function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

function TripItinerary(props) {
    const query = useQuery();
    useEffect(() => {
        console.log(props.flight);
    })
    return (
        <div className="TripItinerary">
            <h1>Trip Itinerary</h1>
            <h2>{props.flight.legs[0].departureAirportCode}-{props.flight.legs[0].arrivalAirportCode}</h2>
            <div className='grid2'>
                <div>
                    <h2>Outbound</h2>
                    <div>{new Date(query.get("startDate")).toLocaleDateString()}</div>
                    <div>{props.flight.legs[0].departureTime} - {props.flight.legs[0].arrivalTime}</div>
                    <div>{props.flight.legs[0].segments.map((segment, index) => segment.designatorCode).join(", ")}</div>
                </div>
                <div>
                    <h2>Return</h2>
                    <div>{new Date(query.get("startDate")).toLocaleDateString()}</div>
                    <div>{props.flight.legs[1].departureTime} - {props.flight.legs[1].arrivalTime}</div>
                    <div>{props.flight.legs[1].segments.map((segment, index) => segment.designatorCode).join(", ")}</div>
                </div>
            </div>
            <h3>${props.flight.minPrice}</h3>
        </div>
    )
}

export default TripItinerary;