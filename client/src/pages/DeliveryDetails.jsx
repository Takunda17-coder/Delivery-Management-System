import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";
import MapComponent from "../components/MapComponent";
import AdminLayout from "../components/AdminLayout";
import DriverLayout from "../components/DriverLayout";
import CustomerLayout from "../components/CustomerLayout";
import { useAuth } from "../context/AuthContext";

const socket = io("https://delivery-management-system-backend-2385.onrender.com");

export default function DeliveryDetails() {
    const { id } = useParams();
    const { user } = useAuth();
    const [delivery, setDelivery] = useState(null);
    const [driverLocation, setDriverLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isDriver, setIsDriver] = useState(false);
    const watchIdRef = useRef(null);

    useEffect(() => {
        const fetchDeliveryAndCheckDriver = async () => {
            try {
                const token = localStorage.getItem("token");

                // 1. Fetch Delivery
                const res = await axios.get(`https://delivery-management-system-backend-2385.onrender.com/api/delivery/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setDelivery(res.data);
                if (res.data.current_lat && res.data.current_lng) {
                    setDriverLocation([parseFloat(res.data.current_lat), parseFloat(res.data.current_lng)]);
                }

                // 2. Check if current user is the assigned driver
                if (user && user.role === "driver") {
                    const driverRes = await axios.get(`https://delivery-management-system-backend-2385.onrender.com/api/drivers/user/${user.user_id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    const myDriverId = driverRes.data.driver_id;
                    if (parseInt(myDriverId) === parseInt(res.data.driver_id)) {
                        setIsDriver(true);
                    }
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching delivery:", error);
                setLoading(false);
            }
        };

        fetchDeliveryAndCheckDriver();

        socket.emit("join_delivery", id);

        socket.on("location_updated", (data) => {
            console.log("Location updated:", data);
            setDriverLocation([data.lat, data.lng]);
        });

        return () => {
            socket.off("location_updated");
        };
    }, [id, user]);

    // ✅ Active Tracking for Driver
    useEffect(() => {
        if (isDriver && delivery?.status === "On Route") {
            console.log("Starting active tracking...");

            if (!navigator.geolocation) {
                console.error("Geolocation is not supported by this browser.");
                return;
            }

            watchIdRef.current = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log("📍 Emitting location:", latitude, longitude);

                    // Update local state immediately for smooth UI
                    setDriverLocation([latitude, longitude]);

                    // Emit to server
                    socket.emit("update_location", {
                        deliveryId: id,
                        lat: latitude,
                        lng: longitude,
                    });
                },
                (error) => console.error("Error getting location:", error),
                { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
            );
        }

        return () => {
            if (watchIdRef.current) {
                console.log("Stopping active tracking...");
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
        };
    }, [isDriver, delivery?.status, id]);

    if (loading) return <div className="p-4">Loading...</div>;
    if (!delivery) return <div className="p-4">Delivery not found</div>;

    // Dynamic Layout Selection
    const getLayout = (children) => {
        switch (user?.role) {
            case "admin":
                return <AdminLayout>{children}</AdminLayout>;
            case "driver":
                return (
                    // Avoid circular dependency if DriverLayout uses same imports? No, should be fine.
                    // But wait, make sure we import them.
                    <DriverLayout>{children}</DriverLayout>
                );
            case "customer":
                return <CustomerLayout>{children}</CustomerLayout>;
            default:
                // Fallback for unauthenticated or unknown roles (should be protected by route anyway)
                return <div className="min-h-screen bg-gray-50">{children}</div>;
        }
    };

    return getLayout(
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Delivery Tracking #{id}</h1>

            {isDriver && delivery.status === "On Route" && (
                <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4" role="alert">
                    <p className="font-bold">Active Tracking</p>
                    <p>You are actively sharing your location for this delivery.</p>
                </div>
            )}

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
    );
}
