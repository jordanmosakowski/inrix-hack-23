import { useState, useImperativeHandle, forwardRef } from 'react';
import DeckGL, { GeoJsonLayer, IconLayer, ArcLayer, FlyToInterpolator } from 'deck.gl';
import { Map } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';


const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;
const MAP_STYLE = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

const JetStreamMap = forwardRef(function JetStreamMap( { origin, des, start, end, PassItUp, route1LineStr}, ref ) {

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
  const data = {"type":"Feature","properties":{"name":"Line"},"geometry":{"type":"LineString","coordinates":[[8.671658,50.113273],[8.6718,50.113395],[8.669847,50.113939],[8.66874,50.113432],[8.670851,50.110478],[8.672477,50.1086],[8.664604,50.103964],[8.665247,50.102207],[8.667704,50.100132],[8.670329,50.09776],[8.670319,50.097352],[8.654187,50.078056],[8.578762,50.054958],[8.569031,50.053468],[8.566275,50.053168],[8.565868,50.053143],[8.564077,50.050855],[8.56863,50.050244],[8.571681,50.050921]]}}

  
  const layers = [
    new GeoJsonLayer({
      id: 'airports',
      data: 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson',
      //Styles
      filled: true,
      pointRadiusMinPixels: 5,
      pointRadiusScale: 2000,
      getPointRadius: f => 1,
      getFillColor: [86, 144, 58, 50],
      pickable: true,
      autoHighlight: true,
      opacity: 0.9,
    }),
    new IconLayer({
      id: 'start-finish',
      data: start_finish_data,
      iconAtlas: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
      iconMapping: {
        marker: { x: 0, y: 0, width: 128, height: 128, anchorY: 128, mask: true }
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
      getTargetColor: [0, 0, 140],
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
        layers={route1LineStr ? [...layers, 
          new GeoJsonLayer({
            id: "driving",
            data: route1LineStr,
            stroked: false,
            filled: false,
            lineWidthMinPixels: 0.5,
            parameters: {
              depthTest: false
            },
            getLineColor: () => [0, 0, 0, 255],
            getLineWidth: () => 100,
          })] : layers}
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
