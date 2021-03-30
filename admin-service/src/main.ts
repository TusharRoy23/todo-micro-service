import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import bodyParser from 'body-parser';
import { AppModule } from './app.module';

const microserviceOptions: MicroserviceOptions = { // Redis communication
  transport: Transport.REDIS,
  options: {
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
  }
};

async function bootstrap() {
  const port = +process.env.APP_PORT || 4000;
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.connectMicroservice(microserviceOptions);
  await app.startAllMicroservicesAsync();

  app.setGlobalPrefix('api');
  console.log('admin service running on: ', port);
  app.enableCors();
  // app.use(bodyParser.json({limit: '1mb'}))
  // app.use(bodyParser.urlencoded({ limit:'1mb', extended: true }))
  // app.use(bodyParser.text({type: 'text/html'}))

  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Todo APP')
    .setDescription('Todo-Admin API documentation')
    .setVersion('1.0')
    .addTag('Todo-Admin')
    .build();
    
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(port);

  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, microserviceOptions); // <MicroserviceOptions>
  // app.listen(() => {
  //   console.log('admin micro service is listening');
  // });
}
bootstrap();
