/**
 * scrapeRoute.js
 * -------------------------------------
 * Route definition to handle /api/scrape requests.
 */

const express = require('express');
const { scrapeData } = require('../scraper');
const router = express.Router();

router.post('/scrape', async (req, res) => {
  try {
    const { url, selector } = req.body;
    if (!url || !selector) {
      return res.status(400).json({
        success: false,
        message: 'URL and selector are required.'
      });
    }

    const result = await scrapeData(url, selector);
    if (result.success) {
      // Return the extracted data as JSON
      return res.json({
        success: true,
        data: result.data
      });
    } else {
      return res.status(500).json({
        success: false,
        message: result.message || 'Scraping failed.'
      });
    }
  } catch (err) {
    console.error('Scrape route error:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error occurred while scraping.'
    });
  }
});

module.exports = router;
