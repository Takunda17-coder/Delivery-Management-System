import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";

const DriverDeliveries = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const driverId = user?.id || localStorage.getItem("driver_id");
        const token = localStorage.getItem("token");

        if (!driverId || !token) {
          setError("Driver not logged in.");
          navigate("/login");
          return;
        }

        const res = await api.get(`/deliveries/driver?driver_id=${driverId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setDeliveries(res.data || []);
      } catch (err) {
        console.error("Failed to load driver deliveries:", err);
        setError("Failed to load deliveries.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, [user, navigate]);

  const handleLogout = () => logout(navigate);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Deliveries</h2>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {deliveries.length === 0 ? (
        <p>No deliveries assigned.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deliveries.map((delivery) => (
            <div
              key={delivery.id}
              className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
            >
              <h3 className="text-lg font-semibold mb-2">
                Delivery #{delivery.id}
              </h3>
              <p><strong>Pickup:</strong> {delivery.pickup_address}</p>
              <p><strong>Dropoff:</strong> {delivery.dropoff_address}</p>
              <p><strong>Date:</strong> {delivery.delivery_date}</p>
              <p><strong>Status:</strong> {delivery.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriverDeliveries;
