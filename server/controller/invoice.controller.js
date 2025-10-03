const { Invoice, Delivery, Drivers, Orders, Customer, Vehicle, sequelize } = require("../models");

exports.createInvoice = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { order_id, customer_id, delivery_id, driver_id, vehicle_id, delivery_fee, issue_date, status } = req.body;

    // --- Validate required fields first (no transaction needed) ---
    if (!order_id || !customer_id || !delivery_id || !driver_id || !vehicle_id || delivery_fee === undefined) {
      return res.status(400).json({ message: "All required fields must be provided." });
    }

    // --- Fetch related records (no transaction needed) ---
    const [order, customer, delivery, driver, vehicle] = await Promise.all([
      Orders.findByPk(order_id),
      Customer.findByPk(customer_id),
      Delivery.findByPk(delivery_id),
      Drivers.findByPk(driver_id),
      Vehicle.findByPk(vehicle_id),
    ]);

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (!customer) return res.status(404).json({ message: "Customer not found" });
    if (!delivery) return res.status(404).json({ message: "Delivery not found" });
    if (!driver) return res.status(404).json({ message: "Driver not found" });
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });

    // --- Prepare order_items ---
    const orderItems = [
      { name: order.order_item, quantity: order.quantity, price: order.price }
    ];

    const subtotal = order.quantity * parseFloat(order.price);
    const total = subtotal + parseFloat(delivery_fee);

    // --- Create invoice inside transaction ---
    const newInvoice = await Invoice.create(
      {
        order_id,
        customer_id,
        delivery_id,
        driver_id,
        vehicle_id,
        order_items: JSON.stringify(orderItems),
        quantity: order.quantity,
        price: order.price,
        total,
        delivery_fee,
        issue_date: issue_date || new Date(),
        status: status || "unpaid",
      },
      { transaction: t }
    );

    await t.commit();
    res.status(201).json(newInvoice);

  } catch (error) {
    await t.rollback();
    console.error("Error creating invoice:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// ✅ Get all invoices
exports.getAllInvoices = async (_req, res) => {
  try {
    const invoices = await Invoice.findAll({
      include: [
        { model: Customer, as: "customer" },
        { model: Orders, as: "order" },
        { model: Drivers, as: "driver" },
        { model: Delivery, as: "delivery" },
        { model: Vehicle, as: "vehicle" },
      ],
    });
    res.status(200).json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({ error: "Failed to retrieve invoices" });
  }
};

// ✅ Get invoice by ID
exports.getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findByPk(id, {
      include: [
        { model: Customer, as: "customer" },
        { model: Orders, as: "order" },
        { model: Drivers, as: "driver" },
        { model: Delivery, as: "delivery" },
        { model: Vehicle, as: "vehicle" },
      ],
    });

    if (!invoice) return res.status(404).json({ error: "Invoice not found" });
    res.status(200).json(invoice);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    res.status(500).json({ error: "Failed to retrieve invoice" });
  }
};


// ✅ Update invoice
exports.updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findByPk(id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    await invoice.update(req.body);
    res.status(200).json(invoice);
  } catch (error) {
    console.error("Error updating invoice:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Delete invoice
exports.deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findByPk(id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    await invoice.destroy();
    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
