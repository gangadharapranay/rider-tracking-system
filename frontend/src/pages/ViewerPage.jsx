
import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

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

const destination = [17.441026, 78.391635];
const apiKey = 'eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6ImNiZjczODczNDgwMTQ2ZDc4MmM0NDU1ZTkxOGQ2N2MxIiwiaCI6Im11cm11cjY0In0='; // Replace with your key

function ViewerPage() {
  const [location, setLocation] = useState(null);
  const [alert, setAlert] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8084/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('Connected to WebSocket');
        client.subscribe('/topic/location', async (message) => {
          const loc = JSON.parse(message.body);
          console.log("Received location via WebSocket:", loc);
          setLocation(loc);

          try {
            // Clear previous route before fetching new one
            setRouteCoords([]);

            const response = await axios.post(
              'https://api.openrouteservice.org/v2/directions/driving-car/geojson',
              {
                coordinates: [
                  [loc.longitude, loc.latitude],
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
        });


        client.subscribe('/topic/alerts', (message) => {
          const alertMessage = message.body;
          console.warn('⚠️ Alert:', alertMessage);
          setAlert(alertMessage);
          setTimeout(() => setAlert(null), 8000); // clear after 8s
        });

      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame.headers['message']);
      },
    });

    client.activate();

    return () => {
      if (client.connected) client.deactivate();
    };
  }, []);

  function MapAutoFocus({ location }) {
    const map = useMap();
    useEffect(() => {
      if (location) {
        map.setView([location.latitude, location.longitude], 16);
      }
    }, [location]);
    return null;
  }

  return (
    <div>
      <h2 style={{
        textAlign: 'center',
        width: '100%',
        margin: '20px 0'
      }}>Customer View - Live Tracking Rider</h2>
      {alert && (
        <div
          style={{
            backgroundColor: '#ffdddd',
            color: '#a94442',
            border: '1px solid #a94442',
            padding: '10px',
            margin: '10px auto',
            width: 'fit-content',
            borderRadius: '6px',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          🚨 {alert}
        </div>
      )}
      {location ? (
        <MapContainer
          center={[location.latitude, location.longitude]}
          zoom={16}
          style={{ height: '85vh', width: '100vw' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <MapAutoFocus location={location} />
          <Marker icon={bikeIcon} position={[location.latitude, location.longitude]}>
            <Popup>Live Rider<br />Lat: {location.latitude}<br />Lng: {location.longitude}</Popup>
          </Marker>
          <Marker position={destination}>
            <Popup>Destination</Popup>
          </Marker>
          {routeCoords.length > 0 && (
            <Polyline positions={routeCoords} color="blue" />
          )}
        </MapContainer>
      ) : (
        <p>Waiting for location...</p>
      )}
    </div>
  );
}

export default ViewerPage;
