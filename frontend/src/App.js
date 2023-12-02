import './App.scss';
import Main from './Main';
import Welcome from './Welcome';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Welcome />} />
          <Route path="map" element={<Main />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App;
