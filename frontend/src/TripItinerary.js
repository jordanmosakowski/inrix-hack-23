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
        // console.log(props.flight);
        // console.log(props.transport);
    })

    const formatDateToTime = (date) => {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? 'PM' : 'AM';
        if(hours > 13) {
            hours -= 12;
        }
        if(hours == 0) {
            hours = 12;
        }
        let string = hours + ":";
        if(minutes < 10) {
            string += "0";
        }
        string += minutes + " " + ampm;
        return string;
    }

    const formatTime = (time) => {
        let hours = Number(time.split(":")[0]);
        let minutes = Number(time.split(":")[1]);
        let ampm = hours >= 12 ? 'PM' : 'AM';
        if(hours >= 13) {
            hours -= 12;
        }
        if(hours == 0) {
            hours = 12;
        }
        let string = hours + ":";
        if(minutes < 10) {
            string += "0";
        }
        string += minutes + " " + ampm;
        return string;
    }
    
    return (
        <div className="TripItinerary">
            <h1>Trip Itinerary</h1>
            <h2>Outbound</h2>
            {props.transport.length>0 && <>
            <h3>{props.transport[0].name} to {props.flight.legs[0].departureAirportCode}</h3>
                <div className='grid2'>
                    <div>
                        <div>Leave by {formatDateToTime(props.transport[0].time)}</div>
                    </div>
                    <div>
                        
                        <div>Duration: {Math.round(props.transport[0].duration)} mins</div>
                    </div>
                </div>
            </>}
            <h3>Flight: {props.flight.legs[0].departureAirportCode} - {props.flight.legs[0].arrivalAirportCode}</h3>
            <div>{new Date(query.get("startDate")).toLocaleDateString("en-US", { timeZone: 'UTC' })}</div>
            <div>{formatTime(props.flight.legs[0].departureTime)} - {formatTime(props.flight.legs[0].arrivalTime)}</div>
            <div>{props.flight.legs[0].segments.map((segment, index) => segment.designatorCode).join(", ")}</div>
            <div>${Math.floor(props.flight.minPrice/2)}</div>
            {props.transport.length>1 && <>
                <h3>{props.transport[1].name} from {props.flight.legs[0].arrivalAirportCode}</h3>
                <div className='grid2'>
                    <div>
                        <div>Arrive by {formatDateToTime(props.transport[1].time)}</div>
                    </div>
                    <div>
                        <div>Duration: {Math.round(props.transport[1].duration)} mins</div>
                    </div>
                </div>
            </>}
            <br/>
            <h2>Return</h2>
            {props.transport.length>2 && <>
                <h3>{props.transport[2].name} to {props.flight.legs[1].departureAirportCode}</h3>
                <div className='grid2'>
                    <div>
                        <div>Leave by {formatDateToTime(props.transport[2].time)}</div>
                    </div>
                    <div>
                        <div>Duration: {Math.round(props.transport[2].duration)} mins</div>
                    </div>
                </div>
            </>}
            <h3>Flight: {props.flight.legs[1].departureAirportCode} - {props.flight.legs[1].arrivalAirportCode}</h3>
            <div>{new Date(query.get("endDate")).toLocaleDateString("en-US", { timeZone: 'UTC' })}</div>
            <div>{formatTime(props.flight.legs[1].departureTime)} - {formatTime(props.flight.legs[1].arrivalTime)}</div>
            <div>{props.flight.legs[1].segments.map((segment, index) => segment.designatorCode).join(", ")}</div>
            <div>${Math.ceil(props.flight.minPrice/2)}</div>
            {props.transport.length>3 && <>
                <h3>{props.transport[3].name} from {props.flight.legs[1].arrivalAirportCode}</h3>
                <div className='grid2'>
                    <div>
                        <div>Arrive by {formatDateToTime(props.transport[3].time)}</div>
                    </div>
                    <div>
                        <div>Duration: {Math.round(props.transport[3].duration)} mins</div>
                    </div>
                </div>
            </>}
            
        </div>
    )
}

export default TripItinerary;