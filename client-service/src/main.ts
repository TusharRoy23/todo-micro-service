import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser'
import { NestExpressApplication } from '@nestjs/platform-express';
import { ClientProxyFactory, MicroserviceOptions, Transport } from '@nestjs/microservices';

const microserviceOptions: MicroserviceOptions = { // Redis communication
  transport: Transport.REDIS,
  options: {
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
  }
};

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.connectMicroservice(microserviceOptions);
  await app.startAllMicroservicesAsync();

  const port = +process.env.APP_PORT || 3000;
  app.setGlobalPrefix('api');
  console.log('client service running on: ', port);

  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Todo APP')
    .setDescription('Todo API documentation')
    .setVersion('1.0')
    .addTag('Todo')
    .build()
    
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api', app, document)

  app.enableCors()

  app.use(bodyParser.json({limit: '1mb'}))
  app.use(bodyParser.urlencoded({ limit:'1mb', extended: true }))
  app.use(bodyParser.text({type: 'text/html'}))

      // const client = ClientProxyFactory.create({
      //       transport: Transport.REDIS,
      //       options: {
      //           url: 'redis://redis-server:637'
      //       }
      //   });

      //   console.log('this.client: ', client);
      //   client.send<boolean>({ cmd: 'createuserlog' }, {useEmail: 'tushar@gm.com'});

  await app.listen(port);
}
bootstrap();
