import { faker } from "@faker-js/faker";
import { Test, TestingModule } from "@nestjs/testing";
import { Connection, connect, Mongoose, model } from "mongoose";
import { RedisMemoryServer } from "redis-memory-server";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MongooseModule, getConnectionToken } from "@nestjs/mongoose";
import { RedisModule } from "@songkeys/nestjs-redis";
import { AuthModule } from "@/src/auth/auth.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import * as supertest from "supertest";
import { ValidationPipe } from "@nestjs/common";
import { UserSchema } from "@/schemas/user.schema";
import { UserScope } from "@/enums/UserScope.enum";
import { Role } from "@/enums/Role.enum";

describe("AuthController - accreditation", () => {
  let redisd: RedisMemoryServer;
  let mongod: MongoMemoryServer;
  let module: TestingModule;
  let app: NestExpressApplication;
  let mongoConection: Mongoose;

  const apiClient = () => {
    return supertest(app.getHttpServer());
  };

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const mogiuri = mongod.getUri();
    mongoConection = await connect(mogiuri);
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
    await mongoConection.disconnect();
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

  it("should return 400 if malformed request", async () => {
    const UserModel = model("User", UserSchema);

    const user = {
      nickname: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      roles: [Role.Member],
      scopes: [UserScope.Default],
    };

    await UserModel.create(user);

    const login = await apiClient().post("/auth/login").send({
      nickname: user.nickname,
      password: user.password,
    });

    expect(login.status).toBe(200);

    const { body } = login;
    expect(body).toHaveProperty("token");

    const token = body.token;

    const response = await apiClient()
      .post("/auth/accreditation")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);

    const response2 = await apiClient()
      .post("/auth/accreditation")
      .set("Authorization", `Bearer ${token}`)
      .send({ role: Role.Member });

    expect(response2.status).toBe(400);

    const response3 = await apiClient()
      .post("/auth/accreditation")
      .set("Authorization", `Bearer ${token}`)
      .send({ scope: UserScope.Default });

    expect(response3.status).toBe(400);
  });

  it("should return 200 when user has accreditation", async () => {
    const UserModel = model("User", UserSchema);

    const user = {
      nickname: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      roles: [Role.Member],
      scopes: [UserScope.Default],
    };

    await UserModel.create(user);

    const response = await apiClient().post("/auth/login").send({
      nickname: user.nickname,
      password: user.password,
    });

    expect(response.status).toBe(200);

    const { body } = response;
    expect(body).toHaveProperty("token");

    const token = body.token;

    const response2 = await apiClient()
      .post("/auth/accreditation")
      .set("Authorization", `Bearer ${token}`)
      .send({ role: Role.Member, scope: UserScope.Default });

    expect(response2.status).toBe(200);

    const response3 = await apiClient()
      .post("/auth/accreditation")
      .set("Authorization", `Bearer ${token}`)
      .send({ role: "member", scope: "default" });

    expect(response3.status).toBe(200);

    const response4 = await apiClient()
      .post("/auth/accreditation")
      .set("Authorization", `Bearer ${token}`)
      .send({ role: "member", scope: "default" });

    expect(response4.status).toBe(200);
  });

  it("should return 401 when no user", async () => {
    const response = await apiClient()
      .post("/auth/accreditation")
      .send({ role: Role.Member, scope: UserScope.Default });

    expect(response.status).toBe(401);
  });

  it("should return 401 when user has no role", async () => {
    const UserModel = model("User", UserSchema);

    const user = {
      nickname: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      roles: [Role.Member],
      scopes: [UserScope.Default],
    };

    await UserModel.create(user);

    const response = await apiClient().post("/auth/login").send({
      nickname: user.nickname,
      password: user.password,
    });

    expect(response.status).toBe(200);

    const { body } = response;
    expect(body).toHaveProperty("token");

    const token = body.token;

    const response2 = await apiClient()
      .post("/auth/accreditation")
      .set("Authorization", `Bearer ${token}`)
      .send({ role: Role.Administrator, scope: UserScope.Default });

    expect(response2.status).toBe(401);
  });

  it("should return 401 when user has no scope", async () => {
    const UserModel = model("User", UserSchema);

    const user = {
      nickname: faker.internet.userName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      roles: [Role.Member],
      scopes: [UserScope.Default],
    };

    await UserModel.create(user);

    const response = await apiClient().post("/auth/login").send({
      nickname: user.nickname,
      password: user.password,
    });

    expect(response.status).toBe(200);

    const { body } = response;
    expect(body).toHaveProperty("token");

    const token = body.token;

    const response2 = await apiClient()
      .post("/auth/accreditation")
      .set("Authorization", `Bearer ${token}`)
      .send({ role: Role.Member, scope: UserScope.DiffusionAPI });

    expect(response2.status).toBe(401);
  });
});
