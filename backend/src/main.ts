import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseSuccessInterceptor } from './interceptor/response.success.interceptor';
import { HttpExceptionFilter } from './filter/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    cors: true,
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
  app.useGlobalInterceptors(new ResponseSuccessInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
