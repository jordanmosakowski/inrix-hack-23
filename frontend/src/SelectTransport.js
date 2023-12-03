import SelectTransportItem from './SelectTransportItem';
import { useEffect, useState } from 'react';
import React from "react";

function SelectTransport(props) {

    const [mode, setMode] = useState('Driving');
    const [leaveBy, setLeaveBy] = useState('9:50');
    const [duration, setDuration] = useState('32');
    const [cost, setCost] = useState('200');

    const handleClick = (mode, leaveBy, duration, cost) => {
        props.handleClick(mode, leaveBy, duration, cost);
    }

    return (
        <div className="SelectTransport">
            <h2>Select Transport</h2>
            {props.driving && <SelectTransportItem mode="Driving" leaveBy={ props.driving.leaveBy.toLocaleTimeString() } duration={Math.round(props.driving.duration)} cost={ props.driving.parkingCost } handleClick={ handleClick } />}
            {/* <SelectTransportItem Mode="Driving" LeaveBy="9:50" Duration="32" Cost="200" /> */}
        </div>
    );
}

export default SelectTransport;