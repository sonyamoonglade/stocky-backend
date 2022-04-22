import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
require('dotenv').config()
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const APP_PORT = process.env.APP_PORT
  await app.listen(APP_PORT, () => {
    console.log(`app started and running on port - ${APP_PORT}`);
  });

}
bootstrap();
