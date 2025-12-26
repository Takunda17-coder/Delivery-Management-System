import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import "leaflet-routing-machine";

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

const RoutingControl = ({ pickup, dropoff }) => {
    const map = useMap();
    const routingControlRef = useRef(null);

    useEffect(() => {
        if (!map || !pickup || !dropoff) return;

        // Remove previous routing control if it exists
        if (routingControlRef.current) {
            map.removeControl(routingControlRef.current);
        }

        const routingControl = L.Routing.control({
            waypoints: [
                L.latLng(pickup[0], pickup[1]),
                L.latLng(dropoff[0], dropoff[1]),
            ],
            routeWhileDragging: false,
            show: false, // Hide the instruction container
            addWaypoints: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            showAlternatives: false,
            lineOptions: {
                styles: [{ color: "blue", opacity: 0.6, weight: 4 }],
            },
            createMarker: () => null, // Don't create default markers, we use our own
        }).addTo(map);

        routingControlRef.current = routingControl;

        return () => {
            if (map && routingControlRef.current) {
                map.removeControl(routingControlRef.current);
            }
        };
    }, [map, pickup, dropoff]);

    return null;
};

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
    const center = current || pickup || dropoff || [0, 0]; // Fallback if nothing set
    const polylinePositions = route ? JSON.parse(route) : [];

    return (
        <MapContainer center={center} zoom={13} style={{ height: "400px", width: "100%", borderRadius: "10px", zIndex: 0 }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Route Optimization */}
            {pickup && dropoff && <RoutingControl pickup={pickup} dropoff={dropoff} />}

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
                <Marker position={current} icon={DefaultIcon}> {/* Explicitly use default icon or custom driver icon */}
                    <Popup>Current Driver Location</Popup>
                </Marker>
            )}

            <RecenterAutomatically lat={center[0]} lng={center[1]} />
        </MapContainer>
    );
};

export default MapComponent;
