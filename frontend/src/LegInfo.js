import { useEffect, useState } from 'react';

function LegInfo(props) {

    const [departureTime, setDepartureTime] = useState(null);
    const [arrivalTime, setArrivalTime] = useState(null);

    
    useEffect(() => {
        let temp = parseInt(props.leg.departureTime.replace(/:/g, ''));
        if(temp > 1259) {
            temp = temp - 1200;
            if(temp < 1000) {
                setDepartureTime(temp.toString().slice(0,1) + ":" + temp.toString().slice(1,4) + "PM")
            } else {
                setDepartureTime(temp.toString().slice(0,2) + ":" + temp.toString().slice(2,4) + "PM")
            }
        } else {
                setDepartureTime(temp.toString().slice(0,2) + ":" + temp.toString().slice(2,4) + "AM")
        }
        temp = parseInt(props.leg.arrivalTime.replace(/:/g, ''));
        if(temp > 1259) {
            temp = temp - 1200
            if(temp > 1159) {
                setArrivalTime(temp.toString().slice(0,2) + ":" + temp.toString().slice(2,4) + "PM")
            } else if(temp < 1000) {
                setArrivalTime(temp.toString().slice(0,1) + ":" + temp.toString().slice(1,4) + "PM")
            } else {
                if(temp > 1159) {
                    setArrivalTime(temp.toString().slice(0,2) + ":" + temp.toString().slice(2,4) + "PM")
                } else {
                setArrivalTime(temp.toString().slice(0,2) + ":" + temp.toString().slice(2,4) + "PM")
            } } }
        else {
            setArrivalTime(temp.toString().slice(0,2) + ":" + temp.toString().slice(2,4) + "AM")
        }
        temp = 0;
    }
    )

    return (
        <div className='flight-info-box'>
            <div>
                <div>{departureTime}-{arrivalTime}</div>
                <div>{props.leg.duration}</div>
            </div>
            <div>
                <div>{props.leg.stopoverAirportCodes.length == 0 ? "Nonstop" : (
                    props.leg.stopoverAirportCodes.length == 1 ? "Stopover in "+props.leg.stopoverAirportCodes[0] : "Stops in "+props.leg.stopoverAirportCodes.join(', ')
                )}</div>
                <div>{props.leg.airlineCodes.map((code) => props.airlines.find((a) => a.code == code).name).join(", ")}</div>
            </div>
            <div>From ${props.fares}</div>
            <div>
                <button onClick={props.select} className="button is-primary">Select</button>
            </div>
        </div>
    )
}

export default LegInfo;