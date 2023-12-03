import LegInfo from './LegInfo';

import { useEffect, useState } from 'react';
import React from "react";


function SelectFlight(props) {

    useEffect(() => {
        fetch('http://127.0.0.1:5000/flights?origin='+props.origin+'&destination='+props.destination+'&departure_date=2024-01-01&return_date=2024-01-02')
            .then(response => response.json())
            .then(data => {
                let options = data.trips;
                setAirlines(data.airlines);
                setCities(data.cities);
                for(let trip of options) {
                    trip.fares = data.fares.filter((fare) => fare.tripId === trip.id);
                    trip.legs = [];
                    for(let legId of trip.legIds) {
                        let leg = data.legs.find((leg) => leg.id === legId);
                        trip.legs.push(leg);
                    }
                    trip.minPrice = Math.min(...trip.fares.map((fare) => fare.price.amount))
                }

                options.sort((a, b) => {
                    let aPrice = a.minPrice;
                    let bPrice = b.minPrice;
                    return aPrice - bPrice;
                });
                setFlightOptions(options);
            });
    },[]);


    const [selectingOutbound, setSelectingOutbound] = useState(true);
    const [selectedOutbound, setSelectedOutbound] = useState(null);
    const [flightOptions, setFlightOptions] = useState([]);
    const [cities, setCities] = useState([]);
    const [airlines, setAirlines] = useState([]);
    

    let getOutboundLegs = () => {
        let legs = {};
        for(let trip of flightOptions) {
            let outboundLeg = trip.legIds[0];
            if(!legs[outboundLeg]) {
                legs[outboundLeg] = [];
            }
            legs[outboundLeg].push(trip);
        }
        legs = Object.values(legs);
        legs.sort((a, b) => {
            let aScore = a[0].legs[0].score;
            let bScore = b[0].legs[0].score;
            return bScore - aScore;
        });
        return legs;
    }

    let setInbound = (leg) => {
        setSelectedOutbound(leg);
        setSelectingOutbound(false);
    }

    return (
        <div className='SelectFlightWrapper'>
            <div className='SelectFlight'>
                <h2>Select {selectingOutbound ? "Outbound" : "Inbound"} Trip</h2>

                {selectingOutbound && <h3>{cities.find((c) => c.code == props.origin)?.name || ""} → {cities.find((c) => c.code == props.destination)?.name || ""}</h3>}
                {selectingOutbound && getOutboundLegs().map((leg, index) => (
                    <LegInfo select={() => setInbound(leg)} key={leg[0].legs[0].id} leg={leg[0].legs[0]} fares={Math.min(...leg.map((l) => l.minPrice))} airlines={airlines} />
                ))}

                {!selectingOutbound && <h3>{cities.find((c) => c.code == props.destination)?.name || ""} → {cities.find((c) => c.code == props.origin)?.name || ""}</h3>}
                {!selectingOutbound && selectedOutbound.map((leg, index) => (
                    <LegInfo select={() => props.setFlight(leg)} key={leg.legs[1].id} leg={leg.legs[1]} fares={leg.minPrice} airlines={airlines} />
                ))}
            </div>
        </div>
    )
}

export default SelectFlight;