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
    const [transitOption, setTransitOption] = useState(null);

    const [selectingOutbound, setSelectingOutbound] = useState(true);
    const [flightOptions, setFlightOptions] = useState([]);
    const [startIata, setStartIata] = useState("");
    const [endIata, setEndIata] = useState("");

    const [originCoords, setOriginCoords] = useState(null);
    const [destinationCoords, setDestinationCoords] = useState(null);
    const [startCoords, setStartCoords] = useState(null);
    const [endCoords, setEndCoords] = useState(null);

    const [selectedTransport, setSelectedTransport] = useState([]);

    const [currentSelection, setCurrentSelection] = useState(0);

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

    const getTransportOptions = (flight, num) => {
        let startDate, endDate, durationInMinutes,durationInDays;
        if(num == 0) {
            startDate = new Date(flight.legs[0].departureDateTime);
            startDate.setHours(startDate.getHours() - 2);
            endDate = new Date(flight.legs[1].arrivalDateTime);
            endDate.setHours(endDate.getHours() + 1);
            durationInMinutes = (endDate - startDate) / 1000 / 60;
        }
        else if(num == 1) {
            startDate = new Date(flight.legs[0].arrivalDateTime);
            startDate.setHours(startDate.getHours() + 1);
            endDate = new Date(flight.legs[1].departureDateTime);
            durationInDays = Math.ceil((endDate - startDate) / 1000 / 60 / 60 / 24);

        }
        else if(num == 2) {
            startDate = new Date(flight.legs[1].departureDateTime);
            startDate.setHours(startDate.getHours() - 2);
        }
        else if(num == 3) {
            startDate = new Date(flight.legs[1].arrivalDateTime);
            startDate.setHours(startDate.getHours() + 1);
        }

        let url = '';

        if(num == 0) {
            url = `https://routing.openstreetmap.de/routed-car/route/v1/driving/${startCoords[1]},${startCoords[0]};${originCoords[1]},${originCoords[0]}?overview=false&geometries=polyline&steps=true`;
        }
        else if(num == 1) {
            url = `https://routing.openstreetmap.de/routed-car/route/v1/driving/${destinationCoords[1]},${destinationCoords[0]};${endCoords[1]},${endCoords[0]}?overview=false&geometries=polyline&steps=true`;
        }
        else if(num == 2) {
            url = `https://routing.openstreetmap.de/routed-car/route/v1/driving/${endCoords[1]},${endCoords[0]};${destinationCoords[1]},${destinationCoords[0]}?overview=false&geometries=polyline&steps=true`;
        }
        else if(num == 3) {
            url = `https://routing.openstreetmap.de/routed-car/route/v1/driving/${originCoords[1]},${originCoords[0]};${startCoords[1]},${startCoords[0]}?overview=false&geometries=polyline&steps=true`;
        }
        // get driving route
        fetch(url)
        .then(response => response.json())
        .then(data => {
            const distance = data.routes[0].distance;
            const duration = data.routes[0].duration/60;
            let time;
            if(num == 0) {
                time = new Date(new Date(flight.legs[0].departureDateTime.substring(0,19)).getTime() - 2*60000*60 - duration * 60000);
            }
            else if(num == 1) {
                time = new Date(new Date(flight.legs[0].arrivalDateTime.substring(0,19)).getTime() + (duration + 30) * 60000);
            }
            else if(num == 2) {
                time = new Date(new Date(flight.legs[1].departureDateTime.substring(0,19)).getTime() - 2*60000*60 - duration * 60000);
            }
            else if(num == 3) {
                time = new Date(new Date(flight.legs[1].arrivalDateTime.substring(0,19)).getTime() + (duration + 30) * 60000);
            }
            const points = data.routes[0].legs[0].steps.map((s) => s.maneuver.location);
            const linestring1 = turf.lineString(points, {name: 'Line'});
            setDrivingOption({
                name: "Driving",
                distance,
                duration,
                time,
                linestring: linestring1,
                cost: num == 0 ? "Loading" : null
            });

            // get parking
            if(num == 0) {
                const url = `http://127.0.0.1:5000/parking?point=${originCoords[0]}%7C${originCoords[1]}&radius=1000&entry=${startDate.toISOString().substring(0,16).replace(":","%3A")+"Z"}&duration=${durationInMinutes}`
                fetch(url)
                .then(response => response.json())
                .then(data => {
                    const parking = data.result;
                    let parkingCost = parking.find((p) => p.calculatedRates?.length > 0) || null;
                    parkingCost = parkingCost ? (parkingCost.currency + parkingCost.calculatedRates[0].rateCost.toString()) : "Unknown";
                    setDrivingOption((prev) => ({
                        ...prev,
                        cost: parkingCost
                    }));
                });
            }
            else if(num == 1) {
                const url = `http://127.0.0.1:5000/rentals?iataCode=${endIata}`;
                fetch(url)
                .then(response => response.json())
                .then(data => {
                    const cars = data.CarData.data.quotes;
                    let carCost = Math.min(...cars.map((c) => c.price));
                    setDrivingOption((prev) => ({
                        ...prev,
                        cost: "$"+carCost * durationInDays
                    }));
                }); 
            }

        });

        let transitUrl
        if(num == 0) {
            transitUrl = `http://127.0.0.1:5000/transit?start=${startCoords[0]},${startCoords[1]}&end=${originCoords[0]},${originCoords[1]}&time=${startDate.toISOString()}&isArrival=true`
        }
        else if (num == 1) {
            transitUrl = `http://127.0.0.1:5000/transit?start=${destinationCoords[0]},${destinationCoords[1]}&end=${endCoords[0]},${endCoords[1]}&time=${startDate.toISOString()}&isArrival=false`
        }
        else if (num == 2) {
            transitUrl = `http://127.0.0.1:5000/transit?start=${endCoords[0]},${endCoords[1]}&end=${destinationCoords[0]},${destinationCoords[1]}&time=${startDate.toISOString()}&isArrival=true`
        }
        else {
            transitUrl = `http://127.0.0.1:5000/transit?start=${originCoords[0]},${originCoords[1]}&end=${startCoords[0]},${startCoords[1]}&time=${startDate.toISOString()}&isArrival=false`
        }

        fetch(transitUrl)
        .then(response => response.json())
        .then(data => {
            const route = data.routes[0];
            let startTime = new Date(route.sections[0].departure.time);
            let time = new Date(new Date(route.sections[0].departure.time.substring(0,19)).getTime());
            let endTime = new Date(route.sections[route.sections.length-1].arrival.time);
            let points = [];
            route.sections.forEach((section) => {
                points.push([section.departure.place.location.lng, section.departure.place.location.lat]);
                points.push([section.arrival.place.location.lng, section.arrival.place.location.lat]);
            });
            const linestring2 = turf.lineString(points, {name: 'Transit'});
            const distance = turf.length(linestring2, {units: 'meters'});
            const duration = (endTime - startTime) / 1000 / 60;
            setTransitOption({
                name: "Public Transit",
                distance,
                duration,
                time,
                linestring: linestring2,
                cost: num == 0 ? "€2.10" : "$2.25",
            });
        });
    }

    const setFlight = (flight) => {
        setSelectedFlight(flight);
        getTransportOptions(flight, 0);
    }

    const chooseTransport = (info) => {
        setSelectedTransport((prev) => [...prev, info]);
        if(currentSelection == 0 || currentSelection == 2) {
            jsmap.current.doTransition();
        }
        if(currentSelection == 3) {
            jsmap.current.only1();
        }
        if(currentSelection < 3) {
            getTransportOptions(selectedFlight, currentSelection+1);
        }
        setCurrentSelection(currentSelection + 1);
        setDrivingOption(null);
        setTransitOption(null);
    }

    return (
        <div>
            {originCoords && destinationCoords && startCoords && endCoords && <JetStreamMap route1LineStr={drivingOption?.linestring} route2LineStr={transitOption?.linestring} origin={originCoords} des={destinationCoords} start={startCoords} end={endCoords} ref={jsmap} />}
            {!selectedFlight && <SelectFlight setFlight={setFlight} origin={startIata} destination={endIata}/>}
            {selectedFlight && currentSelection < 4 &&
                <SelectTransport leaveBy={currentSelection %2 == 0} location={(currentSelection == 0 || currentSelection == 3) ? startIata : endIata} to={currentSelection %2 == 0} driving={drivingOption} transit={transitOption} start={startCoords} end={originCoords} startTime={selectedFlight.legs[0].departureDateTime} endTime={selectedFlight.legs[1].arrivalDateTime} handleClick={chooseTransport} />}
            {selectedFlight && 
                <TripItinerary flight={selectedFlight} origin={startIata} destination={endIata} transport={selectedTransport} />
            }
        </div>
    );
}

export default Main