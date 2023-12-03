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
            <p style={{display: 'flex', marginRight: 'auto'}}>{ name }</p>
            <div style={{ display: 'flex' }}>
                <p style={{ marginRight: 'auto' }}>{leaveBy ? "Leave by" : "Arrive by"} { formatDateToTime(info.time) }</p>
                <p style={{ marginLeft: 'auto' }}>{ Math.round(info.duration) } mins</p>
            </div>
            <div style={{ display: 'flex' }}>
                {info.cost && <p style={{ marginRight: 'auto' }}>Cost: { info.cost }</p>}
                <button onClick={ onClickHandler } className="button is-primary" style={{ marginLeft: 'auto' }}>Select</button>
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