import './App.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from "leaflet";
import Pbf from 'pbf'
import FeedMessage from './gtfs-realtime.browser.proto'

let auth = 'ODk0NDM4NDk0NTY5MjU1MDo4am1WRlhzd3dJcGp1QjFZRGtITTR2MFhxaXhBV0d6Rg=='

function App() {
  const [busses, setBusses] = useState([])
  const [isOff, setIsOff] = useState(true);
  const position = [62.249471452800776, 25.748510718308957]
  const zoom = 12

  useEffect(() => {
    if (isOff === true) {
      fetch('https://data.waltti.fi/jyvaskyla/api/gtfsrealtime/v1.0/feed/vehicleposition', {     
        headers: {
          Authorization: `Basic ${auth}`
        }       
      })
      .then(response => response.arrayBuffer()) // then, then, then...............
      .then(arrayBuffer => new Pbf(new Uint8Array(arrayBuffer)))
      .then(pbf => FeedMessage.read(pbf))
      .then(obj => setBusses(obj.entity))
      //console.log(obj.entity)
    }
  }, )

  const icon = L.icon({iconSize: [30,30], iconUrl: "./images/marker-icon.png" });

  const busdata = busses.map((bus,index) =>
  <Marker position={[bus.vehicle.position.latitude, bus.vehicle.position.longitude]} key={index} icon={icon}>
    <Popup>
        {bus.vehicle.vehicle.label} <br></br>
        {bus.vehicle.vehicle.license_plate}
    </Popup>
  </Marker>
 );

  return (
    <div className="mapid">
      <h1>Linkit kartalla</h1>
        <MapContainer center={position} zoom={zoom} scrollWheelZoom={false}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {busdata}
       </MapContainer>
       <button className="button" onClick={() => setIsOff(!isOff)}>{ isOff ? 'Stop simulation' : 'Start simulation' }</button>
    </div>
  );
}

export default App;
