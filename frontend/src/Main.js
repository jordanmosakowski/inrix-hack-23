
import { useEffect, useState } from 'react';
import FlightInfoPanel from './FlightInfoPanel';
import JetStreamMap from './JetStreamMap';
import SelectFlight from './SelectFlight';
import SelectTransport from './SelectTransport';
import airportData from './airports.json';
import React from "react";

function Main() {
    const [selectedFlight, setSelectedFlight] = useState(null);

    return (
        <div>
            <JetStreamMap/>
            {!selectedFlight && <SelectFlight setFlight={setSelectedFlight}/>}
            {selectedFlight && <>
                <SelectTransport/>
                <FlightInfoPanel/>
            </>}
        </div>
    );
}

export default Main