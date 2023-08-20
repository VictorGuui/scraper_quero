const puppeteer = require('puppeteer');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const scrap = (async () => {
  const browser = await puppeteer.launch({ headless: "new" });

  const page = await browser.newPage();

  await page.goto('https://querobolsa.com.br/cursos-e-faculdades/administracao');
  await page.waitForSelector('.offer-recommendation-carousel-card__card');

  const data = await page.evaluate(() => {
    const results = [];
    const elements = document.querySelectorAll('.offer-recommendation-carousel-card__card');

    elements.forEach(element => {
      const universityName = element.querySelector('.offer-recommendation-carousel-card__university-name').textContent.trim();
      const courseName = element.querySelector('.offer-recommendation-carousel-card__course-name').textContent.trim();
      const courseInfo = element.querySelector('.offer-recommendation-carousel-card__course-info').textContent.trim();
      const fullPrice = element.querySelector('.offer-recommendation-carousel-card__course-full-price').textContent.trim();
      const discountedPrice = element.querySelector('.offer-recommendation-carousel-card__course-price .z-text--size-medium').textContent.trim();

      results.push({
        universityName,
        courseName,
        courseInfo,
        fullPrice,
        discountedPrice
      });
    });

    return results;
  });

  // Defina o nome do arquivo CSV e os cabeçalhos das colunas
  const csvWriter = createCsvWriter({
    path: 'dados.csv',
    header: [
      { id: 'universityName', title: 'Universidade' },
      { id: 'courseName', title: 'Curso' },
      { id: 'courseInfo', title: 'Informações do Curso' },
      { id: 'fullPrice', title: 'Preço Cheio' },
      { id: 'discountedPrice', title: 'Preço com Desconto' }    
    ],
  });

  // Escreva os dados no arquivo CSV
  csvWriter.writeRecords(data)
    .then(() => console.log('Dados exportados para dados.csv', data))
    .catch(error => console.error('Erro ao exportar dados:', error));

  await browser.close();
})();
module.exports = {scrap}