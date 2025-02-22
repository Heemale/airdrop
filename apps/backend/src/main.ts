import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GLOBAL_PREFIX, NODE_ENV, PORT } from '@/config/base';
import { setupSwagger } from '@/swagger';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 设置前缀、Pipe、异常过滤、数据转化
  app.setGlobalPrefix(GLOBAL_PREFIX);
  // app.useGlobalPipes(new ValidationPipe({forbidUnknownValues: false}));
  // app.useGlobalFilters(new HttpExceptionFilter());
  // app.useGlobalInterceptors(new TransformInterceptor());

  // 生产环境禁用swagger
  if (NODE_ENV !== 'production') {
    setupSwagger(app);
  }

  // 设置跨域
  app.enableCors({
    origin: '*', // 指定允许跨域的域名
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // 指定允许的 HTTP 方法
    credentials: true, // 允许携带身份凭证，如 cookies
    allowedHeaders: 'Content-Type,Authorization', // 允许的请求头
  });

  // 静态资源目录
  app.use(express.static(path.join(__dirname, 'dist', '../../public')));

  await app.listen(PORT);
}

bootstrap().catch(({ message }) => {
  console.log('[Nest] stopped. Reason: ' + message);
});
