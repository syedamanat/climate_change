import React, { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from 'leaflet';

const icon = L.icon({ iconUrl: "/images/marker-icon.png" });


function ChangeMapView(props) {
  const map = useMap();

  // console.log('LAT:', props.lat);
  // console.log('LONG', props.long)
  map.setView([props.lat || 20, props.long || 77], props.zoom || 4);

  return null;
}
const Map = (props) => {
  const [lat, setLat] = useState(20);
  const [long, setLong] = useState(77);
  const [zoom, setZoom] = useState(2);

  useEffect(() => {
    setLat(props.lat)
  }, [props.lat]);

  useEffect(() => {
    setLong(props.long)
  }, [props.long]);

  useEffect(() => {
    setZoom(props.zoom)
  }, [props.zoom]);

  return (
    <div style={{ height: '500px' }}>
      <MapContainer center={[lat, long]} zoom={props.zoom || 4}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {(lat && long) ?
          <Marker position={[lat, long]} icon={icon} />
          : ''
        }
        <ChangeMapView lat={lat} long={long} zoom={zoom} />
      </MapContainer>
    </div>
  );
}

export default Map;