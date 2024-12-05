const express = require('express');
const router = express.Router();
const db = require('../dbconnection'); // Import the database connection

// POST route to save a template
router.post('/', (req, res) => {
    // Extract data from the request body
    const {
        date,
        brand_name,
        brand_thumb,
        email_title,
        email_description,
        email_body,
    } = req.body;

    // Check if all required fields are provided
    if (!date || !brand_name || !brand_thumb || !email_title || !email_description || !email_body) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields',
        });
    }

    // SQL query to check for existing title and brand
    const checkSql = `
        SELECT * FROM \`saved-templates\`
        WHERE \`email_title\` COLLATE utf8mb4_general_ci = ? 
        AND \`brand_name\` COLLATE utf8mb4_general_ci = ?
    `;

    const emailTitle = email_title; // Normalize input
    const brandName = brand_name;  // Normalize input
    
    // Execute the query to check if the template already exists
    db.query(checkSql, [emailTitle, brandName], (checkErr, checkResult) => {
        if (checkErr) {
            if(String(checkErr.message).includes("ER_CANT_AGGREGATE_2COLLATIONS") ==  false){
                return res.status(500).json({
                    success: false,
                    message: 'Error checking for existing template',
                    error: checkErr.message,
                });
            }
        }

        // If a matching record exists, return a message
        // if(String(checkErr.message).includes("ER_CANT_AGGREGATE_2COLLATIONS") ==  false){
            
        // }
        if (checkResult.length > 0 ) {
            return res.status(409).json({
                success: false,
                message: 'Template with this title and brand already exists',
            });
        }

        // SQL query to insert data into the saved-templates table
        const insertSql = `
            INSERT INTO \`saved-templates\` (\`date\`, \`brand_name\`, \`brand_thumb\`, \`email_title\`, \`email_description\`, \`email_body\`)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        // Execute the query to insert the new template
        db.query(
            insertSql,
            [date, brand_name, brand_thumb, email_title, email_description, email_body],
            (insertErr, result) => {
                if (insertErr) {
                    console.error('Error inserting data:', insertErr);
                    return res.status(500).json({
                        success: false,
                        message: 'Failed to save template',
                        error: insertErr.message,
                    });
                }

                // Success response
                res.status(200).json({
                    success: true,
                    message: 'Template saved successfully',
                    data: {
                        id: result.insertId, // Return the ID of the newly inserted record
                        date,
                        brand_name,
                        brand_thumb,
                        email_title,
                        email_description,
                        email_body,
                    },
                });
            }
        );
    });
});


// GET route to fetch templates
router.get('/', (req, res) => {
    // SQL query to retrieve all templates
    const sql = 'SELECT * FROM `saved-templates`';

    // Execute the query
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch templates',
                error: err.message,
            });
        }

        // Success response
        res.status(200).json({
            success: true,
            message: 'Templates fetched successfully',
            data: results,
        });
    });
});

// GET route to fetch filtered templates
// Request: GET /api/templates?brand_name=BrandA&date=2024-11-20
router.get('/', (req, res) => {
    const { brand_name, date } = req.query; // Extract filters from query parameters

    // Base SQL query
    let sql = 'SELECT * FROM `saved-templates`';
    const params = [];

    // Add filters dynamically
    if (brand_name || email_title) {
        sql += ' WHERE';
        if (brand_name) {
            sql += ' `brand_name` = ?';
            params.push(brand_name);
        }
        if (brand_name && email_title) sql += ' AND';
        if (email_title) {
            sql += ' `email_title` = ?';
            params.push(email_title.replace(":", " - "));
        }
    }

    // Execute the query
    db.query(sql, params, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch templates',
                error: err.message,
            });
        }

        // Success response
        res.status(200).json({
            success: true,
            message: 'Templates fetched successfully',
            data: results,
        });
    });
});

// GET route to fetch a template by ID
router.get('/:id', (req, res) => {
    const { id } = req.params; // Extract ID from the request URL

    // SQL query to retrieve a template by ID
    const sql = 'SELECT * FROM `saved-templates` WHERE `id` = ?';

    // Execute the query
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error fetching data:', err);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch template',
                error: err.message,
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Template not found',
            });
        }

        // Success response
        res.status(200).json({
            success: true,
            message: 'Template fetched successfully',
            data: result[0], // Return the single template
        });
    });
});

module.exports = router;