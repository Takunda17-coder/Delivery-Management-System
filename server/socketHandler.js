const { Delivery } = require("./models");

module.exports = (io) => {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        // Join a room for a specific delivery
        socket.on("join_delivery", (deliveryId) => {
            socket.join(`delivery_${deliveryId}`);
            console.log(`User ${socket.id} joined delivery_${deliveryId}`);
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

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
};
