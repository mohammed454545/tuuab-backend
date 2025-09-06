import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = Number(process.env.PORT || 5000);

  // ضِف دومين الفرونتند في متغير بيئة FRONTEND_URL
  const allowedOrigins = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    process.env.FRONTEND_URL, // مثال: https://tuuab-frontend-production.up.railway.app
  ].filter(Boolean);

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  await app.listen(port, '0.0.0.0');
  console.log('Listening on', port, 'CORS:', allowedOrigins);
}
bootstrap();
