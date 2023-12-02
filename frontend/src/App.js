import './App.scss';
import JetStreamMap from './JetStreamMap';
import Welcome from './Welcome';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Welcome />} />
          <Route path="map" element={<JetStreamMap />} />
        </Route>
      </Routes>
    </BrowserRouter>
      {/* <JetStreamMap /> */}
    </div>
  )
}

export default App;
