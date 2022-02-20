const cheerio = require('cheerio');
const { http, output } = require('./base');

const type = 'cotizup';

exports.output = async (params) => {
  const res = {
    ...output(type),
    error: false,
  };

  try {
    const pageResponse = await http.get(`https://cotizup.com/${params.id}`);

    if (pageResponse && pageResponse.data) {
      const $ = cheerio.load(pageResponse.data);

      /**
     * Title
     */
      const title = $('.campaign-title h2');
      if (title && title.length) {
        res.title = {
          raw: title.first().html(),
          text: title.first().text(),
        };
      }

      /**
     * Description
     */
      const desc = $('.campaign-description');
      if (desc && desc.length) {
        res.desc = {
          raw: desc.first().html(),
          text: desc.first().text(),
        };
      }

      /**
     * Prices
     */
      const prices = $('.price-total');
      if (prices && prices.length) {
        const price = prices.first();
        const total = price.find('span:not(.count-donors)');
        let goal = null;

        if (total && total.length) {
          const totalText = total.first().text();

          if (totalText.match(/[€$£]/)) {
            goal = parseInt(total.first().text()
              .replace(/[€$£]/, '')
              .replace(' ', '')
              .trim(), 10);
          }
        }

        res.raised = {
          raw: price.parent().html(),
          goal,
          collected: parseInt(price.attr('data-collected'), 10),
        };
      }
    }
  } catch (error) {
    res.error = true;
    res.message = error.message;
  }

  return res;
};
