import {useState } from 'react';

function FlightInfoPanel() {
    const [flightInfo, setFlightInfo] = useState("");
    const [flightNumber, setFlightNumber] = useState("");
    const [depDate, setDepDate] = useState("");
    const [depTime, setDepTime] = useState("");
    const [arrDate, setArrDate] = useState("");
    const [arrTime, setArrTime] = useState("");
    return (
        <div className="FlightInfoPanel">
            <h2>Flight Info: {flightInfo}</h2>
            <h2>Flight Number: {flightNumber}</h2>
            <h2>Departure Date: {depDate}, Time: {depTime}</h2>
            <h2>Arrival Date: {arrDate}, Time: {arrTime}</h2>
        </div>
    )
}

export default FlightInfoPanel;