const { Orders, Customer, Invoice } = require("../models");

// ✅ Create a new order
const createOrder = async (req, res) => {
  try {
    const {
      customer_id,
      order_item,
      quantity,
      price,
      pickup_address,
      total,
      weight,
      status,
    } = req.body;

    // Debug request body
    console.log("Incoming order body:", req.body);

    // Ensure the customer exists
    const customer = await Customer.findByPk(customer_id);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Create the order with required fields
    const newOrder = await Orders.create({
      customer_id: customer_id,
      order_item,
      quantity,
      price: price || 0, // ✅ Default to 0 if not provided (Quote Pending)
      pickup_address,
      dropoff_address,
      total: total || 0,
      weight,
      status: status || "Pending", // default to "Pending" if not provided
    });

    // ✅ Emit New Order Event to Admins
    if (req.io) {
      req.io.to("admin_room").emit("new_order", {
        message: `New order from ${customer.first_name} ${customer.last_name}`,
        order: newOrder,
      });
    }

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

// ✅ Retrieve all orders (optional filter by customer_id)
const getAllOrders = async (req, res) => {
  try {
    const { customer_id } = req.query;

    let filter = {};
    if (customer_id) {
      filter.customer_id = customer_id; // apply filtering
    }

    const orders = await Orders.findAll({
      where: filter,
      include: [{ model: Customer, as: "customer" }, { model: require('../models').Delivery, as: "delivery" }],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Failed to retrieve orders" });
  }
};

// ✅ Retrieve order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Orders.findByPk(id, {
      include: [{ model: Customer, as: "customer" }, { model: require('../models').Delivery, as: "delivery" }],
    });

    if (!order) return res.status(404).json({ error: "Order not found" });

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Failed to retrieve order" });
  }
};

const getOrdersByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    const orders = await Orders.findAll({
      where: { customer_id: customerId },
      order: [["createdAt", "DESC"]],
    });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this customer." });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getOrdersByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    // Ensure the customer exists
    const customer = await Customer.findByPk(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Fetch orders for this customer, including invoices
    const orders = await Orders.findAll({
      where: { customer_id: customerId },
      include: [
        { model: Customer, as: "customer" },
        { model: Invoice, as: "invoices" } // Include invoice for 1:1 relation
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json(orders);
  } catch (err) {
    console.error("Error fetching customer orders:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// ✅ Update order
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      customer_id,
      order_item,
      quantity,
      price,
      pickup_address,
      total,
      weight,
      status,
    } = req.body;

    const order = await Orders.findByPk(id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (customer_id) {
      const customer = await Customer.findByPk(customer_id);
      if (!customer)
        return res.status(404).json({ error: "Customer not found" });
      order.customer_id = customer_id;
    }

    // Check if status is changing for notification
    const oldStatus = order.status;

    // Update fields if provided
    if (order_item) order.order_item = order_item;
    if (quantity) order.quantity = quantity;
    if (price) order.price = price;
    if (pickup_address) order.pickup_address = pickup_address;
    if (dropoff_address) order.dropoff_address = dropoff_address;
    if (total) order.total = total;
    if (weight) order.weight = weight;
    if (status) order.status = status;

    await order.save();

    // ✅ Emit Status Update Event to Specific Customer
    if (req.io && status && status !== oldStatus) {
      req.io.to(`customer_${order.customer_id}_room`).emit("order_status_updated", {
        message: `Your order #${order.order_id} is now ${status}`,
        order_id: order.order_id,
        status: status,
      });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Failed to update order" });
  }
};

// ✅ Delete order
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Orders.findByPk(id);

    if (!order) return res.status(404).json({ error: "Order not found" });

    await order.destroy();
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Failed to delete order" });
  }
};

const getUnattendedOrders = async (req, res) => {
  try {
    const unattendedOrders = await Orders.findAll({
      where: { status: "unattended" },
      include: [{ model: Customer, as: "customer" }]
    });
    res.status(200).json(unattendedOrders);
  } catch (error) {
    console.error("Error fetching unattended orders:", error);
    res.status(500).json({ message: "Error fetching unattended orders" });
  }
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  getOrdersByCustomer,
  updateOrder,
  deleteOrder,
  getUnattendedOrders,
};
