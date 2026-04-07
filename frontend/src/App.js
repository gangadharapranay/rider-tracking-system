
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import RiderPage from './pages/RiderPage';
import ViewerPage from './pages/ViewerPage';
import RouteMap from './pages/RouteMapORS';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/rider" element={<RiderPage />} />
        <Route path="/viewer" element={<ViewerPage />} />
        <Route path="/map" element={<RouteMap />} />
      </Routes>
    </Router>
  );
}

export default App;
