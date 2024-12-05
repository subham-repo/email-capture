const express = require('express');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(morgan('dev')); // Log requests
app.use(cors()); // Enable CORS

// Increase the payload size limit
app.use(bodyParser.json({ limit: '100mb' })); // Increase JSON payload limit
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true })); // Increase URL-encoded payload limit

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const apiRoutes = require('./routes/api');
const snippetRoutes = require('./routes/snippets');
const saveTemplateRoute = require('./routes/templates'); // Adjust the path as needed
const allBrands = require('./routes/brands');

app.use('/api', apiRoutes); // API routes
app.use('/snippets', snippetRoutes); // Snippet routes
app.use('/api/templates', saveTemplateRoute); // Mount the save-template route
app.use('/api/brands', allBrands);

// Home route - serve HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
