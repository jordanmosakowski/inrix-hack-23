
import { useEffect, useState } from 'react';
import TripItinerary from './TripItinerary';
import JetStreamMap from './JetStreamMap';
import SelectFlight from './SelectFlight';
import SelectTransport from './SelectTransport';
import airportData from './airports.json';
import React from "react";
import {
  BrowserRouter as Router,
  Link,
  useLocation
} from "react-router-dom";

function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

function Main() {

    const query = useQuery();
    const [selectedFlight, setSelectedFlight] = useState(null);

    const [selectingOutbound, setSelectingOutbound] = useState(true);
    const [flightOptions, setFlightOptions] = useState([]);
    const [startIata, setStartIata] = useState("");
    const [endIata, setEndIata] = useState("");

    const [originCoords, setOriginCoords] = useState(null);
    const [destinationCoords, setDestinationCoords] = useState(null);
    const [startCoords, setStartCoords] = useState(null);
    const [endCoords, setEndCoords] = useState(null);

    useEffect(() => {
        let startAddrCoords = query.get("origin").split(',').map((coord) => parseFloat(coord));
        let endAddrCoords = query.get("destination").split(',').map((coord) => parseFloat(coord));
        setStartCoords(startAddrCoords);
        setEndCoords(endAddrCoords);

        let closestStartAirport = null;
        let closestStartAirportDistance = null;
        airportData.features.forEach((airport) => {
            let distance = Math.sqrt(Math.pow(airport.geometry.coordinates[1] - startAddrCoords[0], 2) + Math.pow(airport.geometry.coordinates[0] - startAddrCoords[1], 2));
            if (closestStartAirportDistance === null || distance < closestStartAirportDistance) {
                closestStartAirport = airport;
                closestStartAirportDistance = distance;
            }
        })

        let closestEndAirport = null;
        let closestEndAirportDistance = null;
        airportData.features.forEach((airport) => {
            let distance = Math.sqrt(Math.pow(airport.geometry.coordinates[1] - endAddrCoords[0], 2) + Math.pow(airport.geometry.coordinates[0] - endAddrCoords[1], 2));
            if (closestEndAirportDistance === null || distance < closestEndAirportDistance) {
                closestEndAirport = airport;
                closestEndAirportDistance = distance;
            }
        })

        setOriginCoords([closestStartAirport.geometry.coordinates[1], closestStartAirport.geometry.coordinates[0]]);
        setDestinationCoords([closestEndAirport.geometry.coordinates[1], closestEndAirport.geometry.coordinates[0]]);
        setStartIata(closestStartAirport.properties.iata_code);
        setEndIata(closestEndAirport.properties.iata_code);

        // console.log(startCoords);
        // console.log(originCoords);
        // console.log(destinationCoords);
        // console.log(endCoords);
    },[]);

    return (
        <div>
            <JetStreamMap/>
            {!selectedFlight && <SelectFlight setFlight={setSelectedFlight}/>}
            {selectedFlight && <>
                <SelectTransport start={startCoords} end={originCoords} startTime={selectedFlight.legs[0].departureDateTime} endTime={selectedFlight.legs[1].arrivalDateTime}/>
                <TripItinerary flight={selectedFlight} origin={startIata} destination={endIata}/>
            </>}
        </div>
    );
}

export default Main