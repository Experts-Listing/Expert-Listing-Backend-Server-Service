import express from 'express';
import { pinoHttp } from 'pino-http';
import { experts } from './data/experts.js';

export function createApp({ logger = true } = {}) {
  const app = express();
  app.disable('x-powered-by');

  if (logger) {
    app.use(pinoHttp({ level: process.env.LOG_LEVEL || 'info', autoLogging: { ignore: (req) => req.url.startsWith('/healthz') || req.url.startsWith('/readyz') } }));
  }

  app.get('/healthz', (req, res) => res.json({ status: 'ok' }));
  app.get('/readyz', (req, res) => res.json({ status: 'ready' }));

  app.get('/api/experts', (req, res) => {
    const { specialty } = req.query;
    const result = specialty
      ? experts.filter((e) => e.specialty === String(specialty).toLowerCase())
      : experts;
    res.json({ count: result.length, data: result });
  });

  app.get('/api/experts/:id', (req, res) => {
    const expert = experts.find((e) => e.id === Number(req.params.id));
    if (!expert) return res.status(404).json({ error: 'Expert not found' });
    res.json(expert);
  });

  app.use((req, res) => res.status(404).json({ error: 'Not found' }));

  return app;
}
