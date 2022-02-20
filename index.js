const express = require('express');
const Cotizup = require('./plugins/cotizup');

const app = express();
const port = 3000;

const logger = (req, res, next) => {
  console.log((new Date()).toLocaleString(), req.method, req.path);
  next();
};

app.use(logger);

app.get('/cotizup/:id', async (req, res) => {
  const data = await Cotizup.output(req.params);
  res.json(data);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
