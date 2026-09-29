import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import type { Express } from 'express';
import type { INestApplication } from '@nestjs/common';

let cachedApp: INestApplication | null = null;
let cachedServer: Express | null = null;

async function getApp() {
  if (cachedApp) return { app: cachedApp, server: cachedServer! };

  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server), {
    logger: ['error', 'warn'],
  });

  app.enableCors({ origin: '*', methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'], allowedHeaders: ['Content-Type','Authorization'] });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.setGlobalPrefix('api');

  await app.init();
  cachedApp = app;
  cachedServer = server;
  return { app, server };
}

export default async function handler(req: any, res: any) {
  try {
    const { server } = await getApp();
    server(req, res);
  } catch (err) {
    console.error('Handler error:', err);
    res.status(500).json({ error: 'Internal server error', message: String(err) });
  }
}
