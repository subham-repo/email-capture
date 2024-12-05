const express = require('express');
const router = express.Router();
const db = require('../dbconnection'); // Import the database connection

// GET route to fetch templates
router.get('/', (req, res) => {
    // SQL query to retrieve all templates
    const sql = 'SELECT DISTINCT `brand_name` FROM `saved-templates`';

    // Execute the query
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching brands:', err);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch brands',
                error: err.message,
            });
        }

        // Success response
        res.status(200).json({
            success: true,
            message: 'Brands fetched successfully',
            data: results,
        });
    });
});

// GET route to fetch templates
router.get('/:brand_name', (req, res) => {
    const { brand_name } = req.params;
    // SQL query to retrieve all templates
    const sql = 'SELECT * FROM `saved-templates` WHERE `brand_name` = ?';

    // Execute the query
    db.query(sql, [brand_name], (err, results) => {
        if (err) {
            console.error('Error fetching brand templates:', err);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch brand templates',
                error: err.message,
            });
        }

        // Success response
        res.status(200).json({
            success: true,
            message: 'Brand templates fetched successfully',
            data: results,
        });
    });
});

module.exports = router;