import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  // 文档
  const config = new DocumentBuilder();
  config
    .setTitle('chat api')
    .setDescription('chat api')
    .setVersion('1.0')
    .addTag('chat');
  const doc = SwaggerModule.createDocument(app, config.build());
  SwaggerModule.setup('doc', app, doc);

  app.useLogger(app.get(Logger));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
