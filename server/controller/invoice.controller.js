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

    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    // Set Headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.invoice_id}.pdf`);

    doc.pipe(res);

    // --- LOGO (Text-based simulation since no image provided) ---
    // Draw a colored rounded rectangle for branding
    doc.roundedRect(50, 45, 50, 50, 5)
      .fill("#FF5722"); // Deep Orange

    doc.fillColor("#FFFFFF")
      .font("Helvetica-Bold")
      .fontSize(24)
      .text("F", 64, 57);

    doc.fillColor("#333333")
      .font("Helvetica-Bold")
      .fontSize(20)
      .text("FLEET", 110, 50)
      .text("MANAGEMENT", 110, 72);

    // --- INVOICE HEADER (Right Side) ---
    doc.fillColor("#888888")
      .font("Helvetica")
      .fontSize(10)
      .text("INVOICE ID", 400, 50, { align: "right" })
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor("#000000")
      .text(`#${invoice.invoice_id}`, 400, 62, { align: "right" });

    doc.font("Helvetica")
      .fontSize(10)
      .fillColor("#888888")
      .text("DATE", 400, 80, { align: "right" })
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor("#000000")
      .text(new Date(invoice.issue_date).toLocaleDateString(), 400, 92, { align: "right" });

    // Status Badge
    doc.roundedRect(490, 115, 60, 20, 10)
      .fill(invoice.status === "Paid" ? "#E8F5E9" : "#FFEBEE");

    doc.fillColor(invoice.status === "Paid" ? "#2E7D32" : "#C62828")
      .fontSize(10)
      .text(invoice.status.toUpperCase(), 490, 120, { width: 60, align: "center" });

    // --- COMPANY INFO ---
    doc.moveDown(4);
    doc.fillColor("#555555")
      .fontSize(10)
      .text("123 Logistics Way", 50)
      .text("Transport City, TC 90210")
      .text("support@fleetmanager.com")
      .moveDown();

    // Divider
    doc.moveTo(50, 190).lineTo(550, 190).strokeColor("#EEEEEE").stroke();

    // --- BILL TO ---
    const customerName = invoice.customer ? `${invoice.customer.first_name} ${invoice.customer.last_name || ""}` : "Customer";
    const customerEmail = invoice.customer ? invoice.customer.email : "";

    doc.text("BILL TO:", 50, 210)
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor("#000000")
      .text(customerName, 50, 225)
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#555555")
      .text(customerEmail, 50, 240)
      .moveDown();

    // --- TABLE HEADERS ---
    const tableTop = 290;
    const itemX = 50;
    const qtyX = 350;
    const priceX = 420;
    const totalX = 500;

    doc.rect(50, tableTop - 10, 500, 30).fill("#F9FAFB");
    doc.fillColor("#333333")
      .font("Helvetica-Bold")
      .fontSize(10);

    doc.text("ITEM DESCRIPTION", itemX + 10, tableTop);
    doc.text("QTY", qtyX, tableTop, { align: "center" });
    doc.text("PRICE", priceX, tableTop, { align: "right" });
    doc.text("AMOUNT", totalX, tableTop, { align: "right" });

    // --- TABLE ROWS ---
    let orderItems = [];
    try {
      orderItems = JSON.parse(invoice.order_items);
    } catch (e) {
      orderItems = [{ name: "Order Item", quantity: invoice.quantity, price: invoice.price }];
    }

    let y = tableTop + 35;
    doc.font("Helvetica").fontSize(10).fillColor("#000000");

    orderItems.forEach(item => {
      const lineTotal = item.quantity * item.price;

      doc.text(item.name || "N/A", itemX + 10, y);
      doc.text(item.quantity, qtyX, y, { align: "center" });
      doc.text(`$${Number(item.price).toFixed(2)}`, priceX, y, { align: "right" });
      doc.text(`$${Number(lineTotal).toFixed(2)}`, totalX, y, { align: "right" });

      y += 30; // Row height

      // Light divider
      doc.moveTo(50, y - 10).lineTo(550, y - 10).strokeColor("#F5F5F5").stroke();
    });

    // --- SUMMARY ---
    y += 10;
    doc.fontSize(10);

    // Delivery Fee
    doc.text("Delivery Fee:", priceX - 50, y, { width: 100, align: "right" });
    doc.text(`$${Number(invoice.delivery_fee).toFixed(2)}`, totalX, y, { align: "right" });

    y += 20;

    // Grand Total
    doc.rect(priceX - 60, y - 5, 200, 30).fill("#FFF3E0"); // Light Orange bg
    doc.fillColor("#D84315") // Darker orange text
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("Total:", priceX - 50, y + 5, { width: 100, align: "right" });

    doc.text(`$${Number(invoice.total).toFixed(2)}`, totalX, y + 5, { align: "right" });

    // --- FOOTER ---
    doc.fillColor("#999999")
      .fontSize(9)
      .font("Helvetica")
      .text("Thank you for your business. For any questions, please contact support.", 50, 750, { align: "center", width: 500 });

    doc.end();

  } catch (err) {
    console.error("Error generating PDF:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to generate PDF" });
    }
  }
};
