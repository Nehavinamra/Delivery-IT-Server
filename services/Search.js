import express from 'express';
const router = express.Router();

// Sample data
const deliveryServices = [
    { name: "USPS", suitability: "small", cost: 5 },
    { name: "UPS", suitability: "large", cost: 10 },
    { name: "DHL", suitability: "delicate", cost: 15 }
];

const employees = [
    { id: "001", name: "John Doe", status: "active" },
    { id: "002", name: "Jane Doe", status: "inactive" }
];

// Route for searching delivery services
router.post("/searchDelivery", (req, res) => {
    const { criteria } = req.body;
    const results = deliveryServices.filter(service => service.suitability === criteria);
    res.json(results);
});

// Route for searching employees
router.post("/searchEmployees", (req, res) => {
    const { query } = req.body;
    const results = employees.filter(employee =>
        employee.name.toLowerCase().includes(query.toLowerCase()) || employee.status === query
    );
    res.json(results);
});

export default router;