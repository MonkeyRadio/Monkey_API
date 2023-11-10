import { faker } from "@faker-js/faker";
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

describe("AuthController - familized_auth", () => {
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

  it("should get /me with token", async () => {
    const { body: user } = await apiClient()
      .post("/auth/register")
      .send({
        nickname: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      })
      .expect(201);
    const response = await apiClient()
      .get("/auth/me")
      .set("Authorization", `Bearer ${user.token}`)
      .expect(200);
    const { body } = response;
    expect(body).toBeDefined();
    expect(body.nickname).toBe(user.nickname);
    expect(body.email).toBe(user.email);
  }, 30000);

  it("should not get /me without token", async () => {
    await apiClient().get("/auth/me").expect(401);
  });

  it("should not get /me with invalid token", async () => {
    await apiClient()
      .get("/auth/me")
      .set("Authorization", `Bearer ${faker.string.alphanumeric(25)}`)
      .expect(401);
  });

  it("should invalidate token after logout", async () => {
    const { body: user } = await apiClient()
      .post("/auth/register")
      .send({
        nickname: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      })
      .expect(201);
    await apiClient()
      .post("/auth/logout")
      .set("Authorization", `Bearer ${user.token}`)
      .expect(200);
    await apiClient()
      .get("/auth/me")
      .set("Authorization", `Bearer ${user.token}`)
      .expect(401);
  });

  it("should renew token", async () => {
    const { body: user } = await apiClient()
      .post("/auth/register")
      .send({
        nickname: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      })
      .expect(201);
    const { body: renew } = await apiClient()
      .post("/auth/renewToken")
      .set("Authorization", `Bearer ${user.token}`)
      .expect(200);
    expect(renew).toBeDefined();
    expect(renew.token).toBeDefined();
    const { body: me } = await apiClient()
      .get("/auth/me")
      .set("Authorization", `Bearer ${renew.token}`)
      .expect(200);
    expect(me).toBeDefined();
  });

  it("should invalidate token after renew", async () => {
    const { body: user } = await apiClient()
      .post("/auth/register")
      .send({
        nickname: faker.person.firstName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      })
      .expect(201);
    const { body: renew } = await apiClient()
      .post("/auth/renewToken")
      .set("Authorization", `Bearer ${user.token}`)
      .expect(200);
    expect(renew).toBeDefined();
    expect(renew.token).toBeDefined();
    await apiClient()
      .get("/auth/me")
      .set("Authorization", `Bearer ${user.token}`)
      .expect(401);
    await apiClient()
      .get("/auth/me")
      .set("Authorization", `Bearer ${renew.token}`)
      .expect(401);
  });
});
