// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
// import L from 'leaflet';

// // Fix for missing marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

// const center = [17.443616, 78.382064]; // source
// const destination = [17.441026, 78.391635]; // destination

// function RouteMapORS() {
//   const [routeCoords, setRouteCoords] = useState([]);

//   useEffect(() => {
//     const fetchRoute = async () => {
//       const apiKey = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImNiZjczODczNDgwMTQ2ZDc4MmM0NDU1ZTkxOGQ2N2MxIiwiaCI6Im11cm11cjY0In0='; // replace with your OpenRouteService API key
//       const url = 'https://api.openrouteservice.org/v2/directions/driving-car/geojson';

//       const body = {
//         coordinates: [
//           [center[1], center[0]],        // [lng, lat]
//           [destination[1], destination[0]],
//         ]
//       };

//       const response = await axios.post(url, body, {
//         headers: {
//           'Authorization': apiKey,
//           'Content-Type': 'application/json'
//         }
//       });

//       const coordinates = response.data.features[0].geometry.coordinates;
//       const formattedCoords = coordinates.map(coord => [coord[1], coord[0]]);
//       setRouteCoords(formattedCoords);
//     };

//     fetchRoute();
//   }, []);

//   return (
//     <MapContainer center={center} zoom={15} style={{ height: '100vh', width: '100vw' }}>
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//       />
//       <Marker position={center}>
//         <Popup>Source</Popup>
//       </Marker>
//       <Marker position={destination}>
//         <Popup>Destination</Popup>
//       </Marker>
//       {routeCoords.length > 0 && (
//         <Polyline positions={routeCoords} color="blue" weight={5} />
//       )}
//     </MapContainer>
//   );
// }

// export default RouteMapORS;

































// import React, { useEffect, useState, useRef } from 'react';
// import axios from 'axios';
// import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet';
// import L from 'leaflet';

// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

// const initialCenter = [17.443616, 78.382064]; // Source
// const destination = [17.441026, 78.391635];   // Destination

// function RouteMapORS() {
//   const [routeCoords, setRouteCoords] = useState([]);
//   const [currentPosition, setCurrentPosition] = useState(initialCenter);
//   const indexRef = useRef(0);

//   useEffect(() => {
//     const fetchRoute = async () => {
//       const apiKey = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImNiZjczODczNDgwMTQ2ZDc4MmM0NDU1ZTkxOGQ2N2MxIiwiaCI6Im11cm11cjY0In0='; // Replace with your OpenRouteService API key
//       const url = 'https://api.openrouteservice.org/v2/directions/driving-car/geojson';

//       const body = {
//         coordinates: [
//           [initialCenter[1], initialCenter[0]],
//           [destination[1], destination[0]],
//         ]
//       };

//       try {
//         const response = await axios.post(url, body, {
//           headers: {
//             'Authorization': apiKey,
//             'Content-Type': 'application/json'
//           }
//         });

//         const coordinates = response.data.features[0].geometry.coordinates;
//         const formattedCoords = coordinates.map(coord => [coord[1], coord[0]]);
//         setRouteCoords(formattedCoords);
//         setCurrentPosition(formattedCoords[0]); // Start at first point
//         indexRef.current = 1; // Prepare for animation
//       } catch (error) {
//         console.error('Failed to fetch route:', error);
//       }
//     };

//     fetchRoute();
//   }, []);

//   useEffect(() => {
//     if (routeCoords.length === 0) return;

//     const interval = setInterval(() => {
//       if (indexRef.current < routeCoords.length) {
//         setCurrentPosition(routeCoords[indexRef.current]);
//         indexRef.current++;
//       } else {
//         clearInterval(interval);
//       }
//     }, 500); // move every 500ms

//     return () => clearInterval(interval);
//   }, [routeCoords]);

//   return (
//     <MapContainer center={initialCenter} zoom={15} style={{ height: '100vh', width: '100vw' }}>
//       <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      
//       <Marker position={currentPosition}>
//         <Popup>Moving Marker (Source)</Popup>
//       </Marker>

//       <Marker position={destination}>
//         <Popup>Destination</Popup>
//       </Marker>

//       {routeCoords.length > 0 && (
//         <Polyline positions={routeCoords} color="blue" weight={5} />
//       )}
//     </MapContainer>
//   );
// }

// export default RouteMapORS;
