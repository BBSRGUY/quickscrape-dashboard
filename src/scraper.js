/**
 * scraper.js
 * -------------------------------------
 * Contains the Puppeteer-based scraping logic.
 */

const puppeteer = require('puppeteer');

async function scrapeData(url, selector) {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true, // set false if you want to see the browser
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    const page = await browser.newPage();

    // Navigate to the target page
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    
    // Wait for the selector to load (if it fails, an error will be thrown)
    await page.waitForSelector(selector, { timeout: 5000 });

    // Extract data from the specified selector
    const extractedData = await page.$$eval(selector, (elements) =>
      elements.map((el) => el.innerText.trim())
    );

    return { success: true, data: extractedData };
  } catch (error) {
    console.error('Error in scrapeData:', error);
    return { success: false, message: error.message };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = {
  scrapeData,
};
