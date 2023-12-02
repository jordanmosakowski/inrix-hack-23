import { useState } from 'react';
import DeckGL, { GeoJsonLayer, IconLayer, ArcLayer } from 'deck.gl';
import { Map } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';


const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
const MAP_STYLE = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

const INITIAL_VIEW_STATE = {
longitude: -122.41669,
  latitude: 37.7853,
  zoom: 10,
  pitch: 30,
  bearing: 0
};

const start_finish_data = [
  {
    from: {
      address: 'Neue Mainzer Strasse 66 60311 Frankfurt Am Main Germany',
      coordinates: [8.671700, 50.112780]
    },
    to: {
      address: '475 Sansome St 10th floor, San Francisco, CA 94111',
      coordinates: [-122.401947, 37.794708]
    },
    coordinates: [8.671700, 50.112780], 
  },
  {
    from: {},
    to: {},
    coordinates: [-122.401947, 37.794708]
  },
];


function App() {

  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

  const onClick = (info) => {
    if (info.object) {
      alert(info.object.geometry.coordinates + "\n" + info.object.properties.name);
    }
  }

  const layers = [
    new GeoJsonLayer({
      id: 'airports',
      data: 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson',
      //Styles
      filled: true,
      pointRadiusMinPixels: 1,
      pointRadiusScale: 2000,
      getPointRadius: f => f.properties.scalerank,
      getFillColor: [86, 144, 58, 250],
      pickable: true,
      autoHighlight: true,
      onClick
    }),
    new IconLayer({
      id: 'start-finish',
      data: start_finish_data,
      iconAtlas: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
      iconMapping: {
        marker: { x: 0, y: 0, width: 128, height: 128, anchorY: 128, mask: false }
      },
      getIcon: d => 'marker',
      sizeScale: 15,
      getPosition: d => d.coordinates,
      getSize: d => 5,
      getColor: d => [255, 0, 0],
    }),
    new ArcLayer({
      id: 'airplane-route',
      data: start_finish_data,
      //Styles
      getSourcePosition: d => d.from.coordinates,
      getTargetPosition: d => d.to.coordinates,
      getSourceColor: [0, 0, 140],
      getTargetColor: [140, 0, 0],
      getWidth: 5,
    })
  ];

  return (
    <div className="App">
      <DeckGL
        viewState={viewState}
        onViewStateChange={({ viewState }) => setViewState(viewState)}
        controller={true}
        layers={layers}
      >
        <Map
          mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
          mapStyle={MAP_STYLE}
        />
      </DeckGL>
    </div>
  );
}

export default App;
