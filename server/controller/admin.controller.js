const { Orders, Deliveries, Drivers } = require("../models");

exports.getAdminStats = async (req, res) => {
  try {
    const totalOrders = await Orders.count();
    const totalDeliveries = await Deliveries.count();
    const totalDrivers = await Drivers.count();
    const activeDeliveries = await Deliveries.count({ where: { status: "in-route" } });

    res.json({
      totalOrders,
      totalDeliveries,
      totalDrivers,
      activeDeliveries,
    });
  } catch (err) {
    console.error("Error fetching admin stats:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getOrdersTrend = async (req, res) => {
  try {
    const recentOrders = await Orders.findAll({
      attributes: ["order_id", "createdAt", "status"],
      limit: 10,
      order: [["createdAt", "DESC"]],
    });

    res.json(recentOrders);
  } catch (err) {
    console.error("Error fetching order trend:", err);
    res.status(500).json({ message: "Server error" });
  }
};
