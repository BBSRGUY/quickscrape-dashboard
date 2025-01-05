/**
 * discoverRoute.js
 * -------------------------------------
 * Route definition to handle /api/discover requests
 * for discovering potential CSS selectors on a page.
 */

const express = require('express');
const puppeteer = require('puppeteer');

const router = express.Router();

// GET /api/discover?url=...
router.get('/', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ success: false, message: 'URL is required.' });
  }

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

    // Grab all elements, build "tag#id.class1.class2..."
    const elements = await page.$$eval('*', (els) => {
      const setOfSelectors = new Set();

      els.forEach((el) => {
        const tagName = el.tagName.toLowerCase();

        // 1) Filter out unwanted elements
        if (['script', 'style', 'meta', 'link'].includes(tagName)) {
          return; // skip
        }

        // 2) Retrieve ID
        const elId = el.getAttribute('id');
        const idPart = elId ? `#${elId}` : '';

        // 3) Retrieve classes safely, avoiding SVGAnimatedString
        const rawClassName = el.getAttribute('class') || '';
        const classList = rawClassName.split(/\s+/).filter(Boolean);
        let classesPart = '';
        if (classList.length > 0) {
          classesPart = '.' + classList.join('.');
        }

        // 4) Build a combined selector (tag#id.class1.class2...)
        const basicSelector = `${tagName}${idPart}${classesPart}`;

        // Add to the set
        setOfSelectors.add(basicSelector);

        // --------------------------------------------------------------------
        // Advanced “Selector” Generation (Optional Ideas)
        // - Full DOM path: e.g., "body > main > section:nth-child(2) > article#id.class"
        // - Shorter unique paths for minimal specificity
        // - Checking for additional attributes (like data-* attributes)
        // --------------------------------------------------------------------
      });

      // Convert set to array
      return [...setOfSelectors];
    });

    // Sort them for easier viewing
    elements.sort();

    // 5) Large sites: limit to top 200 to avoid massive lists
    const limitedElements = elements.slice(0, 200);

    res.json({
      success: true,
      selectors: limitedElements,
    });
  } catch (err) {
    console.error('Discover route error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Error discovering selectors.',
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

module.exports = router;
