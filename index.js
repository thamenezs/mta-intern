const puppeteer = require('puppeteer');
const fs = require('fs');

(async() => {
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
    }).slice(1);
  });

  fs.writeFile('citiesList.json', JSON.stringify(cities, null, 2), err => {
      if(err) throw new Error('Ops, algo deu errado');
      console.log('Certinho!')
  })

  await browser.close();
})();

