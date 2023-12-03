import { useState, useImperativeHandle, forwardRef } from 'react';
import DeckGL, { GeoJsonLayer, IconLayer, ArcLayer, FlyToInterpolator } from 'deck.gl';
import { Map } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';


const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
const MAP_STYLE = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

const JetStreamMap = forwardRef(function JetStreamMap( { origin, des, start, end, PassItUp }, ref ) {

  const [transitionFlag, setTransitionFlag] = useState(0);
  const [viewState, setViewState] = useState({
    longitude: origin[1],
    latitude: origin[0],
    zoom: 10,
    pitch: 30,
    bearing: 0
  });

  const start_finish_data = [
    {
      from: {
        coordinates: [origin[1], origin[0]]
      },
      to: {
        coordinates: [des[1], des[0]]
      },
      coordinates: [start[1], start[0]], 
    },
    {
      from: {},
      to: {},
      coordinates: [end[1], end[0]]
    },
  ];

  useImperativeHandle(ref, () => ({
    async doTransition() {
      await viewTransition1([des[1], des[0]]);
      //const delay = ms => new Promise(res => setTimeout(res, ms));
      //await delay(1000);
      console.log(transitionFlag);
      if (transitionFlag === 0) {
        viewTransition2([des[1], des[0]]);
        setTransitionFlag(1);
      } else {
        viewTransition2([origin[1], origin[0]]);
        setTransitionFlag(0);
      }
    }
  }));

  const viewTransition1 = (e) => {
    return new Promise((resolve) => {
      setViewState({
        longitude: (origin[1] + e[0]) / 2,
        latitude: (origin[0] + e[1]) / 2,
        zoom: 2.5,
        pitch: 30,
        bearing: 0,
        transitionDuration: '5000',
        transitionInterpolator: new FlyToInterpolator(),
        onTransitionEnd: resolve
      });
    });
  };

  const viewTransition2 = (e) => {
    setViewState({
      longitude: e[0],
      latitude: e[1],
      zoom: 10,
      pitch: 30,
      bearing: 0,
      transitionDuration: '5000',
      transitionInterpolator: new FlyToInterpolator(),
    });
  };
  
  const layers = [
    new GeoJsonLayer({
      id: 'airports',
      data: 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson',
      //Styles
      filled: true,
      pointRadiusMinPixels: 5,
      pointRadiusScale: 2000,
      getPointRadius: f => 1,
      getFillColor: [86, 144, 58, 250],
      pickable: true,
      autoHighlight: true,
      opacity: 0.9,
    }),
    new IconLayer({
      id: 'start-finish',
      data: start_finish_data,
      iconAtlas: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
      iconMapping: {
        marker: { x: 0, y: 0, width: 128, height: 128, anchorY: 128, mask: false }
      },
      getIcon: d => 'marker',
      sizeScale: 10,
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
      getWidth: 10,
      getHeight: 0.5,
    })
  ];

  return (
    <div className="JetStreamMap">
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
},[]);

export default JetStreamMap;
