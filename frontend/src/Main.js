
import { useEffect, useState } from 'react';
import TripItinerary from './TripItinerary';
import JetStreamMap from './JetStreamMap';
import SelectFlight from './SelectFlight';
import SelectTransport from './SelectTransport';
import React from "react";

function Main() {
    const [selectedFlight, setSelectedFlight] = useState(null);

    return (
        <div>
            <JetStreamMap/>
            {!selectedFlight && <SelectFlight setFlight={setSelectedFlight}/>}
            {selectedFlight && <>
                <SelectTransport/>
                <TripItinerary flight={selectedFlight}/>
            </>}
        </div>
    );
}

export default Main