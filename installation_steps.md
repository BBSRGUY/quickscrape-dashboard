# QuickScrape Dashboard

A production-level Node.js application to **scrape** a specified website using **Puppeteer** and present the extracted data on an **interactive Chart.js dashboard**.

## Features

1. **User-Friendly Form**: Input a target URL & CSS selector.  
2. **Robust Scraping**: Puppeteer-based headless browsing.  
3. **Data Visualization**: Results plotted on a dynamic Chart.js chart.  
4. **Modular Design**: Easy to extend or customize.

## Project Setup

```bash
# 1. Clone the repository
git clone https://github.com/BBSRGUY/quickscrape-dashboard.git
cd quickscrape-dashboard

# 2. Install dependencies
npm install

# 3. Start the server
npm start
```

# 4. Open http://localhost:3000 in your browser

## How It Works
Enter a website URL and a CSS selector on the homepage.
The server launches Puppeteer, navigates to the URL, and collects data based on the CSS selector.
The server returns the extracted results as JSON, which is rendered in a chart on the client side.

## Future Enhancements
Pagination or multi-page scraping.
Scheduler/CRON for periodic scraping.
Database integration to store historical data.
Various chart types (line, bar, pie, etc.).