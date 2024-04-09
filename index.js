const puppeteer = require('puppeteer');

async function scrapeData() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://pt.wikipedia.org/wiki/Lista_de_municípios_do_Brasil_por_população_(2022)');

  const cities = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('table.wikitable tbody tr'));
    return rows.map(row => {
      const columns = row.querySelectorAll('td');
      if (columns.length > 3){
        return { 
            name: columns[2].innerText.trim(),
            UF: columns[3].innerText.trim(),
            population: columns[4].innerText.trim()
        }
      }
    }).filter(Boolean);
  });

  console.log(cities);

  await browser.close();

  return cities;
}

scrapeData().then(cities => {
  console.log("Dados extraídos com sucesso:", cities);
}).catch(console.error);
