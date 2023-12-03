import SelectTransportItem from './SelectTransportItem';
import React from "react";

function SelectTransport(props) {
    return (
        <div className="SelectTransport">
            <h2>Transport {props.to ? "to" : "from"} {props.location}</h2>
            {props.driving && <SelectTransportItem leaveBy={props.leaveBy} name="Driving" info={props.driving} handleClick={props.handleClick} />}
            {props.transit && <SelectTransportItem leaveBy={props.leaveBy} name="Public Transit" info={props.transit} handleClick={props.handleClick} />}
        </div>
    );
}

export default SelectTransport;