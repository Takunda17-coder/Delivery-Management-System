const { Delivery } = require("./models");

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        // Join a room for a specific delivery
        socket.on("join_delivery", (deliveryId) => {
            socket.join(`delivery_${deliveryId}`);
            console.log(`User ${socket.id} joined delivery_${deliveryId}`);
        });

        // ✅ Admin joins admin room
        socket.on("join_admin_room", () => {
            socket.join("admin_room");
            console.log(`Admin ${socket.id} joined admin_room`);
        });

        // ✅ Customer joins their specific room
        socket.on("join_customer_room", (customerId) => {
            socket.join(`customer_${customerId}_room`);
            console.log(`Customer ${socket.id} joined customer_${customerId}_room`);
        });

        // ✅ Driver joins their specific room
        socket.on("join_driver_room", (driverId) => {
            socket.join(`driver_${driverId}_room`);
            console.log(`Driver ${socket.id} joined driver_${driverId}_room`);
        });

        // Driver updates location
        socket.on("update_location", async (data) => {
            const { deliveryId, lat, lng } = data;

            try {
                // Update database
                await Delivery.update(
                    { current_lat: lat, current_lng: lng },
                    { where: { delivery_id: deliveryId } }
                );

                // Broadcast to room
                io.to(`delivery_${deliveryId}`).emit("location_updated", { lat, lng });
            } catch (error) {
                console.error("Error updating location:", error);
            }
        });

        // ✅ Device sends GPS update (linked to Driver)
        socket.on("device_update", async (data) => {
            const { serial_number, lat, lng } = data;
            const { Device } = require("./models");

            try {
                // Find device and linked driver
                const device = await Device.findOne({
                    where: { serial_number },
                    include: ["driver"] // ensure association alias is correct (as: "driver")
                });

                if (device) {
                    // Update Device Location
                    device.last_lat = lat;
                    device.last_lng = lng;
                    await device.save();

                    // If linked to Driver, broadcast update
                    if (device.driver_id) {
                        io.to("admin_room").emit("driver_location_update", {
                            driver_id: device.driver_id,
                            first_name: device.driver?.first_name,
                            last_name: device.driver?.last_name,
                            lat,
                            lng,
                            serial_number
                        });
                        console.log(`📡 GPS Update: Driver ${device.driver_id} (${lat}, ${lng}) from ID: ${serial_number}`);
                    } else {
                        console.log(`⚠️ Unassigned Device Update: ${serial_number} (${lat}, ${lng})`);
                    }
                } else {
                    console.log(`❌ Unknown Device Update: ${serial_number}`);
                }
            } catch (error) {
                console.error("Error processing device update:", error);
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};
