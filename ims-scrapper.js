
import puppeteer from 'puppeteer';
import fs from 'fs';

export async function scrapeNotices() {
  const url = "https://www.imsnsit.org/imsnsit/notifications.php";
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle2' });

  // Scrape all <tr> elements inside the notifications table
  const notices = await page.evaluate(() => {
    const data = [];
    // Find the form containing the table
    const form = document.querySelector('form[method="post"]');
    if (!form) return data;
    const table = form.querySelector('table');
    if (!table) return data;
    const rows = table.querySelectorAll('tr');
    rows.forEach(row => {
      const cells = row.querySelectorAll('td');
      if (cells.length > 0) {
        // Collect all cell text in an array
        const cellData = Array.from(cells).map(cell => cell.innerText.trim());
        data.push(cellData);
      }
    });
    return data;
  });

  // Store the JSON data in a file
  fs.writeFileSync('notices.json', JSON.stringify(notices, null, 2), 'utf-8');
  console.log('Scraped data saved to notices.json');

  await browser.close();
  return notices;
}
