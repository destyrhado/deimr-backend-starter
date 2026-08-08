import type { NextFunction, Request, Response } from 'express';

type StatusClass = '2xx' | '3xx' | '4xx' | '5xx';

const statusBuckets: Record<StatusClass, number> = {
  '2xx': 0,
  '3xx': 0,
  '4xx': 0,
  '5xx': 0,
};

let httpRequestsTotal = 0;
let httpRequestDurationMsTotal = 0;

const statusClassFor = (statusCode: number): StatusClass => {
  if (statusCode >= 500) {
    return '5xx';
  }
  if (statusCode >= 400) {
    return '4xx';
  }
  if (statusCode >= 300) {
    return '3xx';
  }

  return '2xx';
};

export const metricsMiddleware = (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  const startedAt = process.hrtime.bigint();

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;

    httpRequestsTotal += 1;
    httpRequestDurationMsTotal += durationMs;
    statusBuckets[statusClassFor(res.statusCode)] += 1;
  });

  next();
};

export const metricsHandler = (_req: Request, res: Response) => {
  const lines = [
    '# HELP deimr_http_requests_total Total HTTP responses served by this process.',
    '# TYPE deimr_http_requests_total counter',
    `deimr_http_requests_total ${httpRequestsTotal}`,
    '# HELP deimr_http_request_duration_ms_total Total HTTP response duration in milliseconds.',
    '# TYPE deimr_http_request_duration_ms_total counter',
    `deimr_http_request_duration_ms_total ${httpRequestDurationMsTotal.toFixed(3)}`,
    '# HELP deimr_http_responses_total HTTP responses grouped by status class.',
    '# TYPE deimr_http_responses_total counter',
    ...Object.entries(statusBuckets).map(
      ([statusClass, count]) =>
        `deimr_http_responses_total{status_class="${statusClass}"} ${count}`,
    ),
  ];

  res.type('text/plain').send(`${lines.join('\n')}\n`);
};
