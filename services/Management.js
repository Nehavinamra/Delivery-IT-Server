const cors = require('cors');
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Array to store services. In a real application, you'd likely use a database.
let services = ["FedEx", "UPS", "DHL"];

app.get('/services/', (req, res) => {
    res.json(services); // Ensure this is returning JSON
});

app.post('/services/add', (req, res) => {
    const newService = req.body.service;
    services.push(newService);
    res.json({ message: 'Service added successfully', service: newService });
});

app.delete('/services/delete/:service', (req, res) => {
    const serviceToDelete = req.params.service;
    services = services.filter(service => service !== serviceToDelete);
    res.json({ message: 'Service deleted successfully', service: serviceToDelete });
});

const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

// Existing routes for services...

// Route to assign a driver to an order
app.post('/orders/assign', (req, res) => {
 const { trackingNumber, employee } = req.body;

 // Validate the tracking number and employee ID
 if (!trackingNumber || !employee || !employees.includes(employee)) {
    return res.status(400).json({ message: 'Invalid tracking number or employee ID' });
 }

 // Find the order by tracking number
 const order = orders.find(order => order.trackingNumber === trackingNumber);

 if (!order) {
    return res.status(404).json({ message: 'Order not found' });
 }

 // Update the order with the new employee assignment
 order.employee = employee;

 // Respond with the updated order
 res.json(order);
});