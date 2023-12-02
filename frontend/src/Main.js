
import FlightInfoPanel from './FlightInfoPanel';
import JetStreamMap from './JetStreamMap';
import SelectFlight from './SelectFlight';
import SelectTransport from './SelectTransport';

function Main() {
    return (
        <div>
            <JetStreamMap/>
            {/* <SelectFlight/> */}
            <SelectTransport/>
            <FlightInfoPanel/>
        </div>
    );
}

export default Main