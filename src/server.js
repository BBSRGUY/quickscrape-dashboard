/**
 * server.js
 * -------------------------------------
 * Main Express server entry.
 */

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const scrapeRoute = require('./routes/scrapeRoute');
const discoverRoute = require('./routes/discoverRoute');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, '..', 'public')));

// Routes
app.use('/api', scrapeRoute);
app.use('/api/discover', discoverRoute);

// Root route - serve the frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`QuickScrape Dashboard listening on port ${PORT}`);
});