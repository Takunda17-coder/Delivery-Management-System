const bcrypt = require("bcrypt");
const { Users, Customer, Orders, Invoice, sequelize } = require("../models");

// ---------------------------- CREATE CUSTOMER ----------------------------
exports.createCustomer = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const {
      first_name,
      last_name,
      email,
      sex,
      address,
      age,
      phone_number,
      password,
    } = req.body;

    // Only enforce truly required fields
    if (!first_name || !last_name || !email) {
      return res
        .status(400)
        .json({ message: "First name, last name, and email are required" });
    }

    // Check if email already exists in Users
    const existingUser = await Users.findOne({
      where: { email },
      transaction: t,
    });
    if (existingUser) {
      await t.rollback();
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password or generate random
    const rawPassword = password || Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // Create a new user with role 'customer'
    const newUser = await Users.create(
      {
        name: `${first_name} ${last_name}`,
        email,
        password: hashedPassword,
        role: "customer",
        status: "active",
      },
      { transaction: t }
    );

    // Create customer row and link with newly created user
    const newCustomer = await Customer.create(
      {
        user_id: newUser.user_id, // auto-assigned from Users
        first_name,
        last_name,
        email,
        sex: sex || null,
        address: address || null,
        age: age || null,
        phone_number: phone_number || null,
      },
      { transaction: t }
    );

    await t.commit();

    res.status(201).json({
      message: "Customer created successfully",
      customer: newCustomer,
      generatedPassword: password ? undefined : rawPassword, // send password if auto-generated
    });
  } catch (error) {
    await t.rollback();
    console.error("Error creating customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------------------------- GET ALL CUSTOMERS ----------------------------
exports.getAllCustomers = async (_req, res) => {
  try {
    const customers = await Customer.findAll({
      include: [
        {
          model: Users,
          as: "user",
          attributes: ["user_id", "name", "email", "role", "status"],
        },
        {
          model: Orders,
          as: "orders",
          include: [{ model: Invoice, as: "invoice" }], // ✅ match alias here
        },
      ],
    });

    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------------- GET CUSTOMER BY ID ----------------------------
exports.getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findByPk(id, {
      include: [
        {
          model: Users,
          as: "user",
          attributes: ["user_id", "name", "email", "role", "status"],
        },
        {
          model: Orders,
          as: "orders",
          include: [{ model: Invoice, as: "invoice" }], // ✅ match alias
        },
      ],
    });

    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    res.status(200).json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCustomerByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const customer = await Customer.findOne({
      where: { user_id: userId },
      include: [
        {
          model: Users,
          as: "user",
          attributes: ["user_id", "name", "email", "role", "status"],
        },
      ],
    });

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer);
  } catch (err) {
    console.error("Error fetching customer by user ID:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------------- UPDATE CUSTOMER ----------------------------
exports.updateCustomer = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      email,
      sex,
      address,
      age,
      phone_number,
      password,
    } = req.body;

    const customer = await Customer.findByPk(id, { transaction: t });
    if (!customer) {
      await t.rollback();
      return res.status(404).json({ message: "Customer not found" });
    }

    const user = await Users.findByPk(customer.user_id, { transaction: t });
    if (!user) {
      await t.rollback();
      return res.status(404).json({ message: "Linked user not found" });
    }

    // Update email if changed
    if (email && email !== user.email) {
      const emailExists = await Users.findOne({
        where: { email },
        transaction: t,
      });
      if (emailExists) {
        await t.rollback();
        return res.status(400).json({ message: "Email already in use" });
      }
      user.email = email;
      customer.email = email;
    }

    // Update password if provided
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save({ transaction: t });

    // Update customer fields
    customer.first_name = first_name || customer.first_name;
    customer.last_name = last_name || customer.last_name;
    customer.age = age || customer.age;
    customer.sex = sex || customer.sex;
    customer.phone_number = phone_number || customer.phone_number;
    customer.address = address || customer.address;

    await customer.save({ transaction: t });
    await t.commit();

    res
      .status(200)
      .json({ message: "Customer updated successfully", customer });
  } catch (error) {
    await t.rollback();
    console.error("Error updating customer:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------------- DELETE CUSTOMER ----------------------------
exports.deleteCustomer = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    const customer = await Customer.findByPk(id, { transaction: t });
    if (!customer) {
      await t.rollback();
      return res.status(404).json({ message: "Customer not found" });
    }

    const user = await Users.findByPk(customer.user_id, { transaction: t });
    if (user) await user.destroy({ transaction: t });

    await customer.destroy({ transaction: t });
    await t.commit();

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    await t.rollback();
    console.error("Error deleting customer:", error);
    res.status(500).json({ message: "Server error" });
  }
};
