function SelectTransportItem({ Mode, LeaveBy, Duration, Cost, handleClick }) {
    return (
        <div className="SelectTransportItem">
            <p style={{display: 'flex', marginRight: 'auto'}}>Mode: { Mode }</p>
            <div style={{ display: 'flex' }}>
                <p style={{ marginRight: 'auto' }}>Leave By: { LeaveBy }am</p>
                <p style={{ marginLeft: 'auto' }}>{ Duration } mins</p>
            </div>
            <div style={{ display: 'flex' }}>
                <p style={{ marginRight: 'auto' }}>Cost: ${ Cost }</p>
                <button onClick={ handleClick } style={{ marginLeft: 'auto' }}>Select</button>
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