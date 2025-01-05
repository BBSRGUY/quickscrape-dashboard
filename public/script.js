document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('scrape-form');
    const rawDataList = document.getElementById('raw-data');
    const resultSection = document.getElementById('result-section');
    let scrapeChart;
  
    // NEW: discover selectors
    const discoverBtn = document.getElementById('discover-btn');
    const discoveredSection = document.getElementById('discovered-section');
    const discoveredDropdown = document.getElementById('discovered-selectors-dropdown');
  
    // On discover button click, call the new route
    discoverBtn.addEventListener('click', async () => {
      const url = document.getElementById('url').value.trim();
      if (!url) {
        alert('Please enter a valid URL first.');
        return;
      }
  
      try {
        // Clear old results
        discoveredDropdown.innerHTML = '<option value="">-- Choose a selector --</option>';
  
        // Fetch selectors from server
        const resp = await fetch(`/api/discover?url=${encodeURIComponent(url)}`);
        const data = await resp.json();
        if (data.success) {
          discoveredSection.style.display = 'block';
          data.selectors.forEach((sel) => {
            const option = document.createElement('option');
            option.value = sel;
            option.textContent = sel;
            discoveredDropdown.appendChild(option);
          });
        } else {
          alert('Failed to discover selectors: ' + data.message);
        }
      } catch (err) {
        console.error('Discover error:', err);
        alert('Error discovering selectors. Check console.');
      }
    });
  
    // When user picks a discovered selector, set #selector input
    discoveredDropdown.addEventListener('change', () => {
      const chosen = discoveredDropdown.value;
      if (chosen) {
        document.getElementById('selector').value = chosen;
      }
    });
  
    // The rest is your existing scrape logic
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const url = document.getElementById('url').value.trim();
      const selector = document.getElementById('selector').value.trim();
  
      if (!url || !selector) return;
  
      try {
        const response = await fetch('/api/scrape', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url, selector }),
        });
  
        const data = await response.json();
        if (data.success) {
          // Display raw data
          rawDataList.innerHTML = '';
          data.data.forEach((item) => {
            const li = document.createElement('li');
            li.textContent = item;
            rawDataList.appendChild(li);
          });
  
          // Show the result section
          resultSection.style.display = 'block';
  
          // Build or update chart
          buildChart(data.data);
        } else {
          alert('Scraping failed: ' + data.message);
        }
      } catch (err) {
        console.error('Front-end error:', err);
        alert('Scraping error occurred. Check console for details.');
      }
    });
  
    function buildChart(scrapedArray) {
      // same chart logic as before
      if (scrapeChart) scrapeChart.destroy();
      const lengths = scrapedArray.map((el) => el.length);
      const ctx = document.getElementById('scrapeChart').getContext('2d');
      scrapeChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: scrapedArray.map((_, i) => `Item ${i + 1}`),
          datasets: [
            {
              label: 'String Length',
              data: lengths,
              backgroundColor: '#00ffff88',
              borderColor: '#00ffff',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: { beginAtZero: true, title: { display: true, text: 'Length' } },
            x: { title: { display: true, text: 'Scraped Elements' } },
          },
        },
      });
    }
  });
  