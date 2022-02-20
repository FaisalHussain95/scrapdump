const express = require('express');
const apicache = require('apicache');
const Cotizup = require('./plugins/cotizup');

const debug = process.env.NODE_ENV !== 'production';

if (debug) {
  require('dotenv').config();
}

const cache = apicache.options({
  debug,
  defaultDuration: '30 minutes',
  trackPerformance: debug,
  // redisClient: redis.createClient()
}).middleware;

const app = express();
const port = process.env.PORT || 3000;

const logger = (req, res, next) => {
  console.log((new Date()).toLocaleString(), req.method, req.path);
  next();
};

/**
 * Middlewares
 */
app.use(logger);

/**
 * Routes
 */
app.get('/cotizup/:id', cache(), async (req, res) => {
  const data = await Cotizup.output(req.params);
  res.json(data);
});

/**
 * Debug apichache
 */
if (debug) {
  // add route to display cache performance (courtesy of @killdash9)
  app.get('/api/cache/performance', (req, res) => {
    res.json(apicache.getPerformance());
  });

  // add route to display cache index
  app.get('/api/cache/index', (req, res) => {
    res.json(apicache.getIndex());
  });
}

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
