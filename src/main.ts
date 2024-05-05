import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from "@nestjs/swagger";
import { SwaggerCustomCss } from "@/utils/SwaggerCustomCss";
import * as compression from "compression";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      /localhost(:\d*)?$/,
      /.monkeyradio.fr$/,
      /.monkeyradio.netlify.app$/,
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    exposedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
    preflightContinue: false,
  });

  app.use(compression());

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "4",
  });

  app.getHttpAdapter().getInstance().disable("x-powered-by");
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle("MonkeyRadio API")
    .setDescription("Where all the MonkeyRadio data passes")
    .setVersion("4.0")
    .addBearerAuth()
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup("api-doc", app, document, {
    customCss: SwaggerCustomCss,
    customfavIcon:
      "https://avatars.githubusercontent.com/u/120142506?s=200&v=4",
    customSiteTitle: "MonkeyRadio API",
  });

  await app.listen(3000);
}

bootstrap();
