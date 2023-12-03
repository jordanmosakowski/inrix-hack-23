import { useEffect, useState, useRef } from 'react';
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

import * as turf from '@turf/turf';

function useQuery() {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
}

function Main() {

    const query = useQuery();
    const jsmap = useRef(null);
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [drivingOption, setDrivingOption] = useState(null);

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
    },[]);

    const setFlight = (flight) => {
        setSelectedFlight(flight);

        const startDate = new Date(flight.legs[0].departureDateTime);
        console.log(flight.legs[0].departureDateTime);
        startDate.setHours(startDate.getHours() - 2);
        const endDate = new Date(flight.legs[1].arrivalDateTime);
        startDate.setHours(startDate.getHours() + 2);
        const durationInMinutes = (endDate - startDate) / 1000 / 60;
        
        // get driving route
        fetch(`https://routing.openstreetmap.de/routed-car/route/v1/driving/${startCoords[1]},${startCoords[0]};${originCoords[1]},${originCoords[0]}?overview=false&geometries=polyline&steps=true`)
        .then(response => response.json())
        .then(data => {
            const distance = data.routes[0].distance;
            const duration = data.routes[0].duration/60;
            const leaveBy = new Date(new Date(flight.legs[0].departureDateTime.substring(0,19)).getTime() - 2*60000*60 - duration * 60000);
            const points = data.routes[0].legs[0].steps.map((s) => s.maneuver.location);
            const linestring1 = turf.lineString(points, {name: 'Line'});
            console.log(startDate, leaveBy);
            setDrivingOption({
                distance,
                duration,
                leaveBy,
                linestring: linestring1,
                parkingCost: "Loading"
            });

            // get parking
            const url = `http://127.0.0.1:5000/parking?point=${originCoords[0]}%7C${originCoords[1]}&radius=1000&entry=${startDate.toISOString().substring(0,16).replace(":","%3A")+"Z"}&duration=${durationInMinutes}`
            fetch(url)
            .then(response => response.json())
            .then(data => {
                // console.log(data);
                const parking = data.result;
                let parkingCost = parking.find((p) => p.calculatedRates?.length > 0) || null;
                parkingCost = parkingCost ? (parkingCost.currency + parkingCost.calculatedRates[0].rateCost.toString()) : "Unknown";
                setDrivingOption((prev) => ({
                    ...prev,
                    parkingCost
                }));
            });

        });

        fetch(`http://127.0.0.1:5000/transit?start=${startCoords[0]},${startCoords[1]}&end=${originCoords[0]},${originCoords[1]}&time=${startDate.toISOString()}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
        });
    }
    const selectTransport = () => {
        jsmap.current.doTransition();
    }

    return (
        <div>
            {originCoords && destinationCoords && startCoords && endCoords && <JetStreamMap route1LineStr={drivingOption?.linestring} origin={originCoords} des={destinationCoords} start={startCoords} end={endCoords} ref={jsmap} />}
            {!selectedFlight && <SelectFlight setFlight={setFlight} origin={startIata} destination={endIata}/>}
            {selectedFlight && <>
                <SelectTransport driving={drivingOption} start={startCoords} end={originCoords} startTime={selectedFlight.legs[0].departureDateTime} endTime={selectedFlight.legs[1].arrivalDateTime} handleClick={selectTransport} />
                <TripItinerary flight={selectedFlight} origin={startIata} destination={endIata}/>
            </>}
        </div>
    );
}

export default Main