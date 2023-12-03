function LegInfo(props) {
    return (
        <div className='flight-info-box'>
            <div>
                <div>{props.leg.departureTime}-{props.leg.arrivalTime}</div>
                <div>{props.leg.duration}</div>
            </div>
            <div>
                <div>{props.leg.stopoverAirportCodes.length == 0 ? "Nonstop" : (
                    props.leg.stopoverAirportCodes.length == 1 ? "Stopover in "+props.leg.stopoverAirportCodes[0] : "Stops in "+props.leg.stopoverAirportCodes.join(', ')
                )}</div>
                <div>{props.leg.airlineCodes.map((code) => props.airlines.find((a) => a.code == code).name).join(", ")}</div>
            </div>
            <div>From ${props.fares}</div>
            <div>
                <button onClick={props.select} className="button is-primary">Select</button>
            </div>
        </div>
    )
}

export default LegInfo;