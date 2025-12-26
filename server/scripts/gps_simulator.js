const io = require("socket.io-client");
const socket = io("http://localhost:5000");

const SERIAL_NUMBER = "TEST_GPS_001";

socket.on("connect", () => {
    console.log("✅ Connected to server as Device Simulator");

    // Simulate GPS updates every 3 seconds
    setInterval(() => {
        const lat = -17.82 + (Math.random() * 0.01);
        const lng = 31.05 + (Math.random() * 0.01);

        console.log(`📡 Sending coordinates: ${lat}, ${lng}`);
        socket.emit("device_update", {
            serial_number: SERIAL_NUMBER,
            lat,
            lng
        });
    }, 3000);
});

socket.on("disconnect", () => {
    console.log("❌ Disconnected");
});
