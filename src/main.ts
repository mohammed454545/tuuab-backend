import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ تفعيل CORS والسماح للواجهة بالاتصال
  app.enableCors({
    origin: 'http://localhost:3000', // أو ['http://localhost:3000'] إذا كان أكثر من واحد
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
