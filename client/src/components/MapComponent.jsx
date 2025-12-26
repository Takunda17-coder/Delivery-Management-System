import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const RecenterAutomatically = ({ lat, lng }) => {
    const map = useMap();
    useEffect(() => {
        if (lat && lng) {
            map.setView([lat, lng]);
        }
    }, [lat, lng, map]);
    return null;
};

const MapComponent = ({ pickup, dropoff, current, route }) => {
    const center = current || pickup || [0, 0];
    const polylinePositions = route ? JSON.parse(route) : [];

    return (
        <MapContainer center={center} zoom={13} style={{ height: "400px", width: "100%", borderRadius: "10px", zIndex: 0 }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {pickup && (
                <Marker position={pickup}>
                    <Popup>Pickup Location</Popup>
                </Marker>
            )}
            {dropoff && (
                <Marker position={dropoff}>
                    <Popup>Dropoff Location</Popup>
                </Marker>
            )}
            {current && (
                <Marker position={current}>
                    <Popup>Current Driver Location</Popup>
                </Marker>
            )}
            {polylinePositions.length > 0 && <Polyline positions={polylinePositions} color="blue" />}
            <RecenterAutomatically lat={center[0]} lng={center[1]} />
        </MapContainer>
    );
};

export default MapComponent;
