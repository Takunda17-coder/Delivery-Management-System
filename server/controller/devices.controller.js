const { Device, Drivers } = require("../models");

// Create a new device
const createDevice = async (req, res) => {
    try {
        const { name, serial_number, driver_id } = req.body;

        // Check if serial number exists
        const existingDevice = await Device.findOne({ where: { serial_number } });
        if (existingDevice) {
            return res.status(400).json({ message: "Device with this serial number already exists" });
        }

        // Check if driver exists (if provided)
        if (driver_id) {
            const driver = await Drivers.findByPk(driver_id);
            if (!driver) {
                return res.status(404).json({ message: "Driver not found" });
            }
        }

        const device = await Device.create({
            name,
            serial_number,
            driver_id: driver_id || null,
        });

        res.status(201).json(device);
    } catch (error) {
        console.error("Error creating device:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Get all devices
const getAllDevices = async (req, res) => {
    try {
        const devices = await Device.findAll({
            include: [{ model: Drivers, as: "driver" }]
        });
        res.status(200).json(devices);
    } catch (error) {
        console.error("Error fetching devices:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Update device
const updateDevice = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, driver_id, status } = req.body;

        const device = await Device.findByPk(id);
        if (!device) {
            return res.status(404).json({ message: "Device not found" });
        }

        if (driver_id !== undefined) {
            if (driver_id) {
                const driver = await Drivers.findByPk(driver_id);
                if (!driver) return res.status(404).json({ message: "Driver not found" });
            }
            device.driver_id = driver_id;
        }

        if (name) device.name = name;
        if (status) device.status = status;

        await device.save();
        res.status(200).json(device);
    } catch (error) {
        console.error("Error updating device:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Delete device
const deleteDevice = async (req, res) => {
    try {
        const { id } = req.params;
        const device = await Device.findByPk(id);
        if (!device) return res.status(404).json({ message: "Device not found" });

        await device.destroy();
        res.status(200).json({ message: "Device deleted" });
    } catch (error) {
        console.error("Error deleting device:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    createDevice,
    getAllDevices,
    updateDevice,
    deleteDevice
};
