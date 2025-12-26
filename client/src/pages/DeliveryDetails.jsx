import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import MapComponent from "../components/MapComponent";
import AdminLayout from "../components/AdminLayout";

const socket = io("http://localhost:5000");

export default function DeliveryDetails() {
    const { id } = useParams();
    const [delivery, setDelivery] = useState(null);
    const [driverLocation, setDriverLocation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDelivery = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(`http://localhost:5000/api/delivery/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setDelivery(res.data);
                if (res.data.current_lat && res.data.current_lng) {
                    setDriverLocation([parseFloat(res.data.current_lat), parseFloat(res.data.current_lng)]);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching delivery:", error);
                setLoading(false);
            }
        };

        fetchDelivery();

        socket.emit("join_delivery", id);

        socket.on("location_updated", (data) => {
            console.log("Location updated:", data);
            setDriverLocation([data.lat, data.lng]);
        });

        return () => {
            socket.off("location_updated");
        };
    }, [id]);

    if (loading) return <div className="p-4">Loading...</div>;
    if (!delivery) return <div className="p-4">Delivery not found</div>;

    return (
        <AdminLayout>
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Delivery Tracking #{id}</h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-xl font-semibold mb-2">Details</h2>
                        <div className="space-y-2">
                            <p><span className="font-medium">Status:</span> {delivery.status}</p>
                            <p><span className="font-medium">Pickup:</span> {delivery.pickup_address}</p>
                            <p><span className="font-medium">Dropoff:</span> {delivery.dropoff_address}</p>
                            <p><span className="font-medium">Driver ID:</span> {delivery.driver_id || "Unassigned"}</p>
                            <p><span className="font-medium">Recipient:</span> {delivery.recipient_name}</p>
                            <p><span className="font-medium">Contact:</span> {delivery.recipient_contact}</p>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded shadow h-[500px]">
                        <h2 className="text-xl font-semibold mb-2">Live Map</h2>
                        <MapComponent
                            pickup={delivery.pickup_lat ? [delivery.pickup_lat, delivery.pickup_lng] : null}
                            dropoff={delivery.dropoff_lat ? [delivery.dropoff_lat, delivery.dropoff_lng] : null}
                            current={driverLocation}
                            route={delivery.route_polyline}
                        />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
