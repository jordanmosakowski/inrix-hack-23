import { useEffect, useState } from 'react';
import './App.scss';
import { DebounceInput } from 'react-debounce-input'

import airportData from './airports.json';

function Welcome() {
    const [startAddr, setStartAddr] = useState("");
    const [startAddrOptions, setStartAddrOptions] = useState([]);
    const [startAddrCoords, setStartAddrCoords] = useState([]);
    const [startDate, setStartDate] = useState("2024-01-01"); // [year, month, day, hour, minute
    const [endAddr, setEndAddr] = useState("");
    const [endAddrOptions, setEndAddrOptions] = useState([]);
    const [endAddrCoords, setEndAddrCoords] = useState([]);
    const [endDate, setEndDate] = useState("2024-01-02"); // [year, month, day, hour, minute

    const getStart = (address) => {
        fetch('https://nominatim.openstreetmap.org/search?format=json&q='+address)
            .then(response => response.json())
            .then(data => setStartAddrOptions(data));
    }

    const getEnd = (address) => {
        fetch('https://nominatim.openstreetmap.org/search?format=json&q='+address)
            .then(response => response.json())
            .then(data => setEndAddrOptions(data));
    }

    return (
        <div className="Welcome">
            <h1>Welcome to JetStream</h1>
            <span>Enter a start address to get started</span><br/>
            <div className={`dropdown ${startAddrOptions.length > 0 ? 'is-active' : ''}`}>
                <div className="dropdown-trigger">
                    <div className="field">
                        <label className="label"><h3>Start</h3></label>
                        <div className="control">
                            <DebounceInput
                            value={startAddr} className="input" type="text" placeholder="1600 Pennsylvania Avenue, N.W. Washington, DC 20500"
                            minLength={1}
                            debounceTimeout={250}
                            onChange={event => (getStart(event.target.value))}
                            />
                            {/* <input /> */}
                        </div>
                    </div>
                </div>
                <div className="dropdown-menu" id="dropdown-menu" role="menu">
                    <div className="dropdown-content">
                        {startAddrOptions.map((addr, index) => (
                            <a href="#" key={addr.place_id} className="dropdown-item" onClick={() => {
                                setStartAddr(addr.display_name); 
                                setStartAddrOptions([]);
                                setStartAddrCoords([addr.lat, addr.lon]);
                            }}>{addr.display_name}</a>
                        ))}
                    </div>
                </div>
            </div>
            <br/>
            <br/>
            <div className={`dropdown ${endAddrOptions.length > 0 ? 'is-active' : ''}`}>
                <div className="dropdown-trigger">
                    <div className="field">
                        <label className="label"><h3>Destination</h3></label>
                        <div className="control">
                            <DebounceInput
                            value={endAddr} className="input" type="text" placeholder="1600 Pennsylvania Avenue, N.W. Washington, DC 20500"
                            minLength={1}
                            debounceTimeout={250}
                            onChange={event => (getEnd(event.target.value))}
                            />
                        </div>
                    </div>
                </div>
                <div className="dropdown-menu" id="dropdown-menu" role="menu">
                    <div className="dropdown-content">
                        {endAddrOptions.map((addr, index) => (
                            <a href="#" key={addr.place_id} className="dropdown-item" onClick={() => {
                                setEndAddr(addr.display_name); 
                                setEndAddrOptions([]);
                                setEndAddrCoords([addr.lat, addr.lon]);
                            }}>{addr.display_name}</a>
                        ))}
                    </div>
                </div>
            </div>
            <div>
                <label className="label"><h3>Start Date</h3></label>
                <input className="input" type="date" value={startDate} onChange={event => setStartDate(event.target.value)} />
                <label className="label"><h3>End Date</h3></label>
                <input className="input" type="date" value={endDate} onChange={event => setEndDate(event.target.value)} />
            </div>
            <br/>
            <br/>
            {/* Submit button */}
            <button className="button is-primary" onClick={() => {
                // make sure startDate is before endDate
                if (startDate > endDate) {
                    alert("Start date must be before end date");
                    return;
                }
                let closestStartAirport = null;
                let closestStartAirportDistance = null;
                airportData.features.forEach((airport) => {
                    let distance = Math.sqrt(Math.pow(airport.geometry.coordinates[1] - startAddrCoords[0], 2) + Math.pow(airport.geometry.coordinates[0] - startAddrCoords[1], 2));
                    if (closestStartAirportDistance == null || distance < closestStartAirportDistance) {
                        closestStartAirport = airport;
                        closestStartAirportDistance = distance;
                    }
                })

                //find closest airport to end
                let closestEndAirport = null;
                let closestEndAirportDistance = null;
                airportData.features.forEach((airport) => {
                    let distance = Math.sqrt(Math.pow(airport.geometry.coordinates[1] - endAddrCoords[0], 2) + Math.pow(airport.geometry.coordinates[0] - endAddrCoords[1], 2));
                    if (closestEndAirportDistance == null || distance < closestEndAirportDistance) {
                        closestEndAirport = airport;
                        closestEndAirportDistance = distance;
                    }
                })

                console.log("Start:",closestStartAirport.properties.iata_code, startAddrCoords);
                console.log("End:",closestEndAirport.properties.iata_code, endAddrCoords);
            }}>Submit</button>
        </div>
    )
}

export default Welcome;