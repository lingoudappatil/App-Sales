import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import connectDB from './config/db.js';
import User from './models/User.js';
import Lead from './models/Leads.js';
import Customer from './models/Customer.js';
import Quotation from './models/Quotation.js';
import Order from './models/Order.js';

// Initialize app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, address, state, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      address,
      state,
      password,
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Leads routes
app.post('/api/leads', async (req, res) => {
  try {
    console.log('Received lead data:', req.body);
    const newLead = new Lead(req.body);
    await newLead.save();
    res.status(201).json({ message: 'Lead added successfully!', lead: newLead });
  } catch (error) {
    console.error('Error saving lead:', error);
    res.status(500).json({
      error: 'Failed to add lead',
      details: error.message,
    });
  }
});

app.get('/api/leads', async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// Customers routes
app.post('/api/customers', async (req, res) => {
  try {
    const newCustomer = new Customer(req.body);
    await newCustomer.save();
    res.status(201).json({ message: 'Customer added successfully!', customer: newCustomer });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add customer' });
  }
});

app.get('/api/customers', async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Quotations routes
app.post('/api/quotations', async (req, res) => {
  try {
    const newQuotation = new Quotation(req.body);
    await newQuotation.save();
    res.status(201).json({ message: 'Quotation added successfully!', quotation: newQuotation });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add quotation' });
  }
});

app.get('/api/quotations', async (req, res) => {
  try {
    const quotations = await Quotation.find().sort({ createdAt: -1 });
    res.json(quotations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch quotations' });
  }
});

// Orders Route with customer existence check
app.post('/api/orders', async (req, res) => {
  try {
    const { email, phone } = req.body;
    console.log('Received order data:', req.body);

    // Check if customer exists
    const customer = await Customer.findOne({ $or: [{ email }, { phone }] });
    if (!customer) {
      return res.status(400).json({ error: 'Customer does not exist in the system' });
    }

    // If customer exists, create the order
    const newOrder = new Order({
      ...req.body,
      name: customer.name, // Use customer name from the database
      email: customer.email, // Use verified email from the database
      phone: customer.phone, // Use verified phone from the database
    });

    await newOrder.save();
    res.status(201).json({ message: 'Order added successfully!', order: newOrder });
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).json({
      error: 'Failed to add order',
      details: error.message,
    });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));