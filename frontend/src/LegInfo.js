function LegInfo(props) {

    const formatTime = (time) => {
        let hours = Number(time.split(":")[0]);
        let minutes = Number(time.split(":")[1]);
        let ampm = hours >= 12 ? 'PM' : 'AM';
        if(hours > 13) {
            hours -= 12;
        }
        if(hours == 0) {
            hours = 12;
        }
        let string = hours + ":";
        if(minutes < 10) {
            string += "0";
        }
        string += minutes + " " + ampm;
        return string;
    }

    return (
        <div className='flight-info-box'>
            <div>
                <div>{formatTime(props.leg.departureTime)} - {formatTime(props.leg.arrivalTime)}</div>
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