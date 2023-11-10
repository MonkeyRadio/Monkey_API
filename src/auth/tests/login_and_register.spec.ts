import { fa, faker } from "@faker-js/faker";
import { Test, TestingModule } from "@nestjs/testing";
import { Connection, connect, Model } from "mongoose";
import { RedisMemoryServer } from "redis-memory-server";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MongooseModule, getConnectionToken } from "@nestjs/mongoose";
import { RedisModule } from "@songkeys/nestjs-redis";
import { AuthModule } from "@/src/auth/auth.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import * as supertest from "supertest";
import { ValidationPipe } from "@nestjs/common";

describe("AuthController - login_and_register", () => {
  let redisd: RedisMemoryServer;
  let mongod: MongoMemoryServer;
  let module: TestingModule;
  let app: NestExpressApplication;

  const apiClient = () => {
    return supertest(app.getHttpServer());
  };

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const mogiuri = mongod.getUri();
    redisd = await RedisMemoryServer.create();
    const redisHost = await redisd.getHost();
    const redisPort = await redisd.getPort();
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(mogiuri),
        RedisModule.forRoot({
          closeClient: true,
          config: {
            host: redisHost,
            port: redisPort,
          },
        }),
        AuthModule,
      ],
    }).compile();

    app = module.createNestApplication<NestExpressApplication>();
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await (app.get(getConnectionToken()) as Connection).db.dropDatabase();
    await app.close();
    await mongod.stop();
    await redisd.stop();
  });

  afterEach(async () => {
    const collections = await (
      app.get(getConnectionToken()) as Connection
    ).db.collections();
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  // Your Tests HERE

  it("should register a user", async () => {
    const { body: user } = await apiClient()
      .post("/auth/register")
      .send({
        nickname: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      })
      .expect(201);
    expect(user).toHaveProperty("email");
    expect(user).toHaveProperty("nickname");
    expect(user).toHaveProperty("token");
  });

  it("should login a user", async () => {
    const password = faker.internet.password();
    const { body: user } = await apiClient()
      .post("/auth/register")
      .send({
        nickname: faker.person.firstName(),
        email: faker.internet.email(),
        password: password,
      })
      .expect(201);
    const { body: token } = await apiClient()
      .post("/auth/login")
      .send({
        nickname: user.nickname,
        password: password,
      })
      .expect(200);
    expect(token).toHaveProperty("token");
  });

  it("should not login a user with wrong password", async () => {
    const { body: user } = await apiClient()
      .post("/auth/register")
      .send({
        nickname: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      })
      .expect(201);
    await apiClient()
      .post("/auth/login")
      .send({
        nickname: user.nickname,
        password: "wrongpassword",
      })
      .expect(401);
  });

  it("should not register a user with same email", async () => {
    const [nickname, email] = [
      faker.person.firstName(),
      faker.internet.email(),
    ];
    await apiClient()
      .post("/auth/register")
      .send({
        nickname,
        email: faker.internet.email(),
        password: faker.internet.password(),
      })
      .expect(201);
    await apiClient()
      .post("/auth/register")
      .send({
        nickname: faker.person.firstName(),
        email,
        password: faker.internet.password(),
      })
      .expect(201);
    await apiClient()
      .post("/auth/register")
      .send({
        nickname,
        email: faker.internet.email(),
        password: faker.internet.password(),
      })
      .expect(409);
    await apiClient()
      .post("/auth/register")
      .send({
        nickname: faker.person.firstName(),
        email,
        password: faker.internet.password(),
      })
      .expect(409);
  });

  it("should not register a user with bad email", async () => {
    await apiClient()
      .post("/auth/register")
      .send({
        nickname: faker.person.firstName(),
        email: "bademail",
        password: faker.internet.password(),
      })
      .expect(400);
  });
});
