const express = require('express');
const router = express.Router();

// Sample API endpoint
router.get('/hello', (req, res) => {
    res.json({ message: 'Hello from the API!' });
});

router.post('/data', (req, res) => {
    const { name, age } = req.body;
    res.json({ message: `Hello ${name}, age ${age}` });
});

module.exports = router;
