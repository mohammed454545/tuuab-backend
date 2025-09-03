import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
const port = parseInt(process.env.PORT ?? '5000', 10);
  // ✅ تفعيل CORS والسماح للواجهة بالاتصال
  app.enableCors({
    origin: 'http://localhost:3000', // أو ['http://localhost:3000'] إذا كان أكثر من واحد
    credentials: true,
  });

  await app.listen(port, '0.0.0.0');
}
bootstrap();
