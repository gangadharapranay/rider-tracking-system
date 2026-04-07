








import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import bikeImage from '../assets/delivery-bike.png';

const bikeIcon = new L.Icon({
  iconUrl: bikeImage,
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35],
});

// Fix Leaflet marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});




// Constants
const destination = [17.441026, 78.391635];
const apiKey = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImNiZjczODczNDgwMTQ2ZDc4MmM0NDU1ZTkxOGQ2N2MxIiwiaCI6Im11cm11cjY0In0='; // replace with your key

function MapAutoFocus({ location }) {
  const map = useMap();
  useEffect(() => {
    if (location) {
      map.setView([location.latitude, location.longitude], 16);
    }
  }, [location]);
  return null;
}

function RiderPage() {
  const incrementRef = useRef(0);
  const [location, setLocation] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);

  useEffect(() => {
    const interval = setInterval(async () => {
      incrementRef.current += 0.0001;

      const fakeLocation = {
        riderId: "rider123",
        latitude: parseFloat((17.443616 + incrementRef.current).toFixed(6)),
        longitude: parseFloat((78.382064 + incrementRef.current).toFixed(6)),
      };

      setLocation(fakeLocation); // update location

      try {
        setRouteCoords([])
        const response = await axios.post(
          'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
          {
            coordinates: [
              [fakeLocation.longitude, fakeLocation.latitude],
              [destination[1], destination[0]],
            ],
          },
          {
            headers: {
              Authorization: apiKey,
              'Content-Type': 'application/json',
            },
          }
        );

        const coords = response.data.features[0].geometry.coordinates.map(
          (coord) => [coord[1], coord[0]]
        );
        setRouteCoords(coords);
      } catch (err) {
        console.error('Error fetching route:', err);
      }

      axios.post('http://localhost:8084/api/location', fakeLocation)
        .catch(err => console.error("Error sending location:", err));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Render safely after location is initialized
  if (!location) {
    return <p>Fetching fake live location...</p>;
  }

  return (
    <div>
      <h2 style={{
        textAlign: 'center',
        width: '100%',
        margin: '20px 0'
      }}>
        Rider View - Sending Live Location
      </h2>

      {!location ? (
        <p>Fetching Rider live location</p>
      ) : (
        <MapContainer
          center={[location.latitude, location.longitude]}
          zoom={16}
          style={{ height: '90vh', width: '100vw' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <MapAutoFocus location={location} />
          <Marker icon={bikeIcon} position={[location.latitude, location.longitude]}>
            <Popup>Fake Rider<br />Lat: {location.latitude}<br />Lng: {location.longitude}</Popup>
          </Marker>
          <Marker position={destination}>
            <Popup>Destination</Popup>
          </Marker>
          {routeCoords.length > 0 && (
            <Polyline positions={routeCoords} color="blue" />
          )}
        </MapContainer>
      )}
    </div>
  );
}

export default RiderPage;



























// import { useEffect, useState } from 'react';
// import SockJS from 'sockjs-client';
// import { Client } from '@stomp/stompjs';
// import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import axios from 'axios';

// import bikeImage from '../assets/delivery-bike.png';

// const bikeIcon = new L.Icon({
//   iconUrl: bikeImage,
//   iconSize: [35, 35],
//   iconAnchor: [17, 35],
//   popupAnchor: [0, -35],
// });

// // Fix Leaflet marker icon issue
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
//   iconUrl: require('leaflet/dist/images/marker-icon.png'),
//   shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
// });

// const destination = [17.441026, 78.391635];
// const apiKey = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImNiZjczODczNDgwMTQ2ZDc4MmM0NDU1ZTkxOGQ2N2MxIiwiaCI6Im11cm11cjY0In0='; // Replace with your key




// function RiderPage() {

//   const [location, setLocation] = useState(null);
//   const [routeCoords, setRouteCoords] = useState([]);



//   useEffect(() => {
//     if (!navigator.geolocation) {
//       console.error("Geolocation is not supported by your browser.");
//       return;
//     }

//     const sendLocation = async (position) => {
//       const { latitude, longitude } = position.coords;

//       const realLocation = {
//         riderId: "rider123",
//         latitude: parseFloat(latitude.toFixed(6)),
//         longitude: parseFloat(longitude.toFixed(6)),
//       };
//       setLocation(realLocation); // set only after

//       try {
//         const response = await axios.post(
//           'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
//           {
//             coordinates: [
//               [longitude, latitude],
//               [destination[1], destination[0]],
//             ],
//           },
//           {
//             headers: {
//               Authorization: apiKey,
//               'Content-Type': 'application/json',
//             },
//           }
//         );

//         const coords = response.data.features[0].geometry.coordinates.map(
//           (coord) => [coord[1], coord[0]]
//         );
//         setRouteCoords(coords);
//       } catch (err) {
//         console.error('Error fetching route:', err);
//       }

//       try {
//         await axios.post('http://localhost:8080/api/location', realLocation);
//       } catch (err) {
//         console.error("Error sending location:", err);
//       }
//     };

//     const handleError = (error) => {
//       console.error("Error getting location:", error);
//     };

//     const interval = setInterval(() => {
//       navigator.geolocation.getCurrentPosition(sendLocation, handleError);
//       console.log("Fetching current location...");
//     }, 2000);

//     return () => clearInterval(interval); // cleanup
//   }, []); // << run only once




//   function MapAutoFocus({ location }) {
//     const map = useMap();
//     useEffect(() => {
//       if (location) {
//         map.setView([location.latitude, location.longitude], 16);
//       }
//     }, [location]);
//     return null;
//   }

//   return (
//   <div>
//    <h2 style={{
//         textAlign: 'center',
//         width: '100%',
//         margin: '20px 0'
//       }}>
//         Rider View - Sending Live Location
//     {!location ? (
//       <p>Fetching live location...</p>
//     ) : (
//       <MapContainer
//         center={[location.latitude, location.longitude]}
//         zoom={16}
//         style={{ height: '90vh', width: '100vw' }}
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; OpenStreetMap contributors'
//         />
//         <MapAutoFocus location={location} />
//         <Marker icon={bikeIcon} position={[location.latitude, location.longitude]}>
//           <Popup>
//             Live Rider<br />Lat: {location.latitude}<br />Lng: {location.longitude}
//           </Popup>
//         </Marker>
//         <Marker position={destination}>
//           <Popup>Destination</Popup>
//         </Marker>
//         {routeCoords.length > 0 && (
//           <Polyline positions={routeCoords} color="blue" />
//         )}
//       </MapContainer>
//     )}
//   </div>
// );

// }

// export default RiderPage;