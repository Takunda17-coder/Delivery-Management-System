const { Orders, Customer } = require("../models");

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
      price,
      pickup_address,
      total,
      weight,
    });

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
      include: [{ model: Customer, as: "customer" }],
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
      include: [{ model: Customer, as: "customer" }],
    });

    if (!order) return res.status(404).json({ error: "Order not found" });

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Failed to retrieve order" });
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
    } = req.body;

    const order = await Orders.findByPk(id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (customer_id) {
      const customer = await Customer.findByPk(customer_id);
      if (!customer)
        return res.status(404).json({ error: "Customer not found" });
      order.customer_id = customer_id;
    }

    // Update fields if provided
    if (order_item) order.order_item = order_item;
    if (quantity) order.quantity = quantity;
    if (price) order.price = price;
    if (pickup_address) order.pickup_address = pickup_address;
    if (total) order.total = total;
    if (weight) order.weight = weight;

    await order.save();
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
  updateOrder,
  deleteOrder,
  getUnattendedOrders,
};
