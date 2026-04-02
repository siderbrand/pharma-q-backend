import { INestApplication } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';

const parseCorsOrigins = (origins: string): string[] => {
  return origins
    .split(',')
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
};

export const applySecurity = (app: INestApplication): void => {
  const expressApp = app.getHttpAdapter().getInstance();

  expressApp.disable('x-powered-by');

  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'same-site' },
      referrerPolicy: { policy: 'no-referrer' },
    }),
  );

  app.use(hpp());
  app.use((req: Request, _res: Response, next: NextFunction) => {
    if (req.body && typeof req.body === 'object') {
      mongoSanitize.sanitize(req.body, { replaceWith: '_' });
    }

    if (req.params && typeof req.params === 'object') {
      mongoSanitize.sanitize(req.params, { replaceWith: '_' });
    }

    next();
  });

  const corsOrigin = process.env.CORS_ORIGIN;

  if (!corsOrigin) {
    app.enableCors({
      origin: false,
    });
    return;
  }

  const allowedOrigins = parseCorsOrigins(corsOrigin);

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
};
