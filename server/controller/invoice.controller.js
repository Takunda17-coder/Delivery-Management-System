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
        status: status || "Unpaid",
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

exports.getInvoicesByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;

    const invoices = await Invoice.findAll({
      where: { customer_id: customerId },
      order: [['createdAt', 'DESC']],
      include: [
        { model: Customer, as: "customer" },
        { model: Orders, as: "order" },
        { model: Drivers, as: "driver" },
        { model: Delivery, as: "delivery" },
        { model: Vehicle, as: "vehicle" },
      ],
    });

    res.json(invoices);
  } catch (err) {
    console.error("Error fetching customer invoices:", err);
    res.status(500).json({ message: "Server error" });
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

// ---------------------------- GENERATE PDF ----------------------------
const PDFDocument = require('pdfkit');

exports.downloadInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Invoice.findByPk(id, {
      include: [
        { model: Customer, as: "customer" },
        { model: Orders, as: "order" },
        { model: Delivery, as: "delivery" },
        { model: Drivers, as: "driver" }
      ]
    });

    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const doc = new PDFDocument({ margin: 50 });

    // Set Headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.invoice_id}.pdf`);

    // Pipe to response
    doc.pipe(res);

    // --- PDF CONTENT ---

    // Header
    doc.fillColor('#e65100') // Deep Orange
      .fontSize(20)
      .text('INVOICE', { align: 'right' })
      .moveDown();

    doc.fillColor('#444444')
      .fontSize(10)
      .text('Fleet Management Systems', 200, 50, { align: 'right' })
      .text('123 Logistics Way', 200, 65, { align: 'right' })
      .text('Transport City, TC 90210', 200, 80, { align: 'right' })
      .moveDown();

    // Invoice Details
    doc.text(`Invoice ID: ${invoice.invoice_id}`, 50, 50)
      .text(`Date: ${new Date(invoice.issue_date).toDateString()}`, 50, 65)
      .text(`Status: ${invoice.status}`, 50, 80)
      .moveDown();

    doc.moveDown();
    const customerName = invoice.customer ? invoice.customer.first_name + ' ' + invoice.customer.last_name : "Customer";
    const customerEmail = invoice.customer ? invoice.customer.email : "";

    // Bill To
    doc.text('Bill To:', 50, 160)
      .font('Helvetica-Bold')
      .text(customerName, 50, 175)
      .font('Helvetica')
      .text(customerEmail, 50, 190)
      .moveDown();

    // Table Header
    const tableTop = 250;
    doc.font('Helvetica-Bold');
    doc.text('Item', 50, tableTop);
    doc.text('Qty', 300, tableTop);
    doc.text('Price', 370, tableTop, { width: 90, align: 'right' });
    doc.text('Line Total', 470, tableTop, { width: 90, align: 'right' });

    doc.moveTo(50, tableTop + 15).lineTo(560, tableTop + 15).stroke();
    doc.font('Helvetica');

    // Parse Order Items
    let orderItems = [];
    try {
      orderItems = JSON.parse(invoice.order_items);
    } catch (e) {
      orderItems = [{ name: "Order Item", quantity: invoice.quantity, price: invoice.price }];
    }

    let i = 0;
    const rowHeight = 30;
    let position = tableTop + 30;

    orderItems.forEach(item => {
      const lineTotal = item.quantity * item.price;

      doc.text(item.name || "Item", 50, position);
      doc.text(item.quantity, 300, position);
      doc.text(`$${Number(item.price).toFixed(2)}`, 370, position, { width: 90, align: 'right' });
      doc.text(`$${Number(lineTotal).toFixed(2)}`, 470, position, { width: 90, align: 'right' });
      position += rowHeight;
    });

    // Delivery Fee
    position += 10;
    doc.moveTo(50, position).lineTo(560, position).stroke();
    position += 20;

    doc.text('Delivery Fee', 370, position, { width: 90, align: 'right' });
    doc.text(`$${Number(invoice.delivery_fee).toFixed(2)}`, 470, position, { width: 90, align: 'right' });
    position += rowHeight;

    // Total
    doc.font('Helvetica-Bold').fontSize(14);
    doc.text('Total', 370, position, { width: 90, align: 'right' });
    doc.text(`$${Number(invoice.total).toFixed(2)}`, 470, position, { width: 90, align: 'right' });

    // Footer
    doc.fontSize(10).font('Helvetica');
    doc.text('Thank you for your business!', 50, 700, { align: 'center', width: 500 });

    doc.end();

  } catch (err) {
    console.error("Error generating PDF:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to generate PDF" });
    }
  }
};
