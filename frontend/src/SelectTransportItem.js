function SelectTransportItem({ name, info, leaveBy, handleClick }) {

    const onClickHandler = () => {
        handleClick(info);
    };

    const formatDateToTime = (date) => {
        let hours = date.getHours();
        let minutes = date.getMinutes();
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
        <div className="SelectTransportItem">
            <p style={{display: 'flex', marginRight: 'auto'}}>
                { name }
                <p style={{ marginLeft: 'auto' }}>{ Math.round(info.duration) } mins</p>
                </p>
            <div style={{ display: 'flex' }}>
                <div style={{ marginRight: 'auto' }}>
                    <p style={{textAlign: 'left'}}>{leaveBy ? "Leave by" : "Arrive by"} { formatDateToTime(info.time) }</p>
                    {info.cost && <p style={{textAlign: 'left'}}>{name == 'Driving' && leaveBy && "Parking "}{name == 'Driving' && !leaveBy && "Rental Car "}Cost: { info.cost }</p>}
                </div>
                <button onClick={ onClickHandler } className="button is-primary" style={{ marginLeft: 'auto' }}>Select</button>
            </div>
            <div style={{ display: 'flex' }}>
            </div>
            <hr style={{
                border: 0,
                height: '2px',
                background: '#333',
                backgroundImage: 'linear-gradient(to right, #ccc, #333, #ccc)'
            }} /> 
        </div>
    );
}

export default SelectTransportItem;