import { useState } from 'react';
import './App.scss';
import DeckGL, { GeoJsonLayer } from 'deck.gl';
import { Map } from 'react-map-gl';

import Welcome from './Welcome';

const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoiamVzcGVyc29uIiwiYSI6ImNscG9ldXQ0ZDBwbTIya285bW9neGcxZG8ifQ.oN9Tsez9LV9y-vk5oxyryA"
const MAP_STYLE = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

const INITIAL_VIEW_STATE = {
  longitude: -122.41669,
  latitude: 37.7853,
  zoom: 10,
  pitch: 30,
  bearing: 0
};

function App() {

  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

  const layers = [
    new GeoJsonLayer({
      id: 'airports',
      data: 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson',
      //Styles
      filled: true,
      pointRadiusMinPixels: 5,
      pointRadiusScale: 2000,
      getPointRadius: f => 5,
      getFillColor: [86, 144, 58, 250],
      pickable: true,
      autoHighlight: true,
    })
  ];

  return (
    <div className="App">
      <Welcome />
    </div>
  )

  // return (
  //   <div className="App">
  //     <
  //     <DeckGL
  //       viewState={viewState}
  //       onViewStateChange={({ viewState }) => setViewState(viewState)}
  //       controller={true}
  //       layers={layers}
  //     >
  //       <Map
  //         mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
  //         mapStyle={MAP_STYLE}
  //       />
  //     </DeckGL>
  //   </div>
  // );
}

export default App;
