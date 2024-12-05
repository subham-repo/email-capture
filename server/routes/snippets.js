const express = require('express');
const router = express.Router();

// Snippets data
const snippets = [
    { id: 1, title: 'Snippet 1', description: 'This is the first snippet.' },
    { id: 2, title: 'Snippet 2', description: 'This is the second snippet.' },
];

// Route to fetch all snippets
router.get('/', (req, res) => {
    res.json(snippets);
});

// Route to fetch a specific snippet by ID
router.get('/:id', (req, res) => {
    const snippetId = parseInt(req.params.id, 10);
    const snippet = snippets.find(s => s.id === snippetId);

    if (snippet) {
        res.json(snippet);
    } else {
        res.status(404).json({ message: 'Snippet not found' });
    }
});

module.exports = router;
