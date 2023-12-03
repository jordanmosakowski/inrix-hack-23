function SelectTransportItem({ mode, leaveBy, duration, cost, handleClick }) {

    const onClickHandler = () => {
        handleClick(mode, leaveBy, duration, cost);
    };

    return (
        <div className="SelectTransportItem">
            <p style={{display: 'flex', marginRight: 'auto'}}>Mode: { mode }</p>
            <div style={{ display: 'flex' }}>
                <p style={{ marginRight: 'auto' }}>Leave By: { leaveBy }</p>
                <p style={{ marginLeft: 'auto' }}>{ duration } mins</p>
            </div>
            <div style={{ display: 'flex' }}>
                <p style={{ marginRight: 'auto' }}>Cost: { cost }</p>
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